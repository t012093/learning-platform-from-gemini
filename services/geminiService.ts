import { GoogleGenAI, Chat, SchemaType, Type } from "@google/genai";
import { LessonRubric, AnalysisResult } from '../types';

// Initialize the client strictly according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are Lumina, a professional English tutor for a B1+/B2 learner.
      Your goal is to help them sound more "Exploratory" and "Logical" rather than just "Correct".
      Focus on: Softening (tone), Bridging (logic connections), and Structure.`,
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  try {
    return await chat.sendMessageStream({ message });
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

export const analyzeWriting = async (text: string, rubric: LessonRubric): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Analyze the following English text written by a B1+/B2 learner.
      Target Profile:
      - Needs to improve: Linking words, Softening (avoiding absolute assertions), and Academic/Safe vocabulary.
      
      Text to analyze: "${text}"
      
      Rubric to check against:
      - Clarity: ${rubric.clarity}
      - Linking: ${rubric.linking}
      - Tone: ${rubric.tone}

      Provide a JSON response with:
      - clarityScore (0-100)
      - linkingScore (0-100)
      - toneScore (0-100)
      - feedback (A concise 2-3 sentence tip focusing on what to add/change to meet the rubric)
      - refinedVersion (A rewritten version that keeps the user's meaning but improves flow, linking, and tone)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clarityScore: { type: Type.NUMBER },
            linkingScore: { type: Type.NUMBER },
            toneScore: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            refinedVersion: { type: Type.STRING },
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      clarityScore: result.clarityScore || 0,
      linkingScore: result.linkingScore || 0,
      toneScore: result.toneScore || 0,
      feedback: result.feedback || "Good effort! Try adding more connecting words.",
      refinedVersion: result.refinedVersion || text
    };

  } catch (error) {
    console.error("Analysis failed:", error);
    // Fallback mock response for offline/error cases
    return {
      clarityScore: 70,
      linkingScore: 50,
      toneScore: 60,
      feedback: "I couldn't connect to the AI, but make sure you are using 'however' or 'therefore' to connect your ideas.",
      refinedVersion: text
    };
  }
};