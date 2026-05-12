"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, Bot, Loader2, ChevronLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { API_URL } from "@/config/api";

interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
  id: string;
  createdAt: Date;
}

export default function AIProjectPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      toast.error("Please login to use Neighbo AI");
      router.push("/login");
      return;
    }
    setToken(storedToken);

    // Initial welcome message
    setMessages([
      {
        id: "welcome",
        role: "model",
        parts: [{ text: "Hello! I'm **Neighbo AI**, your community assistant. How can I help you today? I can answer questions about the platform, provide local advice, or just chat!" }],
        createdAt: new Date(),
      },
    ]);
  }, [router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading || !token) return;

    const userMessageText = inputText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ text: userMessageText }],
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Prepare history for backend
      const history = messages.map((msg) => ({
        role: msg.role,
        parts: msg.parts,
      }));

      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userMessage: userMessageText,
          history: history,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        const aiReplies = data.reply; // Backend returns an array of strings (bubbles)
        
        if (Array.isArray(aiReplies)) {
          aiReplies.forEach((textPart, index) => {
            setTimeout(() => {
              const aiMessage: Message = {
                id: `${Date.now()}-${index}`,
                role: "model",
                parts: [{ text: textPart }],
                createdAt: new Date(),
              };
              setMessages((prev) => [...prev, aiMessage]);
            }, 500 * (index + 1));
          });
        } else {
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "model",
            parts: [{ text: aiReplies }],
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } else {
        throw new Error(data.message || "Failed to get AI response");
      }
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "model",
          parts: [{ text: "I'm sorry, I'm having trouble connecting to my brain right now. Could you try again in a moment?" }],
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([
        {
          id: "welcome-back",
          role: "model",
          parts: [{ text: "Chat cleared! How can I help you now?" }],
          createdAt: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter text-slate-900">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 h-[calc(100vh-120px)]">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 h-full">
            <SidebarLeft />
          </aside>

          {/* Main Chat Section */}
          <section className="col-span-1 lg:col-span-6 flex flex-col h-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Sparkles size={22} className="animate-pulse" />
                </div>
                <div>
                  <h1 className="font-poppins font-bold text-lg leading-none">Neighbo AI</h1>
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online & Ready</span>
                </div>
              </div>
              <button 
                onClick={clearChat}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Clear Chat"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                        {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === "user" 
                          ? "bg-primary text-white rounded-tr-none font-medium" 
                          : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                      }`}>
                        <div className="markdown-content prose prose-sm max-w-none">
                          <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                        </div>
                        <span className={`text-[9px] mt-2 block opacity-50 ${msg.role === "user" ? "text-white text-right" : "text-slate-500 text-left"}`}>
                          {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 items-center text-slate-400 p-2 ml-10">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs font-medium italic">Neighbo AI is thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <form onSubmit={handleSend} className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask anything about your community..."
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pr-14 focus:ring-2 ring-primary/20 outline-none transition-all placeholder:text-slate-400 text-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className={`absolute right-2 p-2.5 rounded-xl transition-all ${
                    !inputText.trim() || isLoading 
                      ? "text-slate-300 bg-transparent" 
                      : "text-white bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                  }`}
                >
                  <Send size={20} />
                </button>
              </form>
              <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
                Powered by Gemini. AI can make mistakes, so double-check important info.
              </p>
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 h-full">
            <SidebarRight />
          </aside>
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .markdown-content p {
          margin-bottom: 0.5rem;
        }
        .markdown-content p:last-child {
          margin-bottom: 0;
        }
        .markdown-content strong {
          font-weight: 700;
        }
        .markdown-content code {
          background: rgba(0,0,0,0.05);
          padding: 0.2rem 0.4rem;
          borderRadius: 0.25rem;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
