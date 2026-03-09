"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ArrowLeft, User, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { saveProfile } from "@/lib/api";

const SKILLS = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL",
    "Machine Learning", "Data Science", "TensorFlow", "Pandas", "NumPy",
    "AWS", "Docker", "Linux", "Java", "C++", "Cybersecurity", "Figma",
];

const INTERESTS = [
    "AI / Machine Learning", "Data Science", "Web Development",
    "Cybersecurity", "Cloud Computing", "Mobile Development",
    "DevOps", "Blockchain", "UI/UX Design", "Data Engineering",
];

const STEPS = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Skills & Interests", icon: Sparkles },
    { id: 3, title: "Preferences", icon: MapPin },
];

export default function ProfileSetupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        degree: "",
        branch: "",
        college: "",
        skills: [] as string[],
        interests: [] as string[],
        location_preference: "",
        internship_mode: "" as "" | "remote" | "onsite" | "hybrid",
    });

    const toggleItem = (key: "skills" | "interests", value: string) => {
        setForm((f) => ({
            ...f,
            [key]: f[key].includes(value)
                ? f[key].filter((v) => v !== value)
                : [...f[key], value],
        }));
    };

    const handleSubmit = async () => {
        if (!form.internship_mode) {
            setError("Please select an internship mode.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await saveProfile(form);
            router.push("/dashboard");
        } catch {
            setError("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Set Up Your Profile</h1>
                    <p className="text-muted-foreground">Help us personalize your internship recommendations</p>
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-center mb-10 gap-0">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step > s.id
                                        ? "bg-violet-600 border-violet-600 text-white"
                                        : step === s.id
                                            ? "border-violet-600 text-violet-400"
                                            : "border-border text-muted-foreground"
                                    }`}
                            >
                                {step > s.id ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <s.icon className="w-4 h-4" />
                                )}
                            </div>
                            <span className={`ml-2 text-sm font-medium hidden sm:block ${step === s.id ? "text-violet-400" : "text-muted-foreground"}`}>
                                {s.title}
                            </span>
                            {i < STEPS.length - 1 && (
                                <div className={`w-16 h-px mx-3 ${step > s.id ? "bg-violet-600" : "bg-border"}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="glass rounded-2xl p-8 border border-border dark:border-white/10">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-5"
                            >
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-violet-400" />
                                    Academic Information
                                </h2>
                                {[
                                    { label: "Degree", name: "degree", placeholder: "e.g. B.Tech, B.Sc, BCA" },
                                    { label: "Branch / Specialization", name: "branch", placeholder: "e.g. Computer Science, Data Science" },
                                    { label: "College / University", name: "college", placeholder: "e.g. IIT Delhi, VIT Vellore" },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                                        <input
                                            type="text"
                                            value={(form as any)[field.name]}
                                            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                                            placeholder={field.placeholder}
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Step 2: Skills & Interests */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-1">
                                        <Sparkles className="w-5 h-5 text-violet-400" />
                                        Skills
                                    </h2>
                                    <p className="text-sm text-muted-foreground mb-4">Select all technologies you know</p>
                                    <div className="flex flex-wrap gap-2">
                                        {SKILLS.map((skill) => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => toggleItem("skills", skill)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.skills.includes(skill)
                                                        ? "bg-violet-600 border-violet-600 text-white"
                                                        : "border-border text-muted-foreground hover:border-violet-400 hover:text-violet-400"
                                                    }`}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold mb-1">Interests</h2>
                                    <p className="text-sm text-muted-foreground mb-4">What domains excite you?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {INTERESTS.map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => toggleItem("interests", interest)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.interests.includes(interest)
                                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                                        : "border-border text-muted-foreground hover:border-indigo-400 hover:text-indigo-400"
                                                    }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Preferences */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-violet-400" />
                                    Location & Mode Preferences
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Preferred Location</label>
                                    <input
                                        type="text"
                                        value={form.location_preference}
                                        onChange={(e) => setForm({ ...form, location_preference: e.target.value })}
                                        placeholder="e.g. Bangalore, Delhi, Remote"
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3">Internship Mode</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(["remote", "onsite", "hybrid"] as const).map((mode) => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setForm({ ...form, internship_mode: mode })}
                                                className={`py-4 rounded-xl border text-sm font-medium capitalize transition-all ${form.internship_mode === mode
                                                        ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/20"
                                                        : "border-border text-muted-foreground hover:border-violet-400"
                                                    }`}
                                            >
                                                {mode === "remote" ? "🌐" : mode === "onsite" ? "🏢" : "🔄"} {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="rounded-xl bg-violet-600/10 border border-violet-600/20 p-4 text-sm">
                                    <p className="font-medium text-violet-400 mb-2">Profile Summary</p>
                                    <div className="space-y-1 text-muted-foreground">
                                        {form.degree && <p>📚 {form.degree} in {form.branch}</p>}
                                        {form.college && <p>🏫 {form.college}</p>}
                                        {form.skills.length > 0 && <p>⚡ {form.skills.slice(0, 3).join(", ")}{form.skills.length > 3 ? ` +${form.skills.length - 3} more` : ""}</p>}
                                        {form.interests.length > 0 && <p>🎯 {form.interests.slice(0, 2).join(", ")}{form.interests.length > 2 ? ` +${form.interests.length - 2} more` : ""}</p>}
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                                        {error}
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-border">
                        <button
                            onClick={() => setStep(Math.max(1, step - 1))}
                            disabled={step === 1}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium disabled:opacity-40 hover:bg-accent transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Find My Internships
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
