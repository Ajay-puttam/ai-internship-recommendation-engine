"use client";
import { motion } from "framer-motion";
import { MessageSquare, Construction } from "lucide-react";

export default function ChatbotPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-rose-400" /> Career Chatbot
                </h1>
                <p className="text-muted-foreground text-sm mt-1">AI career coach — available 24/7</p>
            </motion.div>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                {/* Mock chat UI */}
                <div className="h-96 p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div className="glass rounded-2xl rounded-tl-none px-4 py-3 text-sm max-w-xs">
                            👋 Hi! I&apos;m your AI Career Coach. How can I help you today?
                            <br /><span className="text-muted-foreground text-xs">(Coming in Phase 2)</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <Construction className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground text-sm">Multilingual chatbot — Phase 2 Feature</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 border-t border-white/10">
                    <input
                        disabled
                        placeholder="Chatbot coming soon..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm opacity-50 cursor-not-allowed"
                    />
                    <button disabled className="px-4 py-2.5 rounded-xl bg-violet-600/50 text-white text-sm opacity-50 cursor-not-allowed">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
