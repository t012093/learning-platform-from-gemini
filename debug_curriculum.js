import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyC9B0P6whaeP4DLYOJp1UXOcCMwsJNZblU";
const genAI = new GoogleGenAI({ apiKey });

// --- MOCK CONSTANTS ---
const topic = "Pythonで量子回路を作ってみよう";
const strategy = { 
    persona: "熱血なエンジニア講師", 
    strategy: "実践重視。まずはコードを書いて動かす。",
    template: "workshop_split"
};

// --- LOGIC FROM geminiService.ts (Simulated) ---

// 1. Outline Generation
async function generateOutline() {
    const prompt = `
      あなたは「Architect (設計士)」です。必ず日本語で回答してください。
      トピック: ${topic}
      ペルソナ: ${strategy.persona}
      教育戦略: ${strategy.strategy}
      
      以下の情報をJSONのみで出力してください。
      1. Title: タイトル
      2. Description: 説明
      3. Chapters: 3つのチャプター（title, contentを含む）
    `;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
}

// 2. Chapter Detail Generation (The Core Logic)
async function generateChapterDetails(ch, idx) {
    console.log(`Generating Chapter ${idx + 1}: ${ch.title}...`);
    const prompt = `
    あなたは「Creator (作家)」です。必ず日本語で回答してください。
    チャプター: ${idx + 1}. ${ch.title}
    概要: ${ch.content}
    ペルソナ: ${strategy.persona}
    教育戦略: ${strategy.strategy}

    このチャプターを構成する「学習ブロック（3〜5個）」を作成してください。
    以下の4種類のブロックを効果的に組み合わせてください。
    1. concept: 概念解説
    2. dialogue: 対話
    3. workshop: 実践的な手順やコード
    4. reflection: クイズ

    【出力フォーマット（厳守）】
    ブロック間は「@@@」で区切る。
    各ブロックの先頭は「BLOCK: [type]」で始める。
    
    重要: workshopの場合、手順は「STEP: 手順内容」または「- 手順内容」で記述すること。

    例:
    BLOCK: concept
    TITLE: 量子の世界へようこそ
    CONTENT: 量子コンピュータは...
    @@@
    BLOCK: workshop
    GOAL: Qiskitのインストール
    STEP: ターミナルを開きます
    STEP: pip install qiskit を実行します
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // --- PARSING LOGIC (Copied from geminiService.ts) ---
    const rawBlocks = text.split('@@@').map(b => b.trim()).filter(b => b.length > 0);

    const blocks = rawBlocks.map((raw, bIdx) => {
        const lines = raw.split('\n').map(l => l.trim()).filter(l => l);
        const typeLine = lines.find(l => l.startsWith('BLOCK:'));
        const type = typeLine ? typeLine.split(':')[1].trim().toLowerCase() : 'concept';
        const id = `ch${idx + 1}-bk${bIdx + 1}`;

        const getValue = (key) => {
            const line = lines.find(l => l.startsWith(key + ':'));
            return line ? line.substring(key.length + 1).trim() : '';
        };

        if (type === 'workshop') {
            let steps = lines.filter(l => l.startsWith('STEP:')).map(l => l.substring(5).trim());
            
            // Fallback logic
            if (steps.length === 0) {
                 steps = lines.filter(l => (/^[-*•]/.test(l) || /^\d+\./.test(l)) && !l.startsWith('BLOCK:') && !l.startsWith('GOAL:')).map(l => l.replace(/^[-*•\d.]+\s*/, '').trim());
            }
            if (steps.length === 0) {
                 steps = lines.filter(l => !l.startsWith('BLOCK:') && !l.startsWith('GOAL:') && l.length > 0);
            }

            return {
                id, type: 'workshop',
                goal: getValue('GOAL') || '実践演習',
                steps: steps.length ? steps : ['手順を生成できませんでした。'],
                rawLines: lines // Debug info
            };
        }
        
        // Simplified for other types
        return { id, type, content: raw };
    });

    return { ...ch, blocks };
}

async function run() {
    try {
        const outline = await generateOutline();
        console.log("Outline generated:", outline.title);
        
        // Generate details for the first chapter only
        const chapter1 = await generateChapterDetails(outline.chapters[0], 0);
        
        console.log("\n--- DEBUG: GENERATED BLOCKS ---");
        console.log(JSON.stringify(chapter1.blocks, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
