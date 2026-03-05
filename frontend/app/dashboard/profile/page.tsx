"use client";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

export default function ProfileSettingsPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <UserCircle className="w-6 h-6 text-violet-400" /> Profile Settings
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
            </motion.div>
            <div className="glass rounded-2xl border border-white/10 p-8 space-y-6">
                <p className="text-sm text-muted-foreground">
                    Edit your academic info, skills, and preferences to improve recommendation accuracy.
                </p>
                <a
                    href="/profile-setup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                >
                    Edit Profile
                </a>
            </div>
        </div>
    );
}
