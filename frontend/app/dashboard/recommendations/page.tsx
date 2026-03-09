"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRecommendations } from "@/components/recommendations/useRecommendations";
import { RecommendationForm } from "@/components/recommendations/RecommendationForm";
import { RecommendationGrid } from "@/components/recommendations/RecommendationGrid";
import type { FetchRecommendationsParams } from "@/components/recommendations/useRecommendations";

export default function RecommendationsPage() {
  const {
    recommendations,
    loading,
    error,
    total,
    fetchRecommendations,
  } = useRecommendations();

  const lastParamsRef = useRef<FetchRecommendationsParams | null>(null);

  const handleSubmit = (params: FetchRecommendationsParams) => {
    lastParamsRef.current = params;
    fetchRecommendations(params);
  };

  const handleRetry = () => {
    if (lastParamsRef.current) {
      fetchRecommendations(lastParamsRef.current);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-400" />
          Internship Recommendations
        </h1>
        <p className="text-muted-foreground text-sm">
          Get personalized internship recommendations based on your skills.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <RecommendationForm onSubmit={handleSubmit} loading={loading} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <RecommendationGrid
          recommendations={recommendations}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      </motion.div>
    </div>
  );
}
