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

app.post('/api/debug/log-course', async (req, res) => {
    console.log("======== DEBUG: RECEIVED COURSE DATA ========");
    try {
        await fs.writeFile('curriculum_debug.json', JSON.stringify(req.body, null, 2));
        console.log("Saved to curriculum_debug.json");
    } catch (e) {
        console.error("Failed to save debug log:", e);
    }
    res.sendStatus(200);
});

const teacherBotStore = {
    sessions: new Map(),
    lastEvent: null,
};

const normalizeEvent = (event) => {
    const now = Date.now() / 1000;
    return {
        schema_version: event.schema_version || '0.1',
        event_id: event.event_id || `${now}-${Math.random().toString(16).slice(2)}`,
        event: event.event || 'unknown',
        timestamp: event.timestamp || now,
        session_id: event.session_id || '',
        tour: event.tour || {},
        step: event.step || {},
        user: event.user || {},
        state: event.state || {},
        extra: event.extra || {},
        client: event.client || {},
    };
};

const storeEvent = (event) => {
    const sessionId =
        event.session_id ||
        event.user?.id ||
        event.user?.course ||
        'default';
    const current = teacherBotStore.sessions.get(sessionId) || {
        session_id: sessionId,
        events: [],
        last_event: null,
        updated_at: null,
    };
    current.events.push(event);
    if (current.events.length > 50) {
        current.events.shift();
    }
    current.last_event = event;
    current.updated_at = Date.now();
    teacherBotStore.sessions.set(sessionId, current);
    teacherBotStore.lastEvent = event;
    return current;
};

app.post('/api/teacher-bot/events', (req, res) => {
    const incoming = req.body;
    if (!incoming || !incoming.event) {
        return res.status(400).json({ error: 'Invalid payload' });
    }
    const normalized = normalizeEvent(incoming);
    const session = storeEvent(normalized);
    res.json({ ok: true, session_id: session.session_id });
});

app.get('/api/teacher-bot/state', (req, res) => {
    const sessionId = req.query.session_id;
    let payload;
    if (sessionId && teacherBotStore.sessions.has(sessionId)) {
        payload = teacherBotStore.sessions.get(sessionId);
    } else if (teacherBotStore.lastEvent) {
        const fallbackId = teacherBotStore.lastEvent.session_id || 'default';
        payload = teacherBotStore.sessions.get(fallbackId) || {
            session_id: fallbackId,
            events: [teacherBotStore.lastEvent],
            last_event: teacherBotStore.lastEvent,
            updated_at: Date.now(),
        };
    }
    if (!payload) {
        return res.json({ ok: false, message: 'No events yet' });
    }
    res.json({ ok: true, ...payload });
});

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
