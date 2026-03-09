"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { FetchRecommendationsParams } from "./useRecommendations";

const DOMAIN_OPTIONS = [
  "web development",
  "data analytics",
  "software engineering",
  "artificial intelligence",
  "machine learning",
  "mobile development",
  "business analytics",
  "data engineering",
  "data science",
  "general",
  "database",
  "content writing",
  "research",
  "devops cloud",
  "digital marketing",
  "blockchain",
  "ui ux design",
  "game development",
  "robotics automation",
  "cybersecurity",
];

const LOCATION_OPTIONS = [
  "india",
  "us",
  "europe",
  "singapore",
  "canada",
  "asia pacific",
  "africa",
  "south america",
  "remote",
];

const EXPERIENCE_OPTIONS = [
  { value: "", label: "All Levels" },
  { value: "no experience required", label: "no experience required" },
  { value: "entry level", label: "entry level" },
];

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

interface RecommendationFormProps {
  onSubmit: (params: FetchRecommendationsParams) => void;
  loading: boolean;
}

export function RecommendationForm({ onSubmit, loading }: RecommendationFormProps) {
  const [skills, setSkills] = useState("");
  const [domain, setDomain] = useState("");
  const [location_region, setLocation_region] = useState("");
  const [experience, setExperience] = useState("");
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const skillsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    skillsRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSkillsError(null);

    const trimmedSkills = skills.trim();
    if (!trimmedSkills) {
      setSkillsError("Skills are required.");
      return;
    }

    onSubmit({
      skills: trimmedSkills,
      domain: domain.trim() || undefined,
      location_region: location_region.trim() || undefined,
      experience: experience.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-2xl border border-border dark:border-white/10 p-6 space-y-5"
    >
      <div>
        <label
          htmlFor="recommendations-skills"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Skills <span className="text-red-400">*</span>
        </label>
        <input
          ref={skillsRef}
          id="recommendations-skills"
          type="text"
          value={skills}
          onChange={(e) => {
            setSkills(e.target.value);
            if (skillsError) setSkillsError(null);
          }}
          placeholder="e.g. python, machine learning, react"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          disabled={loading}
          autoComplete="off"
        />
        {skillsError ? (
          <p className="text-red-400 text-xs mt-1">{skillsError}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="recommendations-domain"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Domain (optional)
        </label>
        <select
          id="recommendations-domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="">Any</option>
          {DOMAIN_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {toTitleCase(opt)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="recommendations-location"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Location (optional)
        </label>
        <select
          id="recommendations-location"
          value={location_region}
          onChange={(e) => setLocation_region(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="">Any</option>
          {LOCATION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {toTitleCase(opt)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="recommendations-experience"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Experience
        </label>
        <select
          id="recommendations-experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          disabled={loading}
        >
          {EXPERIENCE_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {toTitleCase(opt.label)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-violet-600/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading…
          </>
        ) : (
          "Get Recommendations"
        )}
      </button>
    </form>
  );
}
