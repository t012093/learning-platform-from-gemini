import fs from 'fs';
import { GoogleGenAI } from "@google/genai";

// 1. .envからAPIキーを抽出
const envContent = fs.readFileSync('.env', 'utf8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error("API Key not found in .env");
    process.exit(1);
}

const genAI = new GoogleGenAI(apiKey);

async function inspect() {
    console.log("🔍 Inspecting Curriculum Generation Logic...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 模擬的なプロンプト（geminiService.tsのロジックを凝縮）
    const prompt = `
      トピック: Pythonで量子回路
      具体的要望: 物理シミュレーションを学びたい。Unity経験あり。
      
      以下の情報をJSON形式で生成してください。
      1. title: コースタイトル
      2. preferredTemplate: 'workshop_split' か 'focus_slide' (プログラミングならworkshop_split)
      3. chapters: 3つのチャプター。各チャプターには blocks (type: concept, workshop, dialogueなど) を含めてください。
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // JSON部分を抽出
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            console.log("--- GENERATED DATA STRUCTURE ---");
            console.log(jsonMatch[0]);
        } else {
            console.log("Raw Response:", text);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

inspect();
