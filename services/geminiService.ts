import { GoogleGenAI, Chat, Type } from "@google/genai";
import { LessonRubric, AnalysisResult, GeneratedCourse, GeneratedChapter, Big5Profile, AIAdvice, AssessmentProfile } from '../types';
import { retrieveBlenderContext } from './blenderRagService';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Configuration Interfaces ---
export interface GenerateCourseConfig {
  targetAudience?: string;
  slideDesignTheme?: string;
  slideGranularity?: string;
  ragSources?: string[];
  courseType?: 'general' | 'creative' | 'technical';
  knowledgeDepth?: 'Broad' | 'Deep';
  referenceVersion?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  learningPathType?: 'Linear' | 'Exploratory';
  colorPalette?: { primary: string; secondary: string; accent: string; bg: string };
  brandKeywords?: string[];
  typographyHint?: string;
  teacherPersona?: string;
}

const DEFAULT_CONFIG: GenerateCourseConfig = {
  targetAudience: "一般的な学習者",
  slideDesignTheme: "シンプルで洗練されたデザイン。視認性重視。",
  slideGranularity: "各行は十分な情報量を持たせること（目安30文字以上）。単語の羅列ではなく、理由や背景を含めた文章として記述する。",
  courseType: 'general',
  knowledgeDepth: 'Broad',
  difficultyLevel: 'Beginner',
  learningPathType: 'Linear',
  colorPalette: { primary: "#4f46e5", secondary: "#64748b", accent: "#10b981", bg: "#f8fafc" },
  brandKeywords: ["Clean", "Professional", "Minimal", "Trusted"],
  typographyHint: "Sans-serif (Inter, Roboto)",
  teacherPersona: "親しみやすく知的。『一緒に学ぼう』というスタンス。専門用語は必ず平易な言葉で言い換える。少しお茶目な一面も見せる。"
};

const CREATIVE_CONFIG: GenerateCourseConfig = {
  targetAudience: "クリエイター/アーティスト",
  slideDesignTheme: "クリエイター向けダークテーマ。グラスモーフィズム、ネオンエフェクト、奥行きのあるレイヤー構造。",
  slideGranularity: `詳細かつ具体的.`,
  courseType: 'creative',
  knowledgeDepth: 'Deep',
  difficultyLevel: 'Intermediate',
  learningPathType: 'Exploratory',
  colorPalette: { primary: "#6366f1", secondary: "#a855f7", accent: "#06b6d4", bg: "#020617" },
  brandKeywords: ["Cyberpunk", "High-fidelity", "Immersive", "Vibrant"],
  typographyHint: "Monospace for code, Bold Display for titles",
  teacherPersona: "『愛されキャラ×クリエイティブ・ミューズ』のミックス。明るく、想像力を刺激する語り口。"
};

// --- Helpers ---
const parseJsonFromResponse = (text: string) => {
    try {
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Parse Error. Raw text:", text);
        throw e;
    }
};

const extractKeywords = (text: string): string[] => {
  return text.split(/[\\s、。,.]+/).map(t => t.trim()).filter(Boolean).slice(0, 6);
};

// --- Chat & Analysis ---

export const createChatSession = (systemInstruction?: string, modelType: 'standard' | 'pro' = 'standard'): Chat => {
  const defaultInstruction = `You are Lumina, a professional AI tutor. Your goal is to provide insightful guidance.`;
  const modelName = modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.5-flash';
  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: systemInstruction || defaultInstruction,
    },
  });
};

/**
 * Creates a chat session for scoping the user's learning intent.
 */
export const createScopingChat = (
  profile: Big5Profile | null,
  modelType: 'standard' | 'pro' | 'gemini-2.5-flash' | 'gemini-2.5-pro' = 'gemini-2.5-flash'
): Chat => {
  const modelName =
    modelType === 'gemini-2.5-pro'
      ? 'gemini-2.5-pro'
      : modelType === 'gemini-2.5-flash'
      ? 'gemini-2.5-flash'
      : modelType === 'pro'
      ? 'gemini-3.0-pro'
      : 'gemini-2.0-flash';
  const instruction = `
    あなたは「Lumina 学習コンシェルジュ」です。
    ユーザーが何を学びたいかをヒアリングし、最高のパーソナライズカリキュラムを作るための準備をします。

    【ヒアリングの目的】
    1. 具体的な学習トピックの特定
    2. 学習の目的（なぜ学びたいか）
    3. 現在の知識レベル（初心者か、経験者か）
    4. 特に重点を置きたいポイント

    【振る舞い】
    - 最初は「こんにちは！今日はどんなことを学びたいですか？」と優しく話しかけてください。
    - ユーザーのBig5特性（${JSON.stringify(profile)}）を考慮した口調で接してください。
    - 1回ですべて聞こうとせず、対話を通じて自然に引き出してください。
    - 十分な情報が集まったと判断したら、「完璧なプランが見えました！カリキュラムを生成しましょうか？」と提案してください。
  `;

  return ai.chats.create({
    model: modelName,
    config: { systemInstruction: instruction }
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  try {
    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

export const analyzeWriting = async (text: string, rubric: LessonRubric, modelType: 'standard' | 'pro' = 'standard'): Promise<AnalysisResult> => {
  const modelName = modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.5-flash';
  const prompt = `Analyze this text: "${text}". Rubric: ${JSON.stringify(rubric)}. Return JSON.`;
  
  try {
    const response = await ai.models.generateContent({
      model: modelName,
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
            refinedVersion: { type: Type.STRING }
          },
          required: ["clarityScore", "linkingScore", "toneScore", "feedback", "refinedVersion"]
        }
      }
    });
    return parseJsonFromResponse(response.text || '{}');
  } catch (error) {
    console.error("Writing analysis failed:", error);
    throw error;
  }
};

// --- 1. STRATEGIST: Analysis Engine (The Insight Council) ---

const analyzeCorePersonality = async (scores: Big5Profile, modelName: string) => {
  const prompt = `あなたは「The Profiler」です。日本語で回答。スコア: ${JSON.stringify(scores)}. @@@区切りで personalityType, strengths, growthTips, learningStrategyを。`;
  const response = await ai.models.generateContent({ model: modelName, contents: prompt });
  const parts = (response.text || '').split('@@@').map(p => p.trim());
  const getVal = (key: string) => (parts.find(p => p.toLowerCase().includes(key.toLowerCase())) || '').split(':').slice(1).join(':').trim();
  const getList = (raw: string) => raw.split('|').map(item => {
    const [t, d] = item.split(/[:：]/).map(s => s.trim());
    return { title: t || 'Point', description: d || t || 'Analyzing...' };
  }).filter(i => i.title.length > 0);
  const lsParts = getVal('learningStrategy').split('|').map(s => s.trim());

  return {
    personalityType: getVal('personalityType').replace(/['"「」]/g, '') || 'バランサー',
    strengths: getList(getVal('strengths')),
    growthTips: getList(getVal('growthTips')),
    learningStrategy: {
      title: lsParts[0] || 'Strategic Learning',
      approach: lsParts[1] || 'Personalized approach',
      steps: lsParts.slice(2).map(s => ({ label: 'Step', action: s }))
    }
  };
};

const analyzeCareer = async (scores: Big5Profile, modelName: string) => {
  const prompt = `あなたは「The Career Coach」です。日本語。スコア: ${JSON.stringify(scores)}. @@@区切りで careerCompatibility, role, bestSync, warning, hiddenTalentを。`;
  const response = await ai.models.generateContent({ model: modelName, contents: prompt });
  const parts = (response.text || '').split('@@@').map(p => p.trim());
  const getVal = (key: string) => (parts.find(p => p.toLowerCase().includes(key.toLowerCase())) || '').split(':').slice(1).join(':').trim();
  const htParts = getVal('hiddenTalent').split('|').map(s => s.trim());

  return {
    careerCompatibility: getVal('careerCompatibility') || 'Analyzing...',
    businessPartnership: {
      role: getVal('role') || 'Expert',
      bestSync: getVal('bestSync') || 'Partner',
      warning: getVal('warning') || 'Communication'
    },
    hiddenTalent: { title: htParts[0] || 'Potential', description: htParts[1] || 'Skill' }
  };
};

const analyzeRelationships = async (scores: Big5Profile, modelName: string) => {
  const prompt = `あなたは「The Relationship Expert」です。日本語。スコア: ${JSON.stringify(scores)}. style, idealPartner, adviceをパイプ|区切りで。`;
  const response = await ai.models.generateContent({ model: modelName, contents: prompt });
  const val = (response.text || '').split('|').map(s => s.trim());
  return {
    relationshipAnalysis: {
      style: val[0] || 'Social',
      idealPartner: val[1] || 'Supporter',
      advice: val[2] || 'Be open'
    }
  };
};

export const analyzePersonality = async (scores: Big5Profile): Promise<AIAdvice & { personalityType: string }> => {
  const modelName = 'gemini-2.5-pro'; 
  try {
    const [core, career, social] = await Promise.all([
      analyzeCorePersonality(scores, modelName),
      analyzeCareer(scores, modelName),
      analyzeRelationships(scores, modelName)
    ]);
    return { ...core, ...career, ...social };
  } catch (error) {
    console.error("Personality analysis failed:", error);
    throw error;
  }
};

// --- AGENTIC FUNCTIONS (Pedagogical) ---

interface PedagogicalStrategy { strategy: string; persona: string; reasoning: string; }

const generatePedagogicalStrategy = (profile: Big5Profile, assessment?: AssessmentProfile): PedagogicalStrategy => {
  let strategy = "教育スタイルガイド:\n";
  let persona = "AI Tutor Lumina.";
  let reasoning = "Optimized for user profile.";

  if (profile.openness > 70) {
    strategy += "- **抽象的・概念的アプローチ**: メタファー多用。\n";
    persona = "情熱的なビジョナリー。";
  } else if (profile.openness < 40) {
    strategy += "- **具体的・実用的アプローチ**: 実践重視。\n";
    persona = "実用的なガイド。";
  }

  if (assessment?.aiAdvice) {
    const advice = assessment.aiAdvice;
    strategy += `\n- **強みの活用**: ${advice.strengths.map(s => s.title).join('、')}を活かした構成。\n`;
  }

  return { strategy, persona, reasoning };
};

const generateCourseOutline = async (
  topic: string,
  strategy: PedagogicalStrategy,
  config: GenerateCourseConfig,
  ragSection: string,
  modelName: string,
  intent?: string,
  intentMeta?: string
) => {
    const prompt = `
      あなたは「Architect (設計士)」です。必ず日本語で回答してください。
      トピック: ${topic}
      具体的要望: ${intent || '特になし'}
      ユーザー意図(構造化メタ):
      ${intentMeta || 'なし'}
      ペルソナ: ${strategy.persona}
      教育戦略: ${strategy.strategy}
      ${ragSection}
      【出力要件】
      1. Title: 学習者の特性に響く魅力的なタイトル。
      2. Description: なぜこの構成が学習者に最適なのかを含む説明。
      3. Chapters: 4〜6個。各章の狙いを詳細に定義。
      回答はJSONのみ。
    `;
    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            maxOutputTokens: 8192,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    chapters: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                duration: { type: Type.STRING },
                                type: { type: Type.STRING },
                                content: { type: Type.STRING },
                                whyItMatters: { type: Type.STRING },
                                keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                                actionStep: { type: Type.STRING },
                                analogy: { type: Type.STRING }
                            },
                            required: ["title", "duration", "type", "content", "whyItMatters", "keyConcepts", "actionStep", "analogy"]
                        }
                    }
                },
                required: ["title", "description", "chapters"]
            }
        }
    });
    return parseJsonFromResponse(response.text || '{}');
};

const generateChapterDetails = async (idx: number, ch: GeneratedChapter, topic: string, strategy: PedagogicalStrategy, config: GenerateCourseConfig, modelName: string) => {
    const prompt = `
      あなたは「Creator (作家)」です。必ず日本語で回答してください。
      チャプター: ${idx + 1}. ${ch.title}
      ペルソナ: ${strategy.persona} (この口調でナレーションを記述)
      教育戦略: ${strategy.strategy}
      【要件】
      - Slides: 3〜6枚。
      - 各スライドに speechScript (ナレーション原稿) を必ず含めること。
      - 内容は具体的かつ濃密に。
      回答はJSONのみ。
    `;
    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            maxOutputTokens: 8192,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    slides: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                speechScript: { type: Type.STRING },
                                bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                                imagePrompt: { type: Type.STRING },
                                highlightBox: { type: Type.STRING }
                            },
                            required: ["title", "speechScript", "bullets", "imagePrompt"]
                        }
                    }
                },
                required: ["slides"]
            }
        }
    });
    const parsed = parseJsonFromResponse(response.text || '{}');
    return { ...ch, id: idx + 1, slides: parsed.slides || [] };
};

export const generateCourse = async (
  topic: string, 
  modelType: 'standard' | 'pro' | 'gemini-2.5-flash' | 'gemini-2.5-pro' = 'gemini-2.5-flash', 
  profile?: Big5Profile,
  config?: GenerateCourseConfig,
  assessment?: AssessmentProfile,
  intent?: string,
  intentMeta?: string
): Promise<GeneratedCourse> => {
  const modelName = modelType === 'gemini-2.5-pro' ? 'gemini-2.5-pro' : modelType === 'gemini-2.5-flash' ? 'gemini-2.5-flash' : modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.0-flash';
  const targetProfile = profile || { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
  const strategy = generatePedagogicalStrategy(targetProfile, assessment);
  const ragKeywords = extractKeywords(topic);
  const blenderDocs = await retrieveBlenderContext(topic, 2);
  const ragSection = blenderDocs.length ? `【参考情報】\n${blenderDocs.map(doc => `- ${doc.text}`).join('\n')}` : '';
  const outline = await generateCourseOutline(topic, strategy, config || DEFAULT_CONFIG, ragSection, modelName, intent, intentMeta);
  const chapterPromises = outline.chapters.map((ch: any, idx: number) => generateChapterDetails(idx, ch, topic, strategy, config || DEFAULT_CONFIG, modelName));
  const fullChapters = await Promise.all(chapterPromises);

  return {
    id: crypto.randomUUID(),
    title: outline.title,
    description: outline.description,
    duration: "Flexible",
    chapters: fullChapters,
    createdAt: new Date(),
    modelUsed: modelType,
    targetProfile: targetProfile,
    teacherPersona: { name: "Lumina", role: "AI Tutor", tone: strategy.persona, greeting: "こんにちは！" },
    personalizationReasoning: strategy.reasoning
  };
};

export const getMockBlenderCourse = (): GeneratedCourse => ({
    id: 'mock-blender-101',
    title: "Blender 4.0: 3D造形入門",
    description: "あなたの創造性を形にする、究極の3Dモデリング体験。",
    duration: "2時間30分",
    createdAt: new Date(),
    modelUsed: 'pro',
    chapters: []
});

export const generateAudioContent = async (speechScript: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ role: "user", parts: [{ text: speechScript }] }],
    config: { responseMimeType: "audio/mp3" },
  });
  return response.response.candidates?.[0].content.parts[0].inlineData?.data || '';
};

export const retrieveRelevantContent = (keywords: string[]): any[] => [];
