"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, ExternalLink } from "lucide-react";
import type { Recommendation } from "./useRecommendations";

const toTitleCase = (str: string): string => {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  index?: number;
}

function MatchBadge({ score }: { score: number }) {
  const rounded = Math.round(score);
  const strong = rounded >= 50;
  const good = rounded >= 35 && rounded < 50;
  const weak = rounded < 35;

  const label = strong
    ? "Strong Match"
    : good
      ? "Good Match"
      : "Weak Match";

  const className = strong
    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    : good
      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}
    >
      {rounded}% Match — {label}
    </span>
  );
}

export function RecommendationCard({
  recommendation: rec,
  index = 0,
}: RecommendationCardProps) {
  const locationLabel =
    !rec.location_region || rec.location_region.toLowerCase() === "unknown"
      ? "Location Not Specified"
      : toTitleCase(rec.location_region);

  const hasApplyLink = Boolean(rec.apply_link?.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="glass rounded-2xl border border-border dark:border-white/10 p-6 h-full flex flex-col"
    >
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg leading-snug break-words">
            {toTitleCase(rec.title)}
          </h3>
          <div className="w-fit">
            <MatchBadge score={rec.final_score * 100} />
          </div>
          <p className="text-sm text-muted-foreground break-words">
            {toTitleCase(rec.company)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            {rec.domain ? toTitleCase(rec.domain) : "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            {locationLabel}
          </span>
          {rec.stipend ? (
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              {rec.stipend}
            </span>
          ) : null}
        </div>

        {rec.job_type ? (
          <span className="inline-flex w-fit px-2 py-0.5 rounded-md text-xs bg-violet-600/15 text-violet-300 border border-violet-600/20">
            {toTitleCase(rec.job_type)}
          </span>
        ) : null}
      </div>

      <div className="mt-5 pt-4 border-t border-border dark:border-white/10">
        {hasApplyLink ? (
          <a
            href={rec.apply_link!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors shadow-lg shadow-violet-600/20"
          >
            Apply
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed"
          >
            Link Unavailable
          </button>
        )}
      </div>
    </motion.div>
  );
}
