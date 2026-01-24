import { OpenRouter } from "@openrouter/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || ""
});

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

export async function analyzePatterns(newContent: string, pastContext: { content: string, date: Date }[]) {
  if (!process.env.OPENROUTER_API_KEY) return [];

  try {
    const contextString = pastContext.map(t => `- [${t.date.toISOString().split('T')[0]}] ${t.content}`).join('\n');
    
    const stream = await openrouter.chat.send({
      model: "gpt-oss-120b",
      messages: [
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
      ],
    });

    const result = stream as any;
    const text = result.choices[0]?.message?.content;
    if (!text) return [];

    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const json = JSON.parse(cleanText);
    return json.patterns || [];

  } catch (error) {
    console.error("Pattern analysis failed:", error);
    return [];
  }
}

export async function analyzeThought(content: string) {
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn("OPENROUTER_API_KEY is missing. Skipping AI analysis.");
    return null;
  }

  try {
    // Using a reliable model from OpenRouter
    const stream = await openrouter.chat.send({
      model: "gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are an expert cognitive assistant for "Praxis AI". 
          Process the user's mind dump and return a JSON object.
          Keys: "processedContent" (concise action/idea), "suggestedImportance" ("TODAY", "WEEK", "LATER", or "NOT_IMPORTANT"), "tags" (array of 2-3 strings).
          Return ONLY the raw JSON object. No markdown.`
        },
        {
          role: "user",
          content: content
        }
      ],
    });

    // The SDK's send method returns the full response if stream is not true (default behavior usually)
    // However, let's handle the response structure based on common SDK patterns
    const result = stream as any;
    const text = result.choices[0]?.message?.content;

    if (!text) return null;

    // Clean up markdown if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("OpenRouter AI Analysis Failed:", error);
    return null;
  }
}

export async function transcribeAudioBuffer(audioBuffer: Buffer): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY missing for transcription.");
    return null;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/webm",
          data: audioBuffer.toString("base64")
        }
      },
      { text: "Transcribe this audio exactly. Do not add any commentary." }
    ]);
    
    return result.response.text();
  } catch (error) {
    console.error("Transcription failed:", error);
    return null;
  }
}