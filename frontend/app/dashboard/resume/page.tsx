"use client";
import { motion } from "framer-motion";
import { FileText, Upload, Construction } from "lucide-react";

export default function ResumeAnalysisPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6 text-emerald-400" /> Resume Analysis
                </h1>
                <p className="text-muted-foreground text-sm mt-1">AI-powered NLP resume parsing</p>
            </motion.div>
            <div className="glass rounded-2xl border border-border dark:border-white/10 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-emerald-400/50" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Resume Upload Coming Soon</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                    Upload your PDF resume and our NLP engine will automatically extract your skills,
                    experience, projects, and education to enhance your recommendations.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm">
                    <Construction className="w-4 h-4" /> Phase 2 Feature
                </div>
            </div>
        </div>
    );
}
