"use client";

import { motion } from "framer-motion";
import { Recommendation } from "@/types";
import {
    MapPin,
    Clock,
    DollarSign,
    CheckCircle2,
    ExternalLink,
    Building2,
    Zap,
} from "lucide-react";

interface InternshipCardProps {
    recommendation: Recommendation;
    index: number;
}

function MatchScoreBadge({ score }: { score: number }) {
    const color =
        score >= 85
            ? "from-emerald-500 to-green-600"
            : score >= 70
                ? "from-amber-500 to-orange-500"
                : "from-blue-500 to-cyan-600";

    return (
        <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${color} text-white text-sm font-bold shadow-lg`}
        >
            <Zap className="w-3.5 h-3.5" />
            {score}% Match
        </div>
    );
}

export function InternshipCard({ recommendation: rec, index }: InternshipCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="glass rounded-2xl border border-white/10 p-6 card-hover"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold truncate">{rec.title}</h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{rec.company}</span>
                    </div>
                </div>
                <MatchScoreBadge score={rec.match_score} />
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-3 mb-4">
                {rec.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-violet-400" />
                        {rec.location}
                    </div>
                )}
                {rec.duration && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {rec.duration}
                    </div>
                )}
                {rec.stipend && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        {rec.stipend}
                    </div>
                )}
            </div>

            {/* Skills required */}
            {rec.skills_required && rec.skills_required.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {rec.skills_required.map((skill) => (
                        <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md text-xs bg-violet-600/15 text-violet-300 border border-violet-600/20"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            {/* Why Recommended */}
            {rec.reasons && rec.reasons.length > 0 && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 mb-5">
                    <p className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">
                        Why Recommended
                    </p>
                    <ul className="space-y-1.5">
                        {rec.reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                {reason}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors">
                    View Details
                </button>
                <a
                    href={rec.apply_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors shadow-lg shadow-violet-600/20"
                >
                    Apply Now
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        </motion.div>
    );
}
