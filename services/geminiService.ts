import { GoogleGenAI, Chat, Type } from "@google/genai";
import { LessonRubric, AnalysisResult, GeneratedCourse, GeneratedChapter, Big5Profile } from '../types';
import { retrieveBlenderContext } from './blenderRagService';

// Initialize the client strictly according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const createChatSession = (systemInstruction?: string): Chat => {
  const defaultInstruction = `You are Lumina, a professional English tutor for a B1+/B2 learner.
      Your goal is to help them sound more "Exploratory" and "Logical" rather than just "Correct".
      Focus on: Softening (tone), Bridging (logic connections), and Structure.`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
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

const generatePedagogicalStrategy = (profile: Big5Profile): string => {
  let strategy = "教育スタイルガイド:\n";

  // 1. Openness (知的好奇心・創造性)
  if (profile.openness > 70) {
    strategy += "- **抽象的・概念的アプローチ**: 「なぜ？」という問いや、背後にある哲学、歴史的背景を重視してください。メタファーや意外なつながり（Connect the dots）を多用し、知的好奇心を刺激してください。\n";
  } else if (profile.openness < 40) {
    strategy += "- **具体的・実用的アプローチ**: 抽象論は避け、すぐに使える知識や明確な事実、慣習的な手法（Best Practices）に焦点を当ててください。\n";
  }

  // 2. Conscientiousness (誠実性・勤勉性)
  if (profile.conscientiousness > 70) {
    strategy += "- **構造化・目標志向**: 各レッスンの到達目標（Outcome）を明確に定義し、ステップバイステップの体系的な手順を示してください。効率性を重視したTipsを含めてください。\n";
  } else if (profile.conscientiousness < 40) {
    strategy += "- **柔軟性・ショートカット**: 厳格なルールよりも、まずは「動くもの」を作る楽しさを優先してください。完璧を目指さず、試行錯誤（Trial and Error）を推奨するトーンで。\n";
  }

  // 3. Extraversion (外向性)
  if (profile.extraversion > 70) {
    strategy += "- **アクティブ・社会的**: エネルギッシュで対話的なトーン。「誰かに教えるつもりで」「プレゼン資料を作るなら」といった社会的文脈のアクションを提案してください。\n";
  } else if (profile.extraversion < 40) {
    strategy += "- **内省的・集中**: 落ち着いたトーン。一人で深く没頭できるワークや、自己分析的な問いかけ（Reflection）を重視してください。\n";
  }

  // 4. Neuroticism (神経症的傾向 -> ここでは「慎重さ」として活用)
  if (profile.neuroticism > 70) {
    strategy += "- **安心感・リスク回避**: 初学者が陥りやすいミス（Common Pitfalls）を事前に警告し、丁寧なトラブルシューティングや「正解」への明確なガイドを提供して不安を取り除いてください。\n";
  } else {
    strategy += "- **挑戦・大胆さ**: 「失敗してもOK」というスタンスで、大胆な実験を促してください。\n";
  }

  return strategy;
};

// -------- Runtime Validation & Autofix Helpers --------
const ensureString = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
};

const extractKeywords = (text: string): string[] => {
  return text
    .split(/[\\s、。,.]+/)
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 6);
};

const normalizeChapter = (chapter: any, index: number) => {
  const normalizeSlides = () => {
    if (!Array.isArray(chapter?.slides)) return [];
    return chapter.slides.map((s: any, slideIdx: number) => ({
      title: ensureString(s?.title || `Slide ${slideIdx + 1}`),
      bullets: Array.isArray(s?.bullets) ? s.bullets.map((b: any) => ensureString(b)).filter(Boolean) : [],
      timing: ensureString(s?.timing || '')
    }));
  };

  return {
    id: ensureString(chapter?.id ?? index + 1),
    title: ensureString(chapter?.title),
    duration: ensureString(chapter?.duration || '15分'),
    type: ensureString(chapter?.type || 'Lesson'),
    content: ensureString(chapter?.content),
    whyItMatters: ensureString(chapter?.whyItMatters),
    keyConcepts: Array.isArray(chapter?.keyConcepts) ? chapter.keyConcepts.map((k: any) => ensureString(k)).filter(Boolean) : [],
    actionStep: ensureString(chapter?.actionStep),
    analogy: ensureString(chapter?.analogy),
    slides: normalizeSlides()
  };
};

const validateGeneratedCourse = (raw: any) => {
  const errors: string[] = [];
  const title = ensureString(raw?.title);
  const description = ensureString(raw?.description);
  const duration = ensureString(raw?.duration || '60分');
  const chaptersRaw = Array.isArray(raw?.chapters) ? raw.chapters : [];
  const chapters = chaptersRaw.map((ch: any, idx: number) => normalizeChapter(ch, idx));

  if (!title) errors.push('title is missing or empty');
  if (!description) errors.push('description is missing or empty');
  if (!Array.isArray(raw?.chapters) || raw.chapters.length === 0) errors.push('chapters is missing or empty');

  chapters.forEach((ch, idx) => {
    if (!ch.title) errors.push(`chapters[${idx}].title is missing`);
    if (!ch.content) errors.push(`chapters[${idx}].content is missing`);
    if (!ch.whyItMatters) errors.push(`chapters[${idx}].whyItMatters is missing`);
    if (!Array.isArray(ch.keyConcepts) || ch.keyConcepts.length === 0) errors.push(`chapters[${idx}].keyConcepts is missing`);
    if (!ch.actionStep) errors.push(`chapters[${idx}].actionStep is missing`);
    if (!ch.analogy) errors.push(`chapters[${idx}].analogy is missing`);
    if (!Array.isArray(ch.slides) || ch.slides.length < 7 || ch.slides.length > 15) {
      errors.push(`chapters[${idx}].slides must have between 7 and 15 items`);
    } else {
      ch.slides.forEach((s, sIdx) => {
        if (!s.title) errors.push(`chapters[${idx}].slides[${sIdx}].title is missing`);
        if (!Array.isArray(s.bullets) || s.bullets.length === 0) errors.push(`chapters[${idx}].slides[${sIdx}].bullets is missing`);
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    normalized: { title, description, duration, chapters },
  };
};

const buildFallbackCourse = (topic: string, modelType: 'standard' | 'pro', profile: Big5Profile): GeneratedCourse => {
  return {
    id: crypto.randomUUID(),
    title: `${topic} - Quickstart`,
    description: `${topic} の概要を短時間で掴むためのミニパスです。API接続または生成に失敗したため簡易版を表示しています。`,
    duration: "45分",
    chapters: [
      {
        id: "1",
        title: `${topic} を俯瞰する`,
        duration: "15分",
        type: "Lesson",
        content: `${topic} の基本的な定義と適用例を確認します。`,
        whyItMatters: "まず全体像を把握し、次のステップで深掘りする準備をします。",
        keyConcepts: [topic, "基礎概念", "ユースケース"],
        actionStep: `${topic} に関する信頼できる記事を1つ読み、重要な3ポイントをメモしてください。`,
        analogy: `${topic} を新しい都市と考え、地図を広げて主要なランドマークを押さえる工程です。`
      }
    ],
    createdAt: new Date(),
    modelUsed: modelType,
    targetProfile: profile
  };
};

const parseJsonSafe = (text?: string) => {
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    return null;
  }
};

export const generateCourse = async (topic: string, modelType: 'standard' | 'pro' = 'standard', profile?: Big5Profile): Promise<GeneratedCourse> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY が設定されていません。環境変数に GEMINI_API_KEY をセットしてください。");
  }

  const modelName = modelType === 'pro' ? 'gemini-3.0-pro' : 'gemini-2.0-flash';
  const targetProfile = profile || { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
  const strategy = generatePedagogicalStrategy(targetProfile);
  const maxAttempts = 2;
  const ragKeywords = extractKeywords(topic);
  const ragDocs = retrieveRelevantContent(ragKeywords, 2);
  const blenderDocs = await retrieveBlenderContext(topic, 2);
  const combinedRag = [
    ...ragDocs.map(doc => ({ source: doc.source, text: doc.text })),
    ...blenderDocs.map(doc => ({ source: `${doc.source} (${doc.file})`, text: doc.text }))
  ];
  const ragSection = combinedRag.length
    ? `【参考情報（矛盾する場合はトピック優先）】
${combinedRag.map(doc => `- Source: ${doc.source}
  Excerpt: ${doc.text}`).join('\n')}
`
    : '';

  const basePrompt = `
      あなたは世界最高峰の教育カリキュラムデザイナーです。
      以下のトピックについて、特定の学習者プロファイルに最適化されたカリキュラム（日本語）を作成してください。

      トピック: 「${topic}」
      
      【学習者プロファイル分析に基づいた教育戦略】
      ${strategy}
      
      ${ragSection}
      
      【必須出力要件】
      1. Title: 戦略に基づいた、学習者に響くタイトル。
      2. Description: コースの魅力を伝える説明文。
      3. Chapters: 4〜6個のレッスン。各レッスンには以下を含めること:
         - **Title**: 章のタイトル
         - **Content**: 概要
         - **WhyItMatters**: なぜこれを学ぶ価値があるのか？（プロファイルの価値観に訴求）
         - **KeyConcepts**: 3〜5個の重要キーワード（配列）
         - **ActionStep**: 今すぐできる具体的な行動・演習
         - **Analogy**: 難しい概念を直感的に理解するための「たとえ話」（Opennessが高い場合は特に創造的に）
         - **Slides**: 7〜15枚のスライド（配列）。各スライドは { title, bullets[3-5], timing(optional), visualStyle(optional), motionCue(optional), accentIcon(optional), layoutHint(optional) } を含める。スライドは音声ナレーションに合わせて切り替わる想定。スライド間で必ず配色/レイアウト/モーションにバリエーションを付けること（同じスタイルを連続させない）。

      【スライドデザイン指針（特にBlender/クリエイター向け）】
      - トーン: クリエイター/アーティスト向け、洗練されたダークテーマ。背景は深いネイビー〜スレート、差し色はインディゴ×シアン系。
      - モーション: 過度な点滅は禁止。見出しはフェードイン、箇条書きは0.15〜0.3秒ステップでスライドアップなど短い指示を \`motionCue\` に入れる。
      - スタイル: グラスモーフィズム/ネオンサイバー系を短く \`visualStyle\` に記述。読みやすさ優先。
      - アイコン: Lucide系で表現できるモチーフを \`accentIcon\`（例: sparkles, lightbulb, target）に1つ。
      - レイアウト: \`layoutHint\` に左右2カラム/ビジュアル優先/余白多め 等を簡潔に記載。
      
      返す前に必須フィールドが埋まっているか自己チェックし、欠落があれば補完してから返してください。回答はJSONのみ。
    `;

  const requestCourse = async (prompt: string) => {
    return ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            duration: { type: Type.STRING },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  type: { type: Type.STRING },
                  content: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING },
                  keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  actionStep: { type: Type.STRING },
                  analogy: { type: Type.STRING },
                  slides: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                        timing: { type: Type.STRING },
                        visualStyle: { type: Type.STRING },
                        motionCue: { type: Type.STRING },
                        accentIcon: { type: Type.STRING },
                        layoutHint: { type: Type.STRING }
                      },
                      required: ["title", "bullets"]
                    }
                  }
                },
                required: ["id", "title", "duration", "type", "content", "whyItMatters", "keyConcepts", "actionStep", "analogy", "slides"]
              }
            }
          },
          required: ["title", "description", "duration", "chapters"]
        }
      }
    });
  };

  try {
    let attempt = 0;
    let lastErrors: string[] = [];
    let response = await requestCourse(basePrompt);
    let parsed = parseJsonSafe(response.text || '');
    let validation = validateGeneratedCourse(parsed);

    while (!validation.isValid && attempt < maxAttempts) {
      attempt += 1;
      lastErrors = validation.errors;

      const repairPrompt = `
        あなたの前回の出力は必須スキーマに違反しています。以下のエラーをすべて修正し、完全なJSONのみを返してください。
        エラー: ${lastErrors.join('; ')}
        元のJSON: ${JSON.stringify(parsed)}
        条件: 必須フィールドを埋め、配列は空にせず、JSON以外のテキストは返さないでください。
      `;
      response = await requestCourse(repairPrompt);
      parsed = parseJsonSafe(response.text || '');
      validation = validateGeneratedCourse(parsed);
    }

    if (!validation.isValid) {
      const errMsg = `生成結果がスキーマを満たしません: ${validation.errors.join('; ')}`;
      console.error(errMsg);
      throw new Error(errMsg);
    }

    const normalized = validation.normalized;

    return {
      id: crypto.randomUUID(),
      title: normalized.title,
      description: normalized.description,
      duration: normalized.duration,
      chapters: normalized.chapters,
      createdAt: new Date(),
      modelUsed: modelType,
      targetProfile: targetProfile
    };

  } catch (error) {
    console.error("Course generation failed:", error);
    const apiError = (error as any)?.error || (error as any);
    const apiMessage = (apiError?.message as string) || (error instanceof Error ? error.message : '');
    const apiStatus = apiError?.status || '';

    if (apiMessage.includes("API key not valid") || apiStatus === "INVALID_ARGUMENT") {
      throw new Error("APIキーが無効です。環境変数 API_KEY を確認してください。");
    }
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      throw error;
    }
    throw new Error("Failed to generate course. Please try again.");
  }
};

export const getMockBlenderCourse = (): GeneratedCourse => {
  return {
    id: 'mock-blender-101',
    title: "Blender 4.0: アートの魂を吹き込む3D造形",
    description: "単なるツールの操作ではありません。あなたの頭の中にある無限の世界を、3D空間に顕現させるための「魔法の杖」の使い方を学びます。創造性を爆発させましょう。",
    duration: "2時間30分",
    createdAt: new Date(),
    modelUsed: 'pro',
    targetProfile: { openness: 90, conscientiousness: 30, extraversion: 50, agreeableness: 50, neuroticism: 40 },
    chapters: [
      {
        id: 1,
        title: "コックピット: 無限のキャンバスへの没入",
        duration: "15分",
        type: "インタラクティブチュートリアル",
        content: "3Dビューポートは、あなたが神の視点を持つ場所です。視点操作を身体の一部のように馴染ませ、ストレスなく空間を舞う方法を学びます。",
        whyItMatters: "ツールと一体化することで、思考の速度で創造できるようになります。操作のストレスは創造性の敵です。",
        keyConcepts: ["3D空間認識", "ショートカットキー", "ギズモ"],
        actionStep: "Blenderを開き、マウスの中ボタンを押しながらグリグリと視点を回し、自分が「空間の支配者」になった感覚を味わってください。",
        analogy: "Blenderの操作は「自転車に乗る」のと同じ。最初はふらつくけれど、一度覚えれば無意識にどこへでも行けるようになります。"
      },
      {
        id: 2,
        title: "編集モード: 粘土細工のような造形",
        duration: "30分",
        type: "実践ワークショップ",
        content: "プリミティブ（基本図形）から始め、頂点をつまみ、面を押し出し、形あるものを生み出します。",
        whyItMatters: "すべての複雑な傑作も、最初はたった一つの立方体から始まります。基礎的な変形こそが最強の武器です。",
        keyConcepts: ["頂点・辺・面", "押し出し (Extrude)", "ループカット"],
        actionStep: "立方体を一つ出し、「押し出し」機能だけを使って、積み木のようなお城を作ってみましょう。",
        analogy: "デジタルな粘土細工です。手は汚れませんが、あなたの想像力で形を変幻自在に操ることができます。"
      },
      {
        id: 3,
        title: "モディファイア: 非破壊という魔法",
        duration: "25分",
        type: "コンセプトビデオ",
        content: "元の形を壊さずに、複雑な変形を加える「モディファイア」の概念を学びます。後からいつでもやり直せる安心感を手に入れましょう。",
        whyItMatters: "「失敗しても戻れる」という保証が、あなたの大胆な実験を可能にします。試行錯誤こそが上達の近道です。",
        keyConcepts: ["非破壊編集", "サブディビジョン", "ミラーリング"],
        actionStep: "不格好なモデルに「サブディビジョンサーフェス」をかけて、一瞬でツルツルの有機的なフォルムに変わる快感を体験してください。",
        analogy: "写真アプリの「フィルター」のようなもの。元の写真はそのままに、見た目だけをカッコよく加工し、気に入らなければいつでも外せます。"
      },
      {
        id: 4,
        title: "マテリアル: 光と質感の錬金術",
        duration: "40分",
        type: "プロジェクト",
        content: "形だけのオブジェクトに、色、反射、凹凸を与え、「実在感」を吹き込みます。プラスチック、金属、ガラスの違いを表現しましょう。",
        whyItMatters: "人間は「形」よりも「質感」でリアリティを感じます。マテリアルを制する者は、空気感すら操れます。",
        keyConcepts: ["シェーダーノード", "ラフネス（粗さ）", "メタリック"],
        actionStep: "プリンシプルBSDFの「メタリック」を1にし、「ラフネス」を0にしてください。あなたのモデルが鏡のように世界を映し出す瞬間を目撃しましょう。",
        analogy: "白いキャンバスに絵の具を塗るのではなく、物体そのものの「原子の構成」を変えるような錬金術です。"
      },
      {
        id: 5,
        title: "レンダリング: 世界を切り取る写真撮影",
        duration: "20分",
        type: "ディープダイブ",
        content: "構築した世界を、一枚の「作品」として出力します。カメラを構え、ライティングで演出する、最後の仕上げです。",
        whyItMatters: "どれほど素晴らしいモデルも、光と構図が悪ければ台無しです。あなたの世界を最高に見せる「演出家」になりましょう。",
        keyConcepts: ["カメラ構図", "ライティング (HDRI)", "Cycles vs Eevee"],
        actionStep: "ライトを一つ追加し、色を「暖色（オレンジ）」に、強さを強めに設定して、夕暮れのようなドラマチックな影を作ってみましょう。",
        analogy: "映画の撮影現場。セット（モデル）が完成したら、最後に照明さんが雰囲気を決め、カメラマンが最高のアングルで切り取ります。"
      }
    ]
  };
};

// --- Mock Vector Store for RAG Simulation --- START
interface ContentDocument {
  id: string;
  text: string; // The actual content to retrieve
  keywords: string[]; // Simplified 'vector' for demo matching
  source: string; // e.g., "Art History", "Blender Docs"
}

const _mockVectorStore: ContentDocument[] = [
  {
    id: 'art-kintsugi-intro',
    text: "金継ぎ（きんつぎ）は、割れや欠けによって壊れてしまった陶磁器を漆で接着し、金や銀などの金属粉で装飾して修復する日本の伝統技法です。単なる修理ではなく、傷跡を「景色」として慈しみ、器の歴史を尊重する美意識が込められています。",
    keywords: ["金継ぎ", "修復", "陶磁器", "漆", "金", "日本の伝統文化", "美意識"],
    source: "Art History: Kintsugi"
  },
  {
    id: 'blender-basics-interface',
    text: "Blenderのインターフェースは多機能ですが、主要な要素は3Dビューポート、アウトライナー、プロパティエディタです。基本的な視点操作はマウスの中ボタン（回転）、Shift+中ボタン（移動）、スクロール（ズーム）で行います。",
    keywords: ["Blender", "インターフェース", "3Dビューポート", "視点操作", "マウス"],
    source: "Blender Basics"
  },
  {
    id: 'html-css-flexbox',
    text: "FlexboxはCSSのレイアウトモジュールで、コンテナ内のアイテムを一次元的に配置するのに優れています。`display: flex;` を親要素に指定し、`justify-content` で主軸方向、`align-items` で交差軸方向の配置を制御します。",
    keywords: ["HTML", "CSS", "Flexbox", "レイアウト", "display: flex", "justify-content", "align-items"],
    source: "HTML/CSS Part 1"
  },
  {
    id: 'quantum-computing-qubit',
    text: "量子コンピューティングの基本単位は量子ビット（Qubit）です。古典ビットが0か1かのいずれかの状態しか取らないのに対し、量子ビットは0と1を重ね合わせた「重ね合わせ」の状態を同時に存在させることができます。これが量子コンピューターの驚異的な計算能力の源です。",
    keywords: ["量子コンピューティング", "量子ビット", "Qubit", "重ね合わせ", "Superposition", "古典ビット"],
    source: "Quantum Computing Intro"
  },
  {
    id: 'vibe-prompt-engineering',
    text: "プロンプトエンジニアリングは、AI（特に大規模言語モデル）から望む出力を引き出すための「質問の技術」です。明確さ、具体性、文脈の提供が鍵となります。まるでAIと会話するように、意図を正確に伝える練習が必要です。",
    keywords: ["プロンプトエンジニアリング", "AI", "LLM", "質問の技術", "明確さ", "文脈"],
    source: "Vibe Chapter 1"
  },
];

export const retrieveRelevantContent = (queryKeywords: string[], limit: number = 2): ContentDocument[] => {
  const matchingDocs: ContentDocument[] = [];
  const querySet = new Set(queryKeywords.map(k => k.toLowerCase()));

  for (const doc of _mockVectorStore) {
    const docKeywords = new Set(doc.keywords.map(k => k.toLowerCase()));
    let matchCount = 0;
    for (const qk of querySet) {
      if (docKeywords.has(qk)) {
        matchCount++;
      }
    }
    if (matchCount > 0) {
      matchingDocs.push(doc);
    }
    if (matchingDocs.length >= limit) break; // Limit the number of retrieved docs
  }
  return matchingDocs;
};

// --- Mock Vector Store for RAG Simulation --- END
