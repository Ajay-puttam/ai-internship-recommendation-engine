"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, CheckCircle2, AlertCircle, Loader2, Sparkles, Building2 } from "lucide-react";
import { analyzeResume } from "@/lib/api";

interface ResumeRecommendation {
    id: string;
    title: string;
    company: string;
    match_score: number;
    matched_skills: string[];
    missing_skills: string[];
}

export default function ResumeAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<ResumeRecommendation[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setExtractedSkills([]);
        setRecommendations([]);

        try {
            const res = await analyzeResume(file);
            setExtractedSkills(res.data.extracted_skills || []);
            // Type assertion since the API return type might differ slightly from our local interface
            setRecommendations(res.data.recommendations as unknown as ResumeRecommendation[]);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || "Failed to analyze resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6 text-emerald-400" /> Resume Analysis
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Upload your resume to extract skills and find AI-matched internships.
                </p>
            </motion.div>

            {/* Upload Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass rounded-2xl border border-border dark:border-white/10 p-8 text-center"
            >
                <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <div
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="w-8 h-8 text-emerald-400/80" />
                </div>

                <h2 className="text-xl font-semibold mb-2">
                    {file ? file.name : "Upload your PDF Resume"}
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                    Our NLP engine will automatically extract your skills
                    to calculate accurate match scores and identify required skills you might be missing.
                </p>

                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors shadow-lg shadow-emerald-600/20"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? "Analyzing..." : "Analyze Resume"}
                </button>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-red-400 text-sm flex items-center justify-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {extractedSkills.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-6"
                    >
                        {/* Extracted Skills Section */}
                        <div className="glass rounded-2xl border border-border dark:border-white/10 p-6">
                            <h3 className="font-semibold flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                Extracted Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {extractedSkills.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium border border-emerald-500/20">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations Section */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Target Internships & Skill Gaps</h3>
                            {recommendations.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recommendations found based on extracted skills.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {recommendations.map((rec, i) => (
                                        <motion.div
                                            key={rec.id || i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="glass rounded-2xl border border-border dark:border-white/10 overflow-hidden"
                                        >
                                            <div className="p-5 border-b border-border dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-lg">{rec.title}</h4>
                                                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                                                        <Building2 className="w-4 h-4" /> {rec.company}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="text-xs uppercase font-medium text-muted-foreground mb-1">Match Score</div>
                                                    <div className="text-xl font-bold text-violet-400">
                                                        {Math.round((rec.match_score || 0) * 100)}%
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5 bg-muted/30 grid sm:grid-cols-2 gap-6">
                                                {/* Matched Skills */}
                                                <div>
                                                    <h5 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-3">
                                                        Matched Skills
                                                    </h5>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {rec.matched_skills && rec.matched_skills.length > 0 ? (
                                                            rec.matched_skills.map(skill => (
                                                                <span key={skill} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">
                                                                    {skill}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">None</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Missing Skills */}
                                                <div>
                                                    <h5 className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-3">
                                                        Missing Skills
                                                    </h5>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {rec.missing_skills && rec.missing_skills.length > 0 ? (
                                                            rec.missing_skills.map(skill => (
                                                                <span key={skill} className="px-2.5 py-1 bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 rounded-md text-xs font-medium">
                                                                    {skill}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">Perfect match!</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
