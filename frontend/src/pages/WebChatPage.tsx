/**
 * WebChatPage — White / Yellow / Gray Theme
 */

import { useState, useRef, useEffect } from "react";
import { chatApi } from "../api/endpoints";

// ── Types ───────────────────────────────────────────────────────

interface ChatBubble {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: Array<{ document_id: string; chunk_index: number; score: number }>;
    timestamp: Date;
}

// ── Config ──────────────────────────────────────────────────────

const DEFAULT_BOT_ID = import.meta.env.VITE_DEFAULT_BOT_ID || "demo-bot";
const DEFAULT_ORG_ID = import.meta.env.VITE_DEFAULT_ORG_ID || "demo-org";

// ── Icons ───────────────────────────────────────────────────────

function SendIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
        </svg>
    );
}

function SourceIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.52c.18.085.37.13.562.138V4H9.5v4.658a1.48 1.48 0 0 0 .562-.138l6.598-3.195A1.5 1.5 0 0 0 15 4.5v-.793a1.5 1.5 0 0 0-1.5-1.5h-11Z" />
            <path d="M16 6.832v4.668a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 2 11.5V6.832l6.274 3.04a2.5 2.5 0 0 0 2.252-.02L16 6.833Z" />
        </svg>
    );
}

// ── Component ───────────────────────────────────────────────────

export default function WebChatPage() {
    const [messages, setMessages] = useState<ChatBubble[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => crypto.randomUUID());
    const [platformUserId] = useState(() => `web-${crypto.randomUUID().slice(0, 8)}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const el = e.target;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 150) + "px";
    };

    const handleSend = async () => {
        const query = input.trim();
        if (!query || isLoading) return;

        const userMsg: ChatBubble = {
            id: crypto.randomUUID(),
            role: "user",
            content: query,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        if (inputRef.current) inputRef.current.style.height = "auto";
        setIsLoading(true);

        try {
            const response = await chatApi.ask({
                userQuery: query,
                organizationId: DEFAULT_ORG_ID,
                botId: DEFAULT_BOT_ID,
                platformUserId,
                platformSource: "web",
                sessionId,
            });

            const assistantMsg: ChatBubble = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: response.data.answer,
                sources: response.data.sources,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: `ขออภัย ไม่สามารถเชื่อมต่อได้ในขณะนี้: ${errorMessage}`,
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-white via-steel-50 to-white">
            {/* ── Header ──────────────────────────────────────────── */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-steel-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-400 flex items-center justify-center text-steel-900 text-sm font-bold shadow-sm">
                        S
                    </div>
                    <div>
                        <h1 className="text-[15px] font-bold text-steel-900 leading-tight">SUNDAE</h1>
                        <p className="text-[11px] text-steel-400 leading-tight">Document AI Assistant</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[11px] font-medium text-emerald-700">Online</span>
                </div>
            </header>

            {/* ── Messages ────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                    {/* Welcome State */}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                            <div className="w-16 h-16 rounded-2xl bg-brand-400 flex items-center justify-center text-steel-900 text-2xl font-bold shadow-lg shadow-brand-200 mb-6">
                                S
                            </div>
                            <h2 className="text-xl font-bold text-steel-900 mb-2">สวัสดีครับ 👋</h2>
                            <p className="text-sm text-steel-500 max-w-sm mb-8 leading-relaxed">
                                ผมคือ SUNDAE AI — พร้อมช่วยค้นหาและตอบคำถาม
                                จากเอกสารขององค์กรของคุณ
                            </p>

                            {/* Suggestion Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                                {[
                                    { icon: "📋", text: "นโยบายการลาหยุด\nเป็นอย่างไร?" },
                                    { icon: "💼", text: "สวัสดิการพนักงาน\nมีอะไรบ้าง?" },
                                    { icon: "💰", text: "วิธีการเบิก\nค่าใช้จ่าย" },
                                ].map((s) => (
                                    <button
                                        key={s.text}
                                        onClick={() => {
                                            const q = s.text.replace(/\n/g, "");
                                            setInput(q);
                                            inputRef.current?.focus();
                                        }}
                                        className="group flex flex-col items-start gap-2 p-4 bg-white rounded-2xl border border-steel-200 hover:border-brand-400 hover:shadow-md hover:shadow-brand-100/50 transition-all duration-200 cursor-pointer text-left"
                                    >
                                        <span className="text-lg">{s.icon}</span>
                                        <span className="text-xs text-steel-600 group-hover:text-steel-800 transition-colors leading-relaxed whitespace-pre-line">
                                            {s.text}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chat Messages */}
                    <div className="space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {/* AI Avatar */}
                                {msg.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-xl bg-brand-400 flex items-center justify-center text-steel-900 text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                                        S
                                    </div>
                                )}

                                <div
                                    className={`max-w-[75%] ${msg.role === "user"
                                            ? "bg-steel-800 text-white rounded-2xl rounded-br-lg px-4 py-3 shadow-md shadow-steel-300"
                                            : "bg-white text-steel-800 rounded-2xl rounded-bl-lg px-4 py-3 border border-steel-200 shadow-sm"
                                        }`}
                                >
                                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                    {/* Source Pills */}
                                    {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-steel-100">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <SourceIcon />
                                                <span className="text-[11px] font-medium text-steel-400">อ้างอิงจากเอกสาร</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {msg.sources.map((src, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-steel-50 text-steel-500 px-2.5 py-1 rounded-full border border-steel-200"
                                                    >
                                                        <span className="w-1 h-1 rounded-full bg-brand-400"></span>
                                                        {src.document_id.slice(0, 8)}…
                                                        <span className="text-steel-400">#{src.chunk_index}</span>
                                                        <span className="text-emerald-500 font-semibold">{(src.score * 100).toFixed(0)}%</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <p className={`text-[10px] mt-2 ${msg.role === "user" ? "text-steel-400" : "text-steel-400"}`}>
                                        {msg.timestamp.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>

                                {/* User Avatar */}
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-xl bg-steel-700 flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
                                        U
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex gap-3 animate-fade-in">
                                <div className="w-8 h-8 rounded-xl bg-brand-400 flex items-center justify-center text-steel-900 text-xs font-bold shrink-0 shadow-sm">
                                    S
                                </div>
                                <div className="bg-white rounded-2xl rounded-bl-lg px-5 py-4 border border-steel-200 shadow-sm">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-steel-400 rounded-full animate-pulse-dot-1"></span>
                                        <span className="w-2 h-2 bg-steel-400 rounded-full animate-pulse-dot-2"></span>
                                        <span className="w-2 h-2 bg-steel-400 rounded-full animate-pulse-dot-3"></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* ── Input Area ──────────────────────────────────────── */}
            <div className="bg-white/80 backdrop-blur-xl border-t border-steel-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-end gap-3 bg-steel-50 rounded-2xl border border-steel-200 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all duration-200 px-4 py-2.5">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="พิมพ์คำถามของคุณ..."
                            disabled={isLoading}
                            rows={1}
                            className="flex-1 bg-transparent text-sm text-steel-800 placeholder:text-steel-400 resize-none outline-none max-h-[150px] py-1 leading-relaxed disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="w-9 h-9 bg-brand-400 text-steel-900 rounded-xl flex items-center justify-center hover:bg-brand-500 disabled:bg-steel-200 disabled:text-steel-400 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shrink-0"
                        >
                            <SendIcon />
                        </button>
                    </div>
                    <p className="text-center text-[11px] text-steel-400 mt-2.5">
                        SUNDAE ตอบจากเอกสารที่อัปโหลดในระบบเท่านั้น · Powered by RAG + Qwen
                    </p>
                </div>
            </div>
        </div>
    );
}
