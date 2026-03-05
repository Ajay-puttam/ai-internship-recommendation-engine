"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Sparkles,
    BarChart3,
    FileText,
    MessageSquare,
    ArrowRight,
    Brain,
    TrendingUp,
    Clock,
} from "lucide-react";

const DASHBOARD_CARDS = [
    {
        title: "Recommended Internships",
        desc: "AI has found 3 highly relevant matches for you today.",
        icon: Sparkles,
        color: "from-violet-500 to-purple-600",
        href: "/dashboard/recommendations",
        badge: "3 New",
        badgeColor: "bg-violet-500/20 text-violet-300",
    },
    {
        title: "Skill Gap Insights",
        desc: "Discover skills to learn for your target roles.",
        icon: BarChart3,
        color: "from-blue-500 to-cyan-600",
        href: "/dashboard/skill-insights",
        badge: "Coming Soon",
        badgeColor: "bg-blue-500/20 text-blue-300",
    },
    {
        title: "Resume Analysis",
        desc: "Upload your resume for AI-powered NLP extraction.",
        icon: FileText,
        color: "from-emerald-500 to-teal-600",
        href: "/dashboard/resume",
        badge: "Coming Soon",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
    },
    {
        title: "Career Chatbot",
        desc: "Get guidance from our AI career coach 24/7.",
        icon: MessageSquare,
        color: "from-rose-500 to-pink-600",
        href: "/dashboard/chatbot",
        badge: "Coming Soon",
        badgeColor: "bg-rose-500/20 text-rose-300",
    },
];

const ACTIVITY = [
    { label: "Profile completed", time: "Just now", icon: Brain },
    { label: "AI recommendations generated", time: "1 min ago", icon: Sparkles },
    { label: "3 internships matched", time: "1 min ago", icon: TrendingUp },
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
    }),
};

export default function DashboardPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Welcome back! Your AI recommendations are ready.
                    </p>
                </div>
                <Link
                    href="/dashboard/recommendations"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors shadow-lg shadow-violet-600/20"
                >
                    <Sparkles className="w-4 h-4" />
                    View Recommendations
                </Link>
            </motion.div>

            {/* Main cards grid */}
            <div className="grid sm:grid-cols-2 gap-5">
                {DASHBOARD_CARDS.map((card, i) => (
                    <motion.div
                        key={card.title}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        <Link
                            href={card.href}
                            className="block p-6 rounded-2xl glass border border-white/10 card-hover group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                                    {card.badge}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-violet-400 transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{card.desc}</p>
                            <div className="flex items-center gap-1 text-xs text-violet-400 font-medium">
                                Open <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl border border-white/10 p-6"
            >
                <div className="flex items-center gap-2 mb-5">
                    <Clock className="w-4 h-4 text-violet-400" />
                    <h2 className="font-semibold">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                    {ACTIVITY.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                                <item.icon className="w-4 h-4 text-violet-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.label}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
