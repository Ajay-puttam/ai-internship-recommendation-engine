"use client";

import { useMemo } from "react";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { RecommendationCard } from "./RecommendationCard";
import type { Recommendation } from "./useRecommendations";

interface RecommendationGridProps {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function RecommendationGrid({
  recommendations,
  loading,
  error,
  onRetry,
}: RecommendationGridProps) {
  const sorted = useMemo(() => {
    return [...recommendations].sort(
      (a, b) => b.final_score - a.final_score
    );
  }, [recommendations]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" />
        <p className="text-muted-foreground text-sm">Loading recommendations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
        <p className="text-muted-foreground mb-4">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Sparkles className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No recommendations found.</p>
        <p className="text-muted-foreground text-sm mt-1">
          Try different skills or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sorted.map((rec, i) => (
        <RecommendationCard
          key={`${rec.title}-${rec.company}-${i}`}
          recommendation={rec}
          index={i}
        />
      ))}
    </div>
  );
}
