import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── OpenRouter (primary) ─────────────────────────────────────────────────────

const OPENROUTER_MODEL = "tencent/hunyuan-a13b-instruct:free";

async function fetchWithTimeout(url: string, options: any, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function fetchOpenRouter(
  messages: { role: string; content: string }[],
  model = OPENROUTER_MODEL
): Promise<string | null> {
  if (!process.env.OPENROUTER_API_KEY) return null;
  try {
    const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://praxis-ai.vercel.app",
        "X-Title": "Praxis AI",
      },
      body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 1200 }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No error body");
      console.error(`OpenRouter error (${response.status}):`, errorText);
      return null;
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("OpenRouter request timed out after 15s");
    } else {
      console.error("OpenRouter fetch failed:", error.message || error);
    }
    return null;
  }
}

function stripJsonFences(text: string): string {
  return text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
}

// ─── Gemini (fallback) ────────────────────────────────────────────────────────

async function fetchGemini(prompt: string): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { temperature: 0.7, maxOutputTokens: 1200, responseMimeType: "application/json" },
    });
    const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini Timeout')), 15000))
    ]) as any;
    return result.response.text() ?? null;
  } catch (err: any) {
    console.warn(`Gemini 2.0 failed: ${err.message}. Trying 1.5 fallback...`);
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
      });
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini Timeout')), 15000))
      ]) as any;
      return result.response.text() ?? null;
    } catch (err2: any) {
      console.error("Gemini fallback failed completely:", err2.message);
      return null;
    }
  }
}

// ─── Embeddings ───────────────────────────────────────────────────────────────

export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY missing for embeddings.");
    return null;
  }
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Embedding generation failed:", error);
    return null;
  }
}

// ─── Thought analysis ─────────────────────────────────────────────────────────

const THOUGHT_SYSTEM_PROMPT = `You are an expert cognitive assistant for "Praxis AI", an AI-powered memory journal.
Process the user's thought and return a JSON object with EXACTLY these keys:
1. "processedContent": A concise, action-oriented version of the thought (1 sentence).
2. "suggestedImportance": One of "TODAY", "WEEK", "LATER", or "NOT_IMPORTANT".
3. "tags": Array of 2-3 lowercase keyword strings.
4. "linguisticPrecision": ONE sentence of feedback on how they can state this thought more clearly or concisely.
5. "perspectiveShifts": Array of exactly 2 objects, each with:
   - "label": A unique cognitive lens (e.g. "Stoic Filter", "First Principles", "Devil's Advocate", "10-Year View")
   - "content": A 1-sentence re-framing through that lens.

Return ONLY valid JSON — no markdown fences, no explanation.`;

export async function analyzeThought(content: string) {
  // Primary: OpenRouter (Tencent Hunyuan A13B)
  let rawText = await fetchOpenRouter([
    { role: "system", content: THOUGHT_SYSTEM_PROMPT },
    { role: "user", content: content },
  ]);

  // Fallback: Gemini
  if (!rawText) {
    rawText = await fetchGemini(`${THOUGHT_SYSTEM_PROMPT}\n\nThought: ${content}`);
  }

  if (!rawText) {
    console.error("analyzeThought: OpenRouter and Gemini both failed.");
    return null;
  }

  try {
    return JSON.parse(stripJsonFences(rawText));
  } catch (error) {
    console.error("analyzeThought JSON parse failed. Raw:", rawText.substring(0, 200));
    return null;
  }
}

// ─── Pattern analysis ─────────────────────────────────────────────────────────

const PATTERN_SYSTEM_PROMPT = `You are the "Pattern Analyzer" of a cognitive memory journal.
Analyze the NEW THOUGHT against the USER'S PAST THOUGHTS.

Look for:
1. RECURRENCE: Is this a recurring theme or concern?
2. CONTRADICTION: Does this contradict or conflict with a past thought?
3. CONNECTION: Does this relate to a seemingly unrelated past topic?

Return a JSON object with a "patterns" array. Each item has:
- "title": Short descriptive title (e.g. "Recurring Focus Anxiety")
- "description": One sentence explanation.
- "type": "RECURRENCE" | "CONTRADICTION" | "CONNECTION"
- "confidence": 0.0 to 1.0
- "suggestedAction": 2-3 short bulleted action steps IF the pattern is negative/problematic, otherwise null.

If no strong patterns found, return { "patterns": [] }.
Return ONLY valid JSON — no markdown fences.`;

export async function analyzePatterns(
  newContent: string,
  pastContext: { content: string; date: Date }[]
) {
  if (!pastContext.length) return [];

  const contextStr = pastContext
    .slice(0, 30)
    .map(t => `- [${t.date instanceof Date ? t.date.toISOString().split("T")[0] : t.date}] ${t.content}`)
    .join("\n");

  const userMessage = `PAST THOUGHTS:\n${contextStr}\n\nNEW THOUGHT:\n${newContent}`;

  // Primary: OpenRouter (Tencent Hunyuan A13B)
  let rawText = await fetchOpenRouter([
    { role: "system", content: PATTERN_SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ]);

  // Fallback: Gemini
  if (!rawText) {
    rawText = await fetchGemini(`${PATTERN_SYSTEM_PROMPT}\n\n${userMessage}`);
  }

  if (!rawText) return [];

  try {
    const json = JSON.parse(stripJsonFences(rawText));
    return json.patterns ?? [];
  } catch (error) {
    console.error("analyzePatterns JSON parse failed. Raw:", rawText.substring(0, 200));
    return [];
  }
}

// ─── Audio transcription ──────────────────────────────────────────────────────

export async function transcribeAudioBuffer(audioBuffer: Buffer): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY missing for transcription.");
    return null;
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/webm",
          data: audioBuffer.toString("base64"),
        },
      },
      { text: "Transcribe this audio exactly as spoken. Return only the transcription text." },
    ]);
    const text = result.response.text();
    return text?.trim() || null;
  } catch (error) {
    console.error("Transcription failed:", error);
    return null;
  }
}
