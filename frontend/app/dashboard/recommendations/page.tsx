"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Brain } from "lucide-react";
import { InternshipCard } from "@/components/recommendations/InternshipCard";
import { getRecommendations } from "@/lib/api";
import { Recommendation } from "@/types";

export default function RecommendationsPage() {
    const [recs, setRecs] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRecs = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getRecommendations();
            setRecs(res.data.recommendations);
        } catch {
            setError("Could not load recommendations. Please check that the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecs();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-violet-400" />
                        AI Recommendations
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Top internship matches based on your profile and skills
                    </p>
                </div>
                <button
                    onClick={fetchRecs}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </motion.div>

            {/* AI Notice banner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-violet-600/10 border border-violet-600/20"
            >
                <Brain className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-violet-300">AI Recommendation Engine</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Matches are based on your skills, interests, and location preference.
                        The full ML engine will activate after Phase 2 integration.
                    </p>
                </div>
            </motion.div>

            {/* Loading state */}
            {loading && (
                <div className="space-y-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass rounded-2xl border border-white/10 p-6 animate-pulse">
                            <div className="flex justify-between mb-4">
                                <div className="space-y-2">
                                    <div className="h-5 w-48 bg-muted rounded" />
                                    <div className="h-4 w-32 bg-muted rounded" />
                                </div>
                                <div className="h-8 w-24 bg-muted rounded-full" />
                            </div>
                            <div className="flex gap-3 mb-4">
                                <div className="h-4 w-28 bg-muted rounded" />
                                <div className="h-4 w-20 bg-muted rounded" />
                            </div>
                            <div className="h-20 bg-muted rounded-xl mb-4" />
                            <div className="flex gap-3">
                                <div className="flex-1 h-10 bg-muted rounded-xl" />
                                <div className="flex-1 h-10 bg-muted rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className="text-center py-12 text-muted-foreground">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={fetchRecs} className="text-violet-400 hover:underline text-sm">
                        Try again
                    </button>
                </div>
            )}

            {/* Cards */}
            {!loading && !error && (
                <div className="space-y-5">
                    {recs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No recommendations yet. Complete your profile to get started.</p>
                        </div>
                    ) : (
                        recs.map((rec, i) => (
                            <InternshipCard key={rec.id} recommendation={rec} index={i} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
