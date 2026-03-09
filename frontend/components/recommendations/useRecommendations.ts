"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";

export interface Recommendation {
  title: string;
  company: string;
  domain: string;
  location_region: string;
  similarity_score: number;
  skill_match_score: number;
  final_score: number;
  stipend: string;
  job_type: string;
  apply_link: string;
}

export interface RecommendationResponse {
  skills_query: string;
  total: number;
  recommendations: Recommendation[];
}

export interface FetchRecommendationsParams {
  skills: string;
  domain?: string;
  location_region?: string;
  experience?: string;
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchRecommendations = useCallback(
    async (params: FetchRecommendationsParams) => {
      const { skills, domain, location_region, experience } = params;

      if (!skills?.trim()) {
        setError("Skills are required.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const queryParams: Record<string, string> = {
          skills: skills.trim(),
        };
        if (domain?.trim()) queryParams.domain = domain.trim();
        if (location_region?.trim())
          queryParams.location_region = location_region.trim();
        if (experience?.trim()) queryParams.experience = experience.trim();

        const { data } = await api.get<RecommendationResponse>(
          "/api/recommendations",
          { params: queryParams }
        );

        setRecommendations(data.recommendations ?? []);
        setTotal(data.total ?? 0);
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { detail?: string } } }).response
                ?.data?.detail
            : null;
        setError(
          typeof message === "string"
            ? message
            : "Could not load recommendations. Please try again."
        );
        setRecommendations([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    recommendations,
    loading,
    error,
    total,
    fetchRecommendations,
  };
}
