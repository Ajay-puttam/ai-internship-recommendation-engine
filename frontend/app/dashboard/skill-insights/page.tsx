"use client";
import { motion } from "framer-motion";
import { BarChart3, Construction } from "lucide-react";

export default function SkillInsightsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-400" /> Skill Gap Insights
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Discover what skills to learn for your dream role</p>
            </motion.div>
            <div className="glass rounded-2xl border border-white/10 p-12 text-center">
                <Construction className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Coming in Phase 2</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    The Skill Gap Analyzer will compare your current skills against top internship requirements
                    and generate a personalized learning roadmap.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto text-left">
                    {["Python", "Machine Learning", "SQL"].map((skill) => (
                        <div key={skill} className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="text-xs text-blue-400 font-medium mb-1">{skill}</div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 w-3/4 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
