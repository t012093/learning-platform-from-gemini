import { GoogleGenAI, Chat, Type } from "@google/genai";
import { LessonRubric, AnalysisResult, GeneratedCourse, GeneratedChapter, Big5Profile, AIAdvice, AssessmentProfile, LearningBlock } from '../types';
import { retrieveBlenderContext } from './blenderRagService';
import { retrieveBlenderImages } from './blenderImageRagService';

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

const truncateText = (text: string, maxLen: number = 200): string => {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 3).trim()}...`;
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
export const createScopingChat = (profile: Big5Profile | null): Chat => {
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
    model: 'gemini-2.5-flash',
    config: { systemInstruction: instruction }
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  try {
    const result = await chat.sendMessageStream({ message });
    return (result as any).stream || result;
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
  const prompt = `
    あなたは「The Profiler (心理分析官)」です。日本語で回答。
    スコア: ${JSON.stringify(scores)}
    
    以下の項目を「@@@」で区切って出力してください。
    1. personalityType: あなたを表すキャッチコピー（15文字以内）
    2. strengths: 強み1: 説明 | 強み2: 説明 | 強み3: 説明（各説明は25文字以内で簡潔に）
    3. growthTips: アドバイス1: 説明 | アドバイス2: 説明（各説明は25文字以内）
    4. learningStrategy: 戦略タイトル | 基本方針の説明（40文字以内） | ステップ1 | ステップ2 | ステップ3
  `;
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
  const prompt = `
    あなたは「The Career Coach (キャリア戦略家)」です。日本語で回答。
    スコア: ${JSON.stringify(scores)}
    @@@で区切り、careerCompatibility, role, bestSync, warning, hiddenTalentの順に、詳細な解説（各2〜3文）を含めて出力してください。
    role, bestSync, warningは「タイトル: 詳細解説」の形式にしてください。
  `;
  const response = await ai.models.generateContent({ model: modelName, contents: prompt });
  const parts = (response.text || '').split('@@@').map(p => p.trim());
  
  const getVal = (key: string) => {
      const found = parts.find(p => p.toLowerCase().includes(key.toLowerCase()));
      return found ? found.split(':').slice(1).join(':').trim() : '';
  };

  const htParts = getVal('hiddenTalent').split('|').map(s => s.trim());

  return {
    careerCompatibility: getVal('careerCompatibility') || '分析中...',
    businessPartnership: {
      role: getVal('role') || 'Expert',
      bestSync: getVal('bestSync') || 'Partner',
      warning: getVal('warning') || 'Communication'
    },
    hiddenTalent: { title: htParts[0] || 'Potential', description: htParts[1] || 'Skill' }
  };
};

const analyzeRelationships = async (scores: Big5Profile, modelName: string) => {
  const prompt = `あなたは「The Relationship Expert」です。日本語で回答。スコア: ${JSON.stringify(scores)}. style, idealPartner, adviceをパイプ|区切りで。`;
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

interface PedagogicalStrategy { 
  strategy: string; 
  persona: string; 
  reasoning: string; 
  template: 'focus_slide' | 'workshop_split' | 'dialogue_chat' | 'explore_map';
}

const generatePedagogicalStrategy = (
    profile: Big5Profile, 
    assessment?: AssessmentProfile,
    topic: string = '',
    intent: string = ''
): PedagogicalStrategy => {
  let strategy = "教育スタイルガイド:\n";
  let persona = "AI Tutor Lumina.";
  let reasoning = "Optimized for user profile.";
  let template: PedagogicalStrategy['template'] = 'focus_slide';

  // 1. Base Logic by Personality
  if (profile.conscientiousness > 65 || profile.openness < 40) {
      template = 'workshop_split'; // Practical, structured
      reasoning += " 誠実性の高さに合わせ、実践的なワークショップ形式を採用。";
  } else if (profile.extraversion > 65 || profile.agreeableness > 65) {
      template = 'dialogue_chat'; // Interactive, social
      reasoning += " 外向的・協調的な特性に合わせ、対話型学習を採用。";
  } else if (profile.openness > 70) {
      template = 'explore_map'; // Exploratory, non-linear
      reasoning += " 高い開放性を満たすため、自由な探索モードを採用。";
  } else {
      template = 'focus_slide'; // Default, focused
      reasoning += " 集中力を維持しやすいスライド形式を採用。";
  }

  // 2. Override Logic by Topic & Intent (Prioritize Content Type)
  const techKeywords = /python|code|script|react|program|algo|logic|unity|blender|sql|aws|docker|css|html|js|ts|rust|go|java|c\+\+/i;
  const handsOnKeywords = /作|書|実装|構築|ハンズオン|実践|work|build|create|try|dev|lab/i;
  
  if (techKeywords.test(topic) || techKeywords.test(intent) || handsOnKeywords.test(intent)) {
      template = 'workshop_split';
      reasoning = `トピック「${topic}」の実践的性質を考慮し、解説と作業エリアを併設したワークショップ形式を優先採用。`;
  }

  if (profile.openness > 70) {
    strategy += "- **抽象的・概念的アプローチ**: メタファー多用。\n";
    persona = "情熱的なビジョナリー。";
  } else if (profile.openness < 40) {
    strategy += "- **具体的・実用的アプローチ**: 実践重視。\n";
    persona = "実用的なガイド。";
  }

  if (assessment?.aiAdvice) {
    const advice = assessment.aiAdvice;
    strategy += `\n【固有の特性に基づく追加指示】\n`;
    strategy += `- **学習戦略**: ${advice.learningStrategy.approach} (${advice.learningStrategy.title}) を反映。\n`;
    strategy += `- **強みの活用**: 強み「${advice.strengths.map(s => s.title).join('、')}」を活かした演習を用意。\n`;
  }

  return { strategy, persona, reasoning, template };
};

const generateCourseOutline = async (topic: string, strategy: PedagogicalStrategy, config: GenerateCourseConfig, ragSection: string, modelName: string, intent?: string) => {
    const prompt = `
      あなたは「Architect (設計士)」です。必ず日本語で回答してください。
      トピック: ${topic}
      具体的要望: ${intent || '特になし'}
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

const generateChapterDetails = async (idx: number, ch: GeneratedChapter, topic: string, strategy: PedagogicalStrategy, config: GenerateCourseConfig, modelName: string): Promise<GeneratedChapter> => {
    const prompt = `
    あなたは「Creator (作家)」です。必ず日本語で回答してください。
    チャプター: ${idx + 1}. ${ch.title}
    概要: ${ch.content}
    ペルソナ: ${strategy.persona} (この口調で記述)
    教育戦略: ${strategy.strategy}

    このチャプターを構成する「学習ブロック（3〜5個）」を作成してください。
    以下の4種類のブロックを効果的に組み合わせてください。
    1. concept: 概念解説（図解や比喩を含む）
    2. dialogue: 先生と生徒の対話（疑問解消）
    3. workshop: 実践的な手順やコード（手を動かす）
    4. reflection: クイズや内省（理解度チェック）

    【出力フォーマット（厳守）】
    ブロック間は「@@@」で区切る。
    各ブロックの先頭は「BLOCK: [type]」で始める。

    例:
    BLOCK: concept
    TITLE: ...
    CONTENT: ...
    ANALOGY: ...
    @@@
    BLOCK: dialogue
    AI: こんにちは！
    User: 質問です。
    AI: それはね...
    @@@
    BLOCK: workshop
    GOAL: ...
    STEP: ...
    STEP: ...
    @@@
    BLOCK: reflection
    QUESTION: ...
    OPTION: ...
    OPTION: ...
    `;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { maxOutputTokens: 8192 } // Plain text mode
    });

    const text = response.text || '';
    const rawBlocks = text.split('@@@').map(b => b.trim()).filter(b => b.length > 0);

    const blocks: LearningBlock[] = rawBlocks.map((raw, bIdx) => {
        const lines = raw.split('\n').map(l => l.trim()).filter(l => l);
        const typeLine = lines.find(l => l.startsWith('BLOCK:'));
        const type = typeLine ? typeLine.split(':')[1].trim().toLowerCase() : 'concept';
        const id = `ch${idx + 1}-bk${bIdx + 1}`;

        const getValue = (key: string) => {
            const line = lines.find(l => l.startsWith(key + ':'));
            return line ? line.substring(key.length + 1).trim() : '';
        };

        if (type === 'concept') {
             // Fallback for content extraction
             const contentIdx = lines.findIndex(l => l.startsWith('CONTENT:'));
             let content = contentIdx !== -1 ? lines[contentIdx].substring(8).trim() : raw;
             // If content is very short, maybe it spans multiple lines? Simplified for now.
             
             return {
                id, type: 'concept',
                title: getValue('TITLE') || ch.title,
                content: content,
                analogy: getValue('ANALOGY')
            };
        }

        if (type === 'dialogue') {
            const dialogueLines = lines.filter(l => l.startsWith('AI:') || l.startsWith('User:') || l.startsWith('Lumina:')).map(l => {
                const speaker = l.startsWith('User:') ? 'User' : 'AI';
                const text = l.substring(l.indexOf(':') + 1).trim();
                return { speaker, text } as any; // Cast to bypass strict type check for now
            });
            return { id, type: 'dialogue', lines: dialogueLines };
        }

        if (type === 'workshop') {
            let steps = lines.filter(l => l.startsWith('STEP:')).map(l => l.substring(5).trim());
            
            // Fallback: Try bullets or numbered lists if no explicit steps found
            if (steps.length === 0) {
                 steps = lines.filter(l => (/^[-*•]/.test(l) || /^\d+\./.test(l)) && !l.startsWith('BLOCK:') && !l.startsWith('GOAL:')).map(l => l.replace(/^[-*•\d.]+\s*/, '').trim());
            }
            
            // Final Fallback: Take all non-meta lines
            if (steps.length === 0) {
                 steps = lines.filter(l => !l.startsWith('BLOCK:') && !l.startsWith('GOAL:') && l.length > 0);
            }

            return {
                id, type: 'workshop',
                goal: getValue('GOAL') || '実践演習',
                steps: steps.length ? steps : ['手順を生成できませんでした。']
            };
        }

        if (type === 'reflection') {
             const options = lines.filter(l => l.startsWith('OPTION:')).map(l => l.substring(7).trim());
             return {
                id, type: 'reflection',
                question: getValue('QUESTION') || '理解度チェック',
                options: options
             };
        }

        return { id, type: 'concept', title: 'Summary', content: raw };
    });

    // --- ADAPTER: Blocks to Slides Conversion ---
    // Convert generic blocks into the specific slide format required by the current UI
    const slides = blocks.map(block => {
        let slide: any = {
            title: block.title || ch.title,
            bullets: [],
            speechScript: '',
            imagePrompt: '' // Optional
        };

        if (block.type === 'concept') {
            slide.title = block.title || ch.title;
            // Split content into bullets if it looks like a list, otherwise single bullet
            slide.bullets = [block.content]; 
            slide.speechScript = block.content; // Use content as script for now
            if (block.analogy) {
                slide.bullets.push(`💡 ${block.analogy}`);
            }
        } else if (block.type === 'dialogue') {
            slide.title = "Discussion";
            slide.bullets = block.lines?.map(l => `${l.speaker}: ${l.text}`) || [];
            slide.speechScript = block.lines?.map(l => l.text).join(' ');
        } else if (block.type === 'workshop') {
            slide.title = "Workshop: " + (block.goal || 'Practice');
            slide.bullets = block.steps || [];
            slide.speechScript = `Let's practice. ${block.goal}. Follow the steps displayed.`;
        } else if (block.type === 'reflection') {
            slide.title = "Check your understanding";
            slide.bullets = [block.question, ...(block.options || []).map(o => `• ${o}`)];
            slide.speechScript = block.question;
        }

        return slide;
    });

    return { 
        ...ch, 
        id: idx + 1, 
        blocks: blocks,
        slides: slides 
    };
};

export const generateCourse = async (
  topic: string, 
  modelType: 'standard' | 'pro' | 'gemini-2.5-flash' | 'gemini-2.5-pro' = 'gemini-2.5-flash', 
  profile?: Big5Profile,
  config?: GenerateCourseConfig,
  assessment?: AssessmentProfile,
  intent?: string
): Promise<GeneratedCourse> => {
  const modelName = modelType === 'gemini-2.5-pro' ? 'gemini-2.5-pro' : modelType === 'gemini-2.5-flash' ? 'gemini-2.5-flash' : modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.0-flash';
  const targetProfile = profile || { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
  const strategy = generatePedagogicalStrategy(targetProfile, assessment, topic, intent);
  
  const ragKeywords = extractKeywords(topic);
  const blenderDocs = await retrieveBlenderContext(topic, 2);
  const blenderImages = await retrieveBlenderImages(topic, 3);
  const docSection = blenderDocs.length ? `【参考情報】\n${blenderDocs.map(doc => `- ${doc.text}`).join('\n')}` : '';
  const imageSection = blenderImages.length
    ? `【画像候補】\n${blenderImages.map(img => {
        const caption = img.caption || img.alt || '';
        const heading = img.headingPath || img.pageTitle || '';
        const context = [img.contextBefore, img.contextAfter].filter(Boolean).join(' ');
        const contextText = context ? ` context=${truncateText(context, 180)}` : '';
        return `- image=${img.image}${caption ? ` caption=${caption}` : ''}${heading ? ` heading=${heading}` : ''}${contextText}`;
      }).join('\n')}`
    : '';
  const ragSection = [docSection, imageSection].filter(Boolean).join('\n');

  const outline = await generateCourseOutline(topic, strategy, config || DEFAULT_CONFIG, ragSection, modelName, intent);
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
    personalizationReasoning: strategy.reasoning,
    preferredTemplate: strategy.template
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
