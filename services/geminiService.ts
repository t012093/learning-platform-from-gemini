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
  slideGranularity: `詳細かつ具体的.`, // This is a template literal, no escaping needed here.
  courseType: 'creative',
  knowledgeDepth: 'Deep',
  difficultyLevel: 'Intermediate',
  learningPathType: 'Exploratory',
  colorPalette: { primary: "#6366f1", secondary: "#a855f7", accent: "#06b6d4", bg: "#020617" },
  brandKeywords: ["Cyberpunk", "High-fidelity", "Immersive", "Vibrant"],
  typographyHint: "Monospace for code, Bold Display for titles",
  teacherPersona: "『愛されキャラ×クリエイティブ・ミューズ』のミックス。明るく、想像力を刺激する語り口。"
};

// --- Chat & Analysis ---
export const createChatSession = (systemInstruction?: string, modelType: 'standard' | 'pro' = 'standard'): Chat => {
  const defaultInstruction = `You are Lumina, a professional English tutor for a B1+/B2 learner.
      Your goal is to help them sound more "Exploratory" and "Logical" rather than just "Correct".
      Focus on: Softening (tone), Bridging (logic connections), and Structure.`;

  const modelName = modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.5-flash';

  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: systemInstruction || defaultInstruction,
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

export const analyzeWriting = async (text: string, rubric: LessonRubric, modelType: 'standard' | 'pro' = 'standard'): Promise<AnalysisResult> => {
  const modelName = modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.5-flash';

  const prompt = `
    Analyze the following English text based on the provided rubric.
    Return the analysis as a JSON object matching the required schema.

    TEXT: "${text}"

    RUBRIC:
    - Clarity: ${rubric.clarity}
    - Linking: ${rubric.linking}
    - Tone: ${rubric.tone}

    OUTPUT SCHEMA:
    {
      "clarityScore": number (0-100),
      "linkingScore": number (0-100),
      "toneScore": number (0-100),
      "feedback": string (concise explanation),
      "refinedVersion": string (improved version of the text)
    }

    Response must be JSON only.
  `;

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

// --- 1. STRATEGIST: Analysis Engine (The Insight Council) ---

// Agent A: The Profiler
const analyzeCorePersonality = async (scores: Big5Profile, modelName: string) => {
  const prompt = `
    あなたは「The Profiler (心理分析官)」です。必ず日本語で回答してください。
    以下のBig5スコアに基づき、性格特性と学習戦略を詳細に分析してください。

    スコア: Openness:${scores.openness}, Conscientiousness:${scores.conscientiousness}, Extraversion:${scores.extraversion}, Agreeableness:${scores.agreeableness}, Neuroticism:${scores.neuroticism}

    以下のフォーマットを厳守してください。区切り文字「@@@」を必ず入れてください。
    
    personalityType: [性格タイプ]
    @@@
    strengths: [強み1]: [詳細な説明] | [強み2]: [詳細な説明] | [強み3]: [詳細な説明]
    @@@
    growthTips: [アドバイス1]: [詳細な説明] | [アドバイス2]: [詳細な説明] | [アドバイス3]: [詳細な説明]
    @@@
    learningStrategy: [戦略名] | [基本方針の説明] | [具体ステップ1] | [具体ステップ2] | [具体ステップ3]

    ※性格タイプは '冒険家', '戦略家', 'サポーター', '思想家', '職人', 'バランサー' から1つ。
  `;

  const response = await ai.models.generateContent({ model: modelName, contents: prompt });
  const parts = (response.text || '').split('@@@').map(p => p.trim());

  const getSectionValue = (key: string) => {
      const found = parts.find(p => p.toLowerCase().includes(key.toLowerCase()));
      if (!found) return '';
      return found.substring(found.indexOf(':') + 1).trim();
  };

  const parseList = (raw: string) => {
      return raw.split('|').map(item => {
          const [t, d] = item.split(/[:：]/).map(s => s.trim());
          return { title: t || '分析中...', description: d || t || '詳細を生成中...' };
      }).filter(i => i.title.length > 0);
  };

  const lsParts = getSectionValue('learningStrategy').split('|').map(s => s.trim());

  return {
    personalityType: getSectionValue('personalityType').replace(/['"「」]/g, '') || 'バランサー',
    strengths: parseList(getSectionValue('strengths')),
    growthTips: parseList(getSectionValue('growthTips')),
    learningStrategy: {
      title: lsParts[0] || '個別最適化戦略',
      approach: lsParts[1] || 'あなたの特性に合わせた学習アプローチ',
      steps: lsParts.slice(2).map(s => ({ label: 'Step', action: s }))
    }
  };
};

// Agent B: The Career Coach
const analyzeCareer = async (scores: Big5Profile, modelName: string) => {
  const prompt = `
    あなたは「The Career Coach (キャリア戦略家)」です。必ず日本語で回答してください。
    以下のスコアに基づき、ビジネス適性と職業的アイデンティティを深く分析してください。
    スコア: O:${scores.openness}, C:${scores.conscientiousness}, E:${scores.extraversion}, A:${scores.agreeableness}, N:${scores.neuroticism}

    以下のフォーマットで回答してください。区切り文字「@@@」を厳守。

    careerCompatibility: [あなたが最も輝く環境と、その理由を2文で詳細に]
    @@@
    role: [役割の名称]: [その役割がチームにどのような価値をもたらすかの具体的な解説]
    @@@
    bestSync: [相性の良いタイプ名]: [なぜその人と組むと相乗効果が生まれるかの解説]
    @@@
    warning: [注意すべき課題]: [それが仕事にどう影響するかと、具体的な対策のアドバイス]
    @@@
    hiddenTalent: [潜在能力の名前] | [その能力がどのような場面で発揮されるかの説明]
  `;

  const response = await ai.models.generateContent({ model: modelName, contents: prompt });
  const parts = (response.text || '').split('@@@').map(p => p.trim());
  
  const getSectionValue = (key: string) => {
    const found = parts.find(p => p.toLowerCase().includes(key.toLowerCase()));
    if (!found) return '';
    return found.substring(found.indexOf(':') + 1).trim();
  };

  const htRaw = getSectionValue('hiddenTalent');
  let htParts = htRaw.split('|').map(s => s.trim());
  if (htParts.length < 2 && htRaw.includes(':')) htParts = htRaw.split(':').map(s => s.trim());

  return {
    careerCompatibility: getSectionValue('careerCompatibility') || '現在分析中ですが、あなたの特性を活かせる環境を特定しています。',
    businessPartnership: {
      role: getSectionValue('role') || '専門家: 独自のスキルでチームに貢献します。',
      bestSync: getSectionValue('bestSync') || '補完的パートナー: あなたの弱点を支え、強みを引き出す相手です。',
      warning: getSectionValue('warning') || 'コミュニケーション: 高圧的な状況下での調整に注意が必要です。'
    },
    hiddenTalent: {
      title: htParts[0] || '潜在的ポテンシャル',
      description: htParts[1] || '新しい環境で開花する未知の才能。'
    }
  };
};

// Agent C: The Relationship Expert
const analyzeRelationships = async (scores: Big5Profile, modelName: string) => {
  const prompt = `
    あなたは「The Relationship Expert (対人関係専門家)」です。必ず日本語で回答してください。
    コミュニケーションスタイルを分析してください。
    スコア: O:${scores.openness}, C:${scores.conscientiousness}, E:${scores.extraversion}, A:${scores.agreeableness}, N:${scores.neuroticism}

    以下のフォーマットで回答してください。区切り文字「@@@」を厳守。

    relationshipAnalysis: [スタイル名]: [詳細な説明] | [理想のパートナー像]: [詳細] | [対人アドバイス]: [詳細]
  `;

  const response = await ai.models.generateContent({ model: modelName, contents: prompt });
  const val = (response.text || '').substring((response.text || '').indexOf(':') + 1).trim();
  const raParts = val.split('|').map(s => s.trim());

  const parsePair = (str: string, fallbackTitle: string) => {
      const [t, d] = str.split(/[:：]/).map(s => s.trim());
      return d ? `${t}: ${d}` : `${fallbackTitle}: ${t}`;
  };

  return {
    relationshipAnalysis: {
      style: parsePair(raParts[0] || '適応型', 'スタイル'),
      idealPartner: parsePair(raParts[1] || '共感型', '理想の相手'),
      advice: parsePair(raParts[2] || 'ありのままで', 'アドバイス')
    }
  };
};

export const analyzePersonality = async (scores: Big5Profile): Promise<AIAdvice & { personalityType: string }> => {
  const modelName = 'gemini-2.5-pro'; 
  try {
    console.log("🔍 Insight Council: Executing deep analysis with Gemini 2.5 Pro...");
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

// --- NEW AGENTIC FUNCTIONS (Pedagogical) ---

interface PedagogicalStrategy {
  strategy: string;
  persona: string;
  reasoning: string;
}

const generatePedagogicalStrategy = (profile: Big5Profile): PedagogicalStrategy => {
  let strategy = "教育スタイルガイド:\n";
  let persona = "";
  let reasoning = "";

  if (profile.openness > 70) {
    strategy += "- **抽象的・概念的アプローチ**: 「なぜ？」重視。メタファー多用。\n";
    persona = "情熱的でインスピレーションを与えるビジョナリー。";
    reasoning = "高い開放性に合わせて、概念的な繋がりを重視したスタイルを選択しました。";
  } else if (profile.openness < 40) {
    strategy += "- **具体的・実用的アプローチ**: 実践重視。Best Practices。\n";
    persona = "実用的で信頼できる実務家。";
    reasoning = "現実的な活用を重視する特性に合わせ、具体的な事実ベースの構成にしました。";
  } else {
    persona = "バランスの取れたプロフェッショナルな講師。";
  }

  if (profile.conscientiousness > 70) {
    strategy += "- **構造化・目標志向**: ステップバイステップ。効率重視。\n";
    reasoning += " 誠実性の高さに基づき、構造化された体系的な学習ステップを構築しました。";
  } else if (profile.conscientiousness < 40) {
    strategy += "- **柔軟性・ショートカット**: 試行錯誤（Trial and Error）推奨。\n";
    reasoning += " 自由な試行錯誤を好む傾向に合わせ、柔軟で遊び心のある進め方を採用しました。";
  }

  if (profile.extraversion > 70) {
    strategy += "- **アクティブ・社会的**: 対話的。「誰かに教えるつもりで」。\n";
    persona += " エネルギッシュで社交的なメンター。";
  } else if (profile.extraversion < 40) {
    strategy += "- **内省的・集中**: 落ち着いたトーン。自己分析的。\n";
    persona += " 冷静沈着で深く考えさせる分析家。";
  }

  if (profile.neuroticism > 70) {
    strategy += "- **安心感・リスク回避**: トラブルシューティング重視。\n";
    reasoning += " 慎重な性格を考慮し、リスク回避と安心感に重点を置いています。";
  } else {
    strategy += "- **挑戦・大胆さ**: 「失敗してもOK」。\n";
  }

  return { strategy, persona, reasoning };
};

// --- 2. ARCHITECT: Outline Generator ---
const generateCourseOutline = async (
    topic: string,
    strategy: PedagogicalStrategy,
    config: GenerateCourseConfig,
    ragSection: string,
    modelName: string
): Promise<{ title: string; description: string; chapters: GeneratedChapter[] }> => {
    const prompt = `
    あなたは「Architect (設計士)」です。必ず日本語で回答してください。
    トピック: ${topic}
    ペルソナ: ${strategy.persona}
    【教育戦略】${strategy.strategy}
    ${ragSection}
    【出力要件】
    1. Title: 魅力的なタイトル。
    2. Description: パーソナライズ理由（${strategy.reasoning}）を含む説明。
    3. Chapters: 4〜6個の構成。
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

// --- 3. CREATOR: Detail Generator ---
const generateChapterDetails = async (
    chapterIndex: number,
    chapterOutline: GeneratedChapter,
    topic: string,
    strategy: PedagogicalStrategy,
    config: GenerateCourseConfig,
    modelName: string
): Promise<GeneratedChapter> => {
    const prompt = `
    あなたは「Creator (作家)」です。必ず日本語で回答してください。
    チャプター: ${chapterIndex + 1}. ${chapterOutline.title}
    ペルソナ: ${strategy.persona}
    【要件】
    - Slides: 3〜6枚。
    - 各スライドに speechScript (ナレーション原稿) を必ず含めること。
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
    return { ...chapterOutline, id: chapterIndex + 1, slides: parsed.slides || [] };
};

export const generateCourse = async (
  topic: string, 
  modelType: 'standard' | 'pro' | 'gemini-2.5-flash' | 'gemini-2.5-pro' = 'gemini-2.5-flash', 
  profile?: Big5Profile,
  config?: GenerateCourseConfig,
  assessment?: AssessmentProfile
): Promise<GeneratedCourse> => {
  const modelName = 
    modelType === 'gemini-2.5-pro' ? 'gemini-2.5-pro' : 
    modelType === 'gemini-2.5-flash' ? 'gemini-2.5-flash' :
    modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.0-flash';
  const targetProfile = profile || { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
  const strategy = generatePedagogicalStrategy(targetProfile);
  
  const ragKeywords = extractKeywords(topic);
  const blenderDocs = await retrieveBlenderContext(topic, 2);
  const ragSection = blenderDocs.length ? `【参考情報】\n${blenderDocs.map(doc => `- ${doc.text}`).join('\n')}` : '';

  const outline = await generateCourseOutline(topic, strategy, config || DEFAULT_CONFIG, ragSection, modelName);
  const chapterPromises = outline.chapters.map((ch, idx) => generateChapterDetails(idx, ch, topic, strategy, config || DEFAULT_CONFIG, modelName));
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
    description: "あなたの創造性を形にする旅を始めましょう。",
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
