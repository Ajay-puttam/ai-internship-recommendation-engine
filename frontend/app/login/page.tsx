"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Brain, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { login, register } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import Link from "next/link";

type Tab = "login" | "register";

export default function LoginPage() {
    const [tab, setTab] = useState<Tab>("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Form state
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (tab === "login") {
                const res = await login(form.email, form.password);
                const token = res.data.access_token;
                saveToken(token);
                // Also set cookie so middleware can read it
                document.cookie = `ai_intern_token=${token}; path=/; max-age=86400`;
                router.push("/dashboard");
            } else {
                if (!form.name.trim()) {
                    setError("Name is required.");
                    setLoading(false);
                    return;
                }
                const res = await register(form.name, form.email, form.password);
                const token = res.data.access_token;
                saveToken(token);
                document.cookie = `ai_intern_token=${token}; path=/; max-age=86400`;
                router.push("/profile-setup");
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.detail ||
                (tab === "login"
                    ? "Invalid email or password."
                    : "Registration failed. Email may already be in use.");
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
            {/* Background blobs */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 justify-center">
                        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-violet-600/30">
                            <Brain className="w-7 h-7 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold mt-4">
                        {tab === "login" ? "Welcome back" : "Create your account"}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {tab === "login"
                            ? "Sign in to access your AI recommendations"
                            : "Start finding your perfect internship today"}
                    </p>
                </div>

                <div className="glass rounded-2xl p-8 shadow-2xl border border-white/10">
                    {/* Tab switcher */}
                    <div className="flex rounded-xl bg-muted p-1 mb-8">
                        {(["login", "register"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setError(""); setForm({ name: "", email: "", password: "" }); }}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t
                                        ? "bg-violet-600 text-white shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {t === "login" ? "Login" : "Create Account"}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence>
                            {tab === "register" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Ajay Kumar"
                                        required={tab === "register"}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder={tab === "register" ? "Min. 8 characters" : "Enter your password"}
                                    required
                                    minLength={tab === "register" ? 8 : undefined}
                                    className="w-full px-4 py-3 pr-10 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-violet-600/30 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    {tab === "login" ? "Sign In" : "Create Account"}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground mt-6">
                        {tab === "login" ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <button onClick={() => setTab("register")} className="text-violet-400 hover:underline font-medium">
                                    Create one
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setTab("login")} className="text-violet-400 hover:underline font-medium">
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        ← Back to home
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
