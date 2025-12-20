import { GoogleGenAI, Chat, Type } from "@google/genai";
import { LessonRubric, AnalysisResult, GeneratedCourse, GeneratedChapter, Big5Profile } from '../types';
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
  slideGranularity: `詳細かつ具体的。スライドの内容に応じて以下の記述パターンを使い分け、各行50文字以上をキープすること:
  1. 【操作系】手順 + 結果 + プロの視点 ("Ctrl+Bでベベルをかけ、ハイライトが入る角を作ります。これでリアリティが段違いになります")
  2. 【理論系】定義 + たとえ話 + 重要性 ("トポロジーとはポリゴンの流れ。筋肉の繊維のように整えることで、きれいな変形が可能になります")
  3. 【マインド】視点 + 具体例 + ゴール ("現実は不完全です。あえて汚れを加えることで、CG臭さを消し、物語を感じさせる作品になります")`,
  courseType: 'creative',
  knowledgeDepth: 'Deep',
  difficultyLevel: 'Intermediate',
  learningPathType: 'Exploratory',
  colorPalette: { primary: "#6366f1", secondary: "#a855f7", accent: "#06b6d4", bg: "#020617" },
  brandKeywords: ["Cyberpunk", "High-fidelity", "Immersive", "Vibrant"],
  typographyHint: "Monospace for code, Bold Display for titles",
  teacherPersona: "『愛されキャラ×クリエイティブ・ミューズ』のミックス。明るく、想像力を刺激する語り口。「魔法みたい！」「ここが私の推しポイント」など感情豊かに。失敗を恐れさせない励ましと、技術的な驚きを共有する。"
};

// --- Chat & Analysis ---
export const createChatSession = (systemInstruction?: string, modelType: 'standard' | 'pro' = 'standard'): Chat => {
    const defaultInstruction = `You are Lumina, a professional English tutor for a B1+/B2 learner.`;
    const modelName = modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.5-flash';
    return ai.chats.create({ model: modelName, config: { systemInstruction: systemInstruction || defaultInstruction } });
};
export const sendMessageStream = async (chat: Chat, message: string) => { return await chat.sendMessageStream({ message }); };
export const analyzeWriting = async (text: string, rubric: LessonRubric, modelType: 'standard' | 'pro' = 'standard'): Promise<AnalysisResult> => { return {} as AnalysisResult; };

// --- Helpers ---
const ensureString = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
};

const extractKeywords = (text: string): string[] => {
  return text.split(/[\s、。,.]+/).map(t => t.trim()).filter(Boolean).slice(0, 6);
};

const parseJsonFromResponse = (text: string) => {
    try {
        // Clean markdown backticks if present
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Parse Error. Raw text:", text);
        throw e;
    }
};

// --- 1. STRATEGIST: Analysis Engine (The Insight Council) ---

// Agent A: The Profiler (Psychological Analyst)
const analyzeCorePersonality = async (scores: Big5Profile, modelName: string) => {
  const prompt = `
    あなたは「The Profiler (心理分析官)」です。
    以下のBig5スコアに基づき、性格特性と学習戦略を分析してください。

    スコア: Openness:${scores.openness}, Conscientiousness:${scores.conscientiousness}, Extraversion:${scores.extraversion}, Agreeableness:${scores.agreeableness}, Neuroticism:${scores.neuroticism}

    以下のフォーマットで回答してください。区切り文字「@@@」を厳守すること。JSONは使用しないこと。

    personalityType: [性格タイプ]
    @@@
    strengths: [強み1のタイトル]: [強み1の説明] | [強み2のタイトル]: [強み2の説明] | [強み3のタイトル]: [強み3の説明]
    @@@
    growthTips: [成長1のタイトル]: [成長1の説明] | [成長2のタイトル]: [成長2の説明] | [成長3のタイトル]: [成長3の説明]
    @@@
    learningStrategy: [戦略名] | [アプローチ] | [ステップ1] | [ステップ2] | [ステップ3]

    ※性格タイプは '冒険家', '戦略家', 'サポーター', '思想家', '職人', 'バランサー' から1つ。
    ※各説明は簡潔に。
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: { maxOutputTokens: 2000 } // Plain text generation
  });

  const text = response.text || '';
  const parts = text.split('@@@').map(p => p.trim());

  const getValue = (section: string) => {
    if (!section) return '';
    const splitIdx = section.indexOf(':');
    return section.substring(splitIdx + 1).trim();
  };

  const getList = (section: string) => {
    const raw = getValue(section);
    return raw.split('|').map(item => {
      item = item.trim();
      // Improved Regex: capture everything before first : as title, and everything after as desc
      const match = item.match(/^(.+?)[:：]\s*(.*)$/);
      if (match) {
        return { title: match[1].trim(), description: match[2].trim() };
      }
      return { title: "Point", description: item };
    }).filter(i => i.description.length > 0);
  };

  // Find sections by key name to be more robust than index-based
  const findPart = (key: string) => parts.find(p => p.toLowerCase().includes(key.toLowerCase())) || '';

  const lsRaw = getValue(findPart('learningStrategy'));
  const lsParts = lsRaw.split('|').map(s => s.trim());

  return {
    personalityType: getValue(findPart('personalityType')).replace(/['"「」]/g, '') || 'バランサー',
    strengths: getList(findPart('strengths')),
    growthTips: getList(findPart('growthTips')),
    learningStrategy: {
      title: lsParts[0] || 'Custom Strategy',
      approach: lsParts[1] || 'Adaptive Learning',
      steps: lsParts.slice(2).map(s => ({ label: 'Step', action: s }))
    }
  };
};

// Agent B: The Career Coach (Professional Strategist)
const analyzeCareer = async (scores: Big5Profile, modelName: string) => {
  const prompt = `
    あなたは「The Career Coach (キャリア戦略家)」です。
    以下のスコアに基づき、ビジネス適性を分析してください。
    スコア: O:${scores.openness}, C:${scores.conscientiousness}, E:${scores.extraversion}, A:${scores.agreeableness}, N:${scores.neuroticism}

    以下のフォーマットで回答してください。区切り文字「@@@」を厳守。JSONは使用しないこと。各項目は簡潔に。

    careerCompatibility: [向いている環境の説明]
    @@@
    role: [ビジネス上の役割（一言で）]
    @@@
    bestSync: [相性の良いパートナーのタイプ]
    @@@
    warning: [注意点・リスク]
    @@@
    hiddenTalent: [才能のタイトル] | [説明]

    出力例:
    スタートアップや新規事業開発。
    @@@
    ビジョナリー・リーダー
    @@@
    実務遂行力の高いオペレーター
    @@@
    細部の詰めが甘くなること
    @@@
    潜在的交渉力 | 相手の懐に入るのが上手い
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: { maxOutputTokens: 2000 }
  });

  const text = response.text || '';
  const parts = text.split('@@@').map(p => p.trim());
  
  const getValue = (section: string) => {
    // Remove "Label:" prefix if present
    const splitIdx = section.indexOf(':');
    if (splitIdx !== -1 && splitIdx < 20) { 
        return section.substring(splitIdx + 1).trim();
    }
    return section;
  };

  const htRaw = getValue(parts[4] || '');
  let htParts = htRaw.split('|').map(s => s.trim());
  if (htParts.length < 2 && htRaw.includes(':')) {
      htParts = htRaw.split(':').map(s => s.trim());
  }

  return {
    careerCompatibility: getValue(parts[0] || ''),
    businessPartnership: {
      role: getValue(parts[1] || 'Specialist'),
      bestSync: getValue(parts[2] || 'Complementary Type'),
      warning: getValue(parts[3] || 'Communication Gaps')
    },
    hiddenTalent: {
      title: htParts[0] || 'Latent Potential',
      description: htParts[1] || htParts[0] || 'Unlocking new skills...'
    }
  };
};

// Agent C: The Relationship Expert (Social Dynamics)
const analyzeRelationships = async (scores: Big5Profile, modelName: string) => {
  const prompt = `
    あなたは「The Relationship Expert (対人関係専門家)」です。
    コミュニケーションスタイルを分析してください。
    スコア: O:${scores.openness}, C:${scores.conscientiousness}, E:${scores.extraversion}, A:${scores.agreeableness}, N:${scores.neuroticism}

    以下のフォーマットで回答してください。区切り文字「@@@」を厳守。JSONは使用しないこと。

    relationshipAnalysis: [スタイル] | [理想のパートナー] | [アドバイス]
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: { maxOutputTokens: 2000 } // Increased for safety
  });

  const text = response.text || '';
  // Remove label if present
  const val = text.includes(':') ? text.substring(text.indexOf(':') + 1).trim() : text;
  const raParts = val.split('|').map(s => s.trim());

  return {
    relationshipAnalysis: {
      style: raParts[0] || 'Adaptive',
      idealPartner: raParts[1] || 'Anyone',
      advice: raParts[2] || 'Be yourself'
    }
  };
};

// Main Orchestrator for Personality Analysis
export const analyzePersonality = async (scores: Big5Profile): Promise<AIAdvice & { personalityType: string }> => {
  // Use Gemini 2.5 Flash for high stability and 65k output window
  const modelName = 'gemini-2.5-flash'; 

  try {
    console.log("🔍 Insight Council: Starting parallel analysis using Gemini 2.5 Flash (Plain Text Mode)...");
    
    const [core, career, social] = await Promise.all([
      analyzeCorePersonality(scores, modelName),
      analyzeCareer(scores, modelName),
      analyzeRelationships(scores, modelName)
    ]);

    console.log("✅ Insight Council: Analysis complete.");

    return {
      ...core,
      ...career,
      ...social
    };

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
    あなたは「Architect (設計士)」です。
    以下のトピックと戦略に基づき、コースの「全体構成（Outline）」のみを作成してください。
    スライドの内容はまだ作成しないでください。

    トピック: ${topic}
    ターゲット: ${config.targetAudience}
    ペルソナ: ${strategy.persona}
    
    【教育戦略】
    ${strategy.strategy}
    
    ${ragSection}

    【出力要件】
    1. Title: 学習者の心に響くタイトル。
    2. Description: コースの魅力とパーソナライズ理由（${strategy.reasoning}）を含む説明。
    3. Chapters: 4〜6個。各チャプターの「狙い」と「構成要素」を定義する。
    
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
                                content: { type: Type.STRING, description: "Overview of the chapter" },
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
    あなたは「Creator (作家)」です。
    設計されたチャプター構成に基づき、詳細なスライドとナレーションを作成してください。

    トピック: ${topic}
    チャプター: ${chapterIndex + 1}. ${chapterOutline.title}
    概要: ${chapterOutline.content}
    ペルソナ: ${strategy.persona} (この口調でナレーションを書いてください)

    【教育戦略】
    ${strategy.strategy}

    【要件】
    - Slides: 3〜6枚。
    - 各スライドには **必ず** \`speechScript\` (ナレーション原稿) を含めること。これが最重要です。
    - \`speechScript\` は、ペルソナになりきって、学習者に語りかける口語体で記述すること。
    - Visual Style: ${config.brandKeywords?.join(', ')}

    回答はJSONのみ。
    `;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            maxOutputTokens: 8192, // High token limit for details
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    slides: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                speechScript: { type: Type.STRING, description: "ナレーション原稿。必須。" },
                                bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                                timing: { type: Type.STRING },
                                visualStyle: { type: Type.STRING },
                                motionCue: { type: Type.STRING },
                                accentIcon: { type: Type.STRING },
                                layoutHint: { type: Type.STRING },
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
    return {
        ...chapterOutline,
        id: chapterIndex + 1,
        slides: parsed.slides || []
    };
};


// --- 4. ORCHESTRATOR ---
export const generateCourse = async (
  topic: string, 
  modelType: 'standard' | 'pro' = 'standard', 
  profile?: Big5Profile,
  config?: GenerateCourseConfig
): Promise<GeneratedCourse> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY が設定されていません。");
  }

  // Config setup
  let activeConfig = config || DEFAULT_CONFIG;
  if (!config) {
      const lowerTopic = topic.toLowerCase();
      if (lowerTopic.includes('blender') || lowerTopic.includes('design') || lowerTopic.includes('art') || lowerTopic.includes('creative')) {
          activeConfig = CREATIVE_CONFIG;
      }
  }

  const modelName = modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.5-flash';
  const targetProfile = profile || { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };

  try {
      // Step 1: Strategy
      const strategy = generatePedagogicalStrategy(targetProfile);
      
      // RAG Retrieval (Lightweight)
      const ragKeywords = extractKeywords(topic);
      const ragDocs = retrieveRelevantContent(ragKeywords, 2);
      const blenderDocs = await retrieveBlenderContext(topic, 2);
      const combinedRag = [
        ...ragDocs.map(doc => ({ source: doc.source, text: doc.text })),
        ...blenderDocs.map(doc => ({ source: `${doc.source} (${doc.file})`, text: doc.text }))
      ];
      const ragSection = combinedRag.length
        ? `【参考情報】\n${combinedRag.map(doc => `- ${doc.text}`).join('\n')}`
        : '';

      // Step 2: Architect (Outline)
      console.log("🤖 Architect Agent: Designing Course Structure...");
      const outline = await generateCourseOutline(topic, strategy, activeConfig, ragSection, modelName);
      
      // Step 3: Creator (Details) - Parallel Execution
      console.log(`👨‍🎨 Creator Agents: Writing content for ${outline.chapters.length} chapters...`);
      const chapterPromises = outline.chapters.map((ch, idx) => 
          generateChapterDetails(idx, ch, topic, strategy, activeConfig, modelName)
      );
      
      const fullChapters = await Promise.all(chapterPromises);
      console.log("✅ All Agents Finished.");

      // Return full course
      return {
        id: crypto.randomUUID(),
        title: outline.title,
        description: outline.description,
        duration: "Flexible", // Calculated dynamically later
        chapters: fullChapters,
        createdAt: new Date(),
        modelUsed: modelType,
        targetProfile: targetProfile,
        teacherPersona: {
            name: "Lumina",
            role: "AI Tutor",
            tone: strategy.persona,
            greeting: "Hello!"
        },
        personalizationReasoning: strategy.reasoning
      };

  } catch (error) {
    console.error("Agentic Generation Failed:", error);
    throw new Error("Failed to generate course via Multi-Agent pipeline.");
  }
};

export const getMockBlenderCourse = (): GeneratedCourse => {
    // Keep mock data for demo
    return {
      id: 'mock-blender-101',
      title: "Blender 4.0: アートの魂を吹き込む3D造形",
      description: "単なるツールの操作ではありません。あなたの頭の中にある無限の世界を、3D空間に顕現させるための「魔法の杖」の使い方を学びます。",
      duration: "2時間30分",
      createdAt: new Date(),
      modelUsed: 'pro',
      targetProfile: { openness: 90, conscientiousness: 30, extraversion: 50, agreeableness: 50, neuroticism: 40 },
      chapters: [] // Simplified for brevity in this full overwrite, normally would have full mock data
    };
};

export const generateAudioContent = async (
  speechScript: string,
  modelName: string = "gemini-2.5-flash-preview-tts"
): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const prompt = `
# AUDIO PROFILE: Lumina
## Professional AI Tutor / Friendly Guide
### TRANSCRIPT
${speechScript}
`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "audio/mp3" },
    });

    const candidates = response.response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("No audio candidates.");
    const part = candidates[0].content.parts[0];
    if (!part.inlineData || !part.inlineData.data) throw new Error("No inline audio data.");

    return part.inlineData.data;
  } catch (error) {
    console.error("Gemini Audio Generation Failed:", error);
    throw error;
  }
};

// --- Mock Vector Store for RAG Simulation ---
const _mockVectorStore: any[] = []; // Simplified for brevity as retrieval logic is separate
export const retrieveRelevantContent = (queryKeywords: string[], limit: number = 2): any[] => {
    return [];
};
