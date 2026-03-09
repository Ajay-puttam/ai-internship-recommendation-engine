"use client";

import Link from "next/link";
import { useTheme } from "@/components/shared/ThemeProvider";
import { Moon, Sun, Brain, Menu, X } from "lucide-react";
import { useState } from "react";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface NavbarProps {
    isLoggedIn?: boolean;
}

export default function Navbar({ isLoggedIn = false }: NavbarProps) {
    const { theme, setTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        removeToken();
        document.cookie = "ai_intern_token=; Max-Age=0; path=/";
        router.push("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="gradient-text hidden sm:block">InternAI</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {!isLoggedIn ? (
                            <>
                                <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    How it Works
                                </Link>
                                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Features
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Logout
                            </button>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-4 h-4" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-accent"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2 border-t border-border dark:border-white/10">
                    {!isLoggedIn && (
                        <>
                            <Link href="/#how-it-works" className="block py-2 text-sm text-muted-foreground">How it Works</Link>
                            <Link href="/#features" className="block py-2 text-sm text-muted-foreground">Features</Link>
                            <Link href="/login" className="block py-2 text-sm font-medium text-violet-400">Get Started</Link>
                        </>
                    )}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="flex items-center gap-2 py-2 text-sm text-muted-foreground"
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>
            )}
        </nav>
    );
}
