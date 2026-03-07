import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

async function fetchOpenRouter(messages: any[], model: string = "arcee-ai/trinity-large-preview:free") {
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn("OPENROUTER_API_KEY is missing.");
    return null;
  }

  try {
    console.log(`OpenRouter: Fetching ${model}...`);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://praxis-ai.vercel.app", 
        "X-Title": "Praxis AI",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API Error Status:", response.status, errorData);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenRouter Fetch Failed:", error);
    return null;
  }
}

export async function analyzePatterns(newContent: string, pastContext: { content: string, date: Date }[]) {
  const contextString = pastContext.map(t => `- [${t.date.toISOString().split('T')[0]}] ${t.content}`).join('\n');
  
  const content = await fetchOpenRouter([
    {
      role: "system",
      content: `You are the "Pattern Analyzer" of a cognitive augmentation system.
      Analyze the USER'S NEW THOUGHT against their PAST THOUGHTS.
      
      Look for:
      1. RECURRENCE: Is this a recurring theme?
      2. CONTRADICTION: Does this contradict past thoughts?
      3. CONNECTION: Does this relate to a seemingly unrelated past topic?
      
      Return a JSON object with a "patterns" array. Each pattern object should have:
      - "title": Short title (e.g. "Recurring Anxiety about Deadlines")
      - "description": One sentence explanation.
      - "type": "RECURRENCE" | "CONTRADICTION" | "CONNECTION"
      - "confidence": 0.0 to 1.0
      - "suggestedAction": String. IF the pattern is negative or problematic (e.g. anxiety, procrastination, contradiction), provide 2-3 short, bulleted steps to resolve it. Otherwise null.
      
      If no strong patterns found, return { "patterns": [] }.
      ONLY return JSON.`
    },
    {
      role: "user",
      content: `PAST THOUGHTS:\n${contextString}\n\nNEW THOUGHT:\n${newContent}`
    }
  ]);

  if (!content) return [];

  try {
    const cleanText = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const json = JSON.parse(cleanText);
    return json.patterns || [];
  } catch (error) {
    console.error("Pattern JSON Parse Failed:", error);
    return [];
  }
}

export async function analyzeThought(content: string) {
  const result = await fetchOpenRouter([
    {
      role: "system",
      content: `You are an expert cognitive assistant for "Praxis AI". 
      Process the user's mind dump and return a JSON object.
      
      REQUIRED KEYS:
      1. "processedContent": concise action/idea.
      2. "suggestedImportance": "TODAY", "WEEK", "LATER", or "NOT_IMPORTANT".
      3. "tags": array of 2-3 strings.
      4. "linguisticPrecision": ONE sentence of feedback on how they can state this thought more clearly or concisely (e.g. "Avoid filler words like 'maybe' to increase certainty").
      5. "perspectiveShifts": array of 2 objects:
         - "label": A unique cognitive framework (e.g. "Stoic Filter", "First Principles", "The Antagonist", "10-Year View").
         - "content": A 1-sentence re-framing of their thought through that lens.
      
      Return ONLY the raw JSON object. No markdown.`
    },
    {
      role: "user",
      content: content
    }
  ]);

  if (!result) return null;

  try {
    const cleanText = result.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Thought JSON Parse Failed:", error);
    return null;
  }
}

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
          data: audioBuffer.toString("base64")
        }
      },
      { text: "Transcribe this audio exactly as spoken. Do not add any commentary or corrections." }
    ]);
    
    const text = result.response.text();
    if (!text || text.trim().length === 0) {
      console.warn("Transcription returned empty response");
      return null;
    }
    return text;
  } catch (error) {
    console.error("Transcription failed:", error);
    return null;
  }
}
