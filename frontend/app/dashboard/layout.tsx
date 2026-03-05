"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Sparkles,
    BarChart3,
    FileText,
    MessageSquare,
    UserCircle,
    Brain,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { removeToken } from "@/lib/auth";
import { useTheme } from "@/components/shared/ThemeProvider";
import { Sun, Moon } from "lucide-react";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/recommendations", label: "Recommendations", icon: Sparkles },
    { href: "/dashboard/skill-insights", label: "Skill Insights", icon: BarChart3 },
    { href: "/dashboard/resume", label: "Resume Analysis", icon: FileText },
    { href: "/dashboard/chatbot", label: "Chatbot", icon: MessageSquare },
    { href: "/dashboard/profile", label: "Profile Settings", icon: UserCircle },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        removeToken();
        document.cookie = "ai_intern_token=; Max-Age=0; path=/";
        router.push("/");
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col glass border-r border-white/10 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:static lg:z-auto`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg gradient-text">InternAI</span>
                    <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "group-hover:text-violet-400"}`} />
                                {item.label}
                                {item.label === "Recommendations" && (
                                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-violet-400/20 text-violet-300">
                                        AI
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom: Theme + Logout */}
                <div className="px-3 py-4 border-t border-white/10 space-y-1">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
                {/* Top bar (mobile) */}
                <header className="lg:hidden flex items-center h-14 px-4 glass border-b border-white/10">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-accent">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 mx-auto font-bold">
                        <Brain className="w-5 h-5 text-violet-400" />
                        <span className="gradient-text">InternAI</span>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
