import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../../../types';
import { ChatInterface } from "../../../components/common/ui/ChatInterface";
import { Message } from '../../../types';
import { Brain, ArrowLeft, MessageCircle } from 'lucide-react';
import { createChatSession, sendMessageStream } from '../../../services/geminiService';
import { Chat } from "@google/genai";

interface LuminaConciergeViewProps {
    onNavigate: (view: ViewState) => void;
}


const SYSTEM_PROMPT = `あなたはLumina Conciergeです。この学習プラットフォームの中心となるAIガイドです。

** あなたの主な目標 **: 「ビッグファイブ＋個人的学習診断」を実施し、ユーザーに最適なAIパートナー（Spark、Focus、Vibe、Echo、Lunaのいずれか）をマッチングし、学習パスを提案することです。

** プロセス **:
1. ** 導入 **: ユーザーを簡単に歓迎し、彼らの性格と学習スタイルを理解するためにいくつかの質問をすることについて説明します。
2. ** ビッグファイブ分析（性格）**: シナリオ形式で3〜5つの魅力的な質問をします。以下の点に焦点を当てます。
   - ** 開放性 **: 「チュートリアルに厳密に従うのと、探求して色々なことを試すのと、どちらが好きですか？」
   - ** 誠実性 **: 「散らかったコードベースにどう対処しますか？まず綺麗にするか、それとも早くリリースするために無視しますか？」
   - ** 外向性 / 協調性 **: 「ペアプログラミングや議論が好きですか、それとも深く集中して一人で作業するのが好きですか？」
   - ** 情緒安定性 **: 「みんなの前でデモが失敗したとき、どう反応しますか？」
3. ** 個人的分析（状況）**: 以下の点について尋ねます。
   - ** 現在の目標 **: （例：転職、アプリ開発、趣味のため）
   - ** 利用可能な時間 **: （例：1日1時間、週末集中型）
   - ** 現在のレベル **: （初心者、中級者、上級者）
4. ** 診断結果 **:
- 回答に基づいて、ユーザーの「支配的な特性」と「最適なマッチ」を決定します。
   - ** Spark(開放性) **: 創造的、先見の明がある。
   - ** Focus(誠実性) **: 構造的、効率的。
   - ** Vibe(外向性) **: エネルギッシュ、社交的。
   - ** Echo(協調性) **: 協力的、チーム志向。
   - ** Luna(情緒安定性) **: 落ち着いている、深く考える。
   - ** 出力 **: キャラクター名と、なぜそのキャラクターが適しているのかを明確に提示します。

** スタイル **:
- 質問は会話形式で短く（一度に1つ）。
- ユーザーを圧倒しないように。
- 温かく、プロフェッショナルで、洞察力に富んだ対応を。
- 重要な用語の強調にはMarkdownを使用してください。
`;


// Mock Diagnosis Flow Data (Localized)
const DIAGNOSIS_FLOW = [
    {
        id: 'step1',
        text: "あなたにぴったりのAI学習パートナーを見つけましょう。まずはシチュエーション形式で質問します。\n\n**2時間かけても解決しない難しいバグに遭遇しました。あなたならどうしますか？**",
        options: [
            "すぐに誰かに助けを求める (チームワーク)",
            "一人でドキュメントやコードを深掘りし続ける (探求心)",
            "一旦休憩して、別のタスクに切り替える (効率性)"
        ]
    },
    {
        id: 'step2',
        text: "次の質問です。\n\n**新しいプロジェクトを始めるとき、一番ワクワクするのはどんな時ですか？**",
        options: [
            "常識にとらわれないアイデアを考える時 (創造性)",
            "綺麗で拡張性のある設計を考える時 (構造化)",
            "とにかく動くプロトタイプを最速で作る時 (スピード)"
        ]
    },
    {
        id: 'step3',
        text: "最後の質問です。\n\n**新しい技術を学ぶとき、どのようなスタイルが好きですか？**",
        options: [
            "公式ドキュメントを隅々まで読む (理論派)",
            "チュートリアルを見ながら手を動かす (実践派)",
            "とりあえず書いてみて、壊しながら覚える (冒険派)"
        ]
    },
    {
        id: 'result',
        text: "回答ありがとうございます。分析結果が出ました...\n\n**診断完了！**\n\nあなたのスタイルに最も近いのは **Spark (The Visionary)** です。\n\nSparkは、あなたの新しいアイデアを広げ、次のステップへと導いてくれるでしょう。Sparkとの学習セッションを開始しますか？",
        options: ["Sparkとセッションを開始", "診断をやり直す"]
    }
];

const LuminaConciergeView: React.FC<LuminaConciergeViewProps> = ({ onNavigate }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatSession = useRef<Chat | null>(null);
    const [diagnosisStep, setDiagnosisStep] = useState<number>(-1); // -1: Not started, 0-n: In progress

    useEffect(() => {
        try {
            // Updated System Prompt for Japanese context
            chatSession.current = createChatSession(SYSTEM_PROMPT + "\n\nCRITICAL: You MUST reply in Japanese.");
        } catch (e) {
            console.warn("Failed to init chat session (likely no API key). Will use mock mode.");
        }
    }, []);

    const processDiagnosisStep = async (stepIndex: number, userText?: string) => {
        setIsLoading(true);

        // Simulate thinking delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const currentStepData = DIAGNOSIS_FLOW[stepIndex];

        if (currentStepData) {
            const botMsg: Message = {
                id: `bot - diag - ${stepIndex} `,
                role: 'model',
                text: currentStepData.text,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setDiagnosisStep(stepIndex);
        } else {
            // End of flow or invalid
            setDiagnosisStep(-1);
        }

        setIsLoading(false);
    };

    const handleSend = async (text: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        // Handing Diagnosis Flow
        if (diagnosisStep >= 0 && diagnosisStep < DIAGNOSIS_FLOW.length) {
            // Advance to next step
            if (diagnosisStep === DIAGNOSIS_FLOW.length - 1) {
                // Was at result, now resetting or starting chat
                if (text.includes("やり直す") || text.includes("Retake")) {
                    processDiagnosisStep(0);
                } else {
                    setDiagnosisStep(-1); // Exit diagnosis
                    // Transition to normal chat (or navigate to character view in real app)
                    setIsLoading(true);
                    setTimeout(() => {
                        setMessages(prev => [...prev, {
                            id: 'spark-intro',
                            role: 'model',
                            text: "素晴らしい！Sparkがアクティブになりました。「さあ、最高のものを作りましょう！」",
                            timestamp: new Date()
                        }]);
                        setIsLoading(false);
                    }, 800);
                }
            } else {
                processDiagnosisStep(diagnosisStep + 1);
            }
            return;
        }

        // Normal Chat Flow
        setIsLoading(true);

        if (!chatSession.current) {
            // Fallback if no API session
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'model',
                    text: "現在オフラインモードです（APIキー未設定）。基本的なナビゲーションについてお答えします！",
                    timestamp: new Date()
                }]);
                setIsLoading(false);
            }, 1000);
            return;
        }

        try {
            const result = await sendMessageStream(chatSession.current, text);
            let fullResponse = "";
            const botMessageId = (Date.now() + 1).toString();

            setMessages(prev => [
                ...prev,
                { id: botMessageId, role: 'model', text: "", timestamp: new Date() }
            ]);

            for await (const chunk of result) {
                const chunkText = typeof (chunk as any).text === 'function' ? (chunk as any).text() : (chunk as any).text;
                fullResponse += chunkText;
                setMessages(prev => prev.map(msg =>
                    msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
                ));
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: 'model',
                    text: "接続に問題が発生しました。手動診断モードに切り替えます。",
                    timestamp: new Date()
                }
            ]);
            // Auto-trigger diagnosis if error occurs during what looks like a diagnosis request
            if (text.toLowerCase().includes("diagnosis") || text.includes("診断")) {
                processDiagnosisStep(0);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const startDiagnosis = () => {
        // Start local diagnosis flow
        // Fake the user input for visual consistency
        const userMsg: Message = { id: 'start-diag', role: 'user', text: "診断を開始", timestamp: new Date() };
        setMessages([userMsg]);
        processDiagnosisStep(0);
    };

    const startChat = () => {
        const welcomeMsg: Message = {
            id: 'welcome-chat',
            role: 'model',
            text: "こんにちは！AIチューターです。プログラミングや英語、このプラットフォームの使い方について何でも聞いてください。",
            timestamp: new Date()
        };
        setMessages([welcomeMsg]);
    };

    // Determine current suggestions based on diagnosis step
    const currentSuggestions = diagnosisStep >= 0 && diagnosisStep < DIAGNOSIS_FLOW.length
        ? DIAGNOSIS_FLOW[diagnosisStep].options
        : ["このアプリの使い方は？", "React Hooksについて教えて"];

    const EmptyState = (
        <div className="max-w-4xl w-full px-6 flex flex-col items-center justify-center h-full animate-in fade-in zoom-in-95 duration-700">

            {/* Hero Section */}
            <div className="text-center mb-12 space-y-6">
                <div className="inline-block p-4 rounded-full bg-white shadow-xl shadow-indigo-100 ring-1 ring-slate-100 mb-2">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-inner">
                        <Brain size={32} />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-3">
                        Lumina <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Concierge</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        あなたに最適な学習パスを見つけるパーソナルガイド。<br className="hidden md:block" />
                        今日はどのように学習を始めますか？
                    </p>
                </div>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                {/* Diagnosis Card */}
                <button
                    onClick={startDiagnosis}
                    className="group relative overflow-hidden bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-indigo-500/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 text-left flex flex-col h-full"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform shadow-sm">
                            <Brain size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">AI学習診断</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-4">
                            あなたの学習スタイル（Big Five）を分析し、最適なAIパートナーを見つけます。
                        </p>
                        <div className="flex items-center text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-full w-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <span className="mr-2">診断を開始</span> <ArrowLeft className="rotate-180" size={16} />
                        </div>
                    </div>
                </button>

                {/* Free Chat Card */}
                <button
                    onClick={startChat}
                    className="group relative overflow-hidden bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-emerald-500/50 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 text-left flex flex-col h-full"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform shadow-sm">
                            <MessageCircle size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">フリーチャット</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-4">
                            コードの質問、エラーの解決、プラットフォームの使い方など、自由に質問できます。
                        </p>
                        <div className="flex items-center text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <span className="mr-2">質問する</span> <ArrowLeft className="rotate-180" size={16} />
                        </div>
                    </div>
                </button>
            </div>

            {/* Footer / Trust Indicator */}
            <div className="mt-12 flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Brain size={14} />
                <span>Powered by Gemini 1.5 Pro</span>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <ChatInterface
                messages={messages}
                onSend={handleSend}
                suggestions={messages.length === 0 ? [] : currentSuggestions}
                isLoading={isLoading}
                emptyState={EmptyState}
                placeholder="Ask about diagnosis or coding..."
                header={
                    <div className="flex items-center gap-3 p-4 bg-white border-b border-slate-200">
                        <button onClick={() => onNavigate(ViewState.DASHBOARD)} className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-2">
                            <ArrowLeft size={20} className="text-slate-500" />
                        </button>
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
                            <Brain size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">Lumina Concierge</h2>
                            <p className="text-xs text-slate-500">AI Diagnosis & Learning Support</p>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default LuminaConciergeView;
