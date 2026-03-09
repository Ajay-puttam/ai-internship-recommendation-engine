"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import {
  Brain,
  FileSearch,
  BarChart3,
  MessageSquare,
  Globe2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Upload,
  Target,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    desc: "Get 3–5 hyper-relevant internship matches using hybrid ML algorithms tailored to your profile.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: FileSearch,
    title: "Resume Analysis",
    desc: "Our NLP engine parses your resume to extract skills, experience, and career intent automatically.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Skill Gap Insights",
    desc: "Discover which skills to learn next to qualify for your dream internship.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: MessageSquare,
    title: "Career Chatbot",
    desc: "Get 24/7 career guidance from our AI assistant trained on thousands of student journeys.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Globe2,
    title: "Multilingual Support",
    desc: "Interact in your native language — Hindi, Tamil, Telugu, Bengali, and more.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Target,
    title: "PM Internship Scheme",
    desc: "Access exclusive government internship opportunities from the PM Internship Scheme dataset.",
    color: "from-indigo-500 to-blue-600",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create Your Profile",
    desc: "Tell us your degree, branch, skills, interests, and location preference in under 2 minutes.",
    icon: Upload,
  },
  {
    step: "02",
    title: "Upload Your Resume",
    desc: "Our AI reads your resume to extract skills and experience — no manual entry needed.",
    icon: FileSearch,
  },
  {
    step: "03",
    title: "Get Matched",
    desc: "Receive 3–5 highly relevant internships with match scores and personalized reasons.",
    icon: Sparkles,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-violet-400 font-medium"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Discovery
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6"
          >
            Find the Right{" "}
            <span className="gradient-text">Internship</span>
            <br />
            with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Get personalized internship recommendations based on your skills,
            interests, and career goals - powered by advanced AI that
            understands <em>you</em>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-lg transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass text-foreground font-semibold text-lg hover:bg-accent transition-all"
            >
              See How it Works
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { label: "Internships", value: "1,000+" },
              { label: "Match Accuracy", value: "92%" },
              { label: "Students Helped", value: "50K+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to your perfect internship match
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">


            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="relative text-center p-8 rounded-2xl glass border border-border dark:border-white/10 card-hover"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-violet-600/20 border border-violet-600/30 mb-6">
                  <step.icon className="w-8 h-8 text-violet-400" />
                </div>
                <div className="absolute top-4 right-4 text-5xl font-black text-violet-300 dark:text-violet-400/60 select-none">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-transparent to-violet-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Packed with AI features designed specifically for students
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="p-6 rounded-2xl glass border border-border dark:border-white/10 card-hover group"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-5 shadow-lg`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-violet-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="py-24 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="max-w-4xl mx-auto text-center rounded-3xl p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #3730a3 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect Internship?
            </h2>
            <p className="text-violet-200 text-lg mb-8">
              Join 50,000+ students who found their dream internship with InternAI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-violet-700 font-bold hover:bg-violet-50 transition-colors shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                Get Started Free
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-violet-200 text-sm">
              {["No credit card required", "Free for students", "Setup in 2 minutes"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border dark:border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">InternAI</span>
          </div>
          <p className="text-muted-foreground text-sm text-center">
            AI-Based Internship Recommendation Engine — Major Project 2024
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
