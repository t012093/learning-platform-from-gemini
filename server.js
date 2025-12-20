import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAudioContent } from './scripts/gemini_tts_node.js';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3006;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// エンドポイント: 音声生成を開始
app.post('/api/generate-audio', async (req, res) => {
    const courseData = req.body;
    const courseId = courseData.id;

    if (!courseId) {
        return res.status(400).json({ error: 'Course ID is missing' });
    }

    // クライアントには「受け付けた」ことを即座に返す（バックグラウンドで処理）
    res.json({ message: 'Audio generation started (Gemini TTS)', courseId });

    console.log(`Starting Gemini TTS audio generation for course: ${courseId}`);

    // バックグラウンドで処理を実行
    (async () => {
        try {
            // 保存先: public/data/audio/{courseId}
            const baseDir = path.join(__dirname, 'public/data/audio', courseId);
            await fs.mkdir(baseDir, { recursive: true });

            const chapters = courseData.chapters || [];
            
            // 各チャプター、各スライドをループ
            for (let chIdx = 0; chIdx < chapters.length; chIdx++) {
                const slides = chapters[chIdx].slides || [];
                for (let sIdx = 0; sIdx < slides.length; sIdx++) {
                    const slide = slides[sIdx];
                    
                    // 優先順位: speechScript > bullets結合 > title
                    let text = slide.speechScript;
                    if (!text || text.trim().length === 0) {
                        const bullets = slide.bullets || [];
                        text = bullets.length > 0 ? bullets.join(". ") : slide.title;
                    }

                    if (!text) continue;

                    const filename = `${chIdx}_${sIdx}.mp3`;
                    const filepath = path.join(baseDir, filename);

                    console.log(`  Generating: [Chapter ${chIdx+1}, Slide ${sIdx+1}] -> ${filename}`);

                    try {
                        const audioBase64 = await generateAudioContent(text);
                        const audioBuffer = Buffer.from(audioBase64, 'base64');
                        await fs.writeFile(filepath, audioBuffer);
                    } catch (err) {
                        console.error(`    Error generating ${filename}:`, err);
                    }
                }
            }
            console.log(`Done! All narrations generated for course: ${courseId}`);
        } catch (error) {
            console.error(`Fatal error in audio generation loop:`, error);
        }
    })();
});

app.listen(PORT, () => {
    console.log(`Audio Generation Server (Gemini TTS) running on http://localhost:${PORT}`);
});