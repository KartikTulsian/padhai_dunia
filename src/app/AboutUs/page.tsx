"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import FloatingParticles from "@/components/FloatingParticles";
import AppLink from "@/components/AppLink";

export default function AboutUsPage(): React.ReactElement {
  return (
    <main className="min-h-screen relative text-foreground overflow-x-hidden">
      {/* Landing page animated background */}
      <FloatingParticles />

      {/* NAVBAR – aligned with landing page */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand + logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-primary flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/logo_single.png"
              alt="PadhaiDunia Logo"
              width={50}
              height={50}
            />
            PadhaiDunia
          </motion.div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <AppLink
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </AppLink>
            <AppLink
              href="/AboutUs"
              className="text-primary font-medium transition-colors"
            >
              About Us
            </AppLink>
            <AppLink
              href="/Courses"
              className="text-foreground hover:text-primary transition-colors"
            >
              Courses
            </AppLink>
            <AppLink
              href="/teams"
              className="text-foreground hover:text-primary transition-colors"
            >
              Team
            </AppLink>
            <AppLink
              href="/contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact Us
            </AppLink>
          </div>

          {/* Auth / CTA */}
          <div className="flex items-center gap-4">
            <AppLink
              href="/sign-in"
              className="text-foreground hover:text-primary transition-colors"
            >
              Login
            </AppLink>
            <AppLink
              href="/sign-up"
              className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all"
            >
              Join Now
            </AppLink>
          </div>
        </div>
      </motion.nav>

      {/* MAIN CONTENT */}
      <section className="px-4 sm:px-6 lg:px-10 py-20 lg:py-24 max-w-6xl mx-auto">
        {/* About Us */}
        <div className="relative mb-10 text-center">
          <div className="absolute -inset-6 bg-primary/10 blur-2xl rounded-3xl" />
          <div className="relative rounded-3xl glass border border-white/15 bg-background/80 backdrop-blur-sm p-6 sm:p-10 shadow-2xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <p className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-primary-foreground bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
              <span>🚀</span> About PadhaiDunia
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
              <span>Empowering the </span>
              <span className="text-primary">Future of Learners</span>
            </h1>
            <p className="mt-4 mx-auto max-w-3xl text-muted-foreground">
              PadhaiDunia is a modern learning platform where students explore
              curated courses, practise exams, and discover top colleges—all in
              one place. We blend technology, mentorship, and community to make
              high-quality education accessible, engaging, and outcome-driven.
            </p>
            <p className="mt-3 mx-auto max-w-3xl text-muted-foreground">
              We help every learner build real skills, gain confidence, and
              accelerate their careers through personalized learning paths and
              measurable progress.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="relative mb-10 text-center">
          <div className="absolute -inset-6 bg-emerald-500/10 blur-2xl rounded-3xl" />
          <div className="relative rounded-3xl glass border border-white/15 bg-background/80 backdrop-blur-sm p-6 sm:p-10 shadow-2xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Our Mission
            </h2>
            <p className="mt-3 mx-auto max-w-3xl text-muted-foreground">
              To deliver accessible, outcome-oriented education through
              interactive learning, real-time feedback, and actionable
              insights—so every student can learn faster, smarter, and with
              confidence.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  title: "Personalized Paths",
                  desc: "Adaptive recommendations keep learning relevant.",
                },
                {
                  title: "Practice That Counts",
                  desc: "Exam-style questions with analytics.",
                },
                {
                  title: "Guided Decisions",
                  desc: "Transparent college data for better choices.",
                },
              ].map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="glass rounded-xl p-6 text-center hover-glow group cursor-pointer"
                >
                  <h3 className="font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="relative text-center">
          <div className="absolute -inset-6 bg-pink-500/10 blur-2xl rounded-3xl" />
          <div className="relative rounded-3xl glass border border-white/15 bg-background/80 backdrop-blur-sm p-6 sm:p-10 shadow-2xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Key Features
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  title: "AI-Powered Learning",
                  desc: "Personalized learning paths that adapt to your style and pace.",
                  icon: "🧠",
                },
                {
                  title: "Personalized Progress Tracking",
                  desc: "Advanced analytics with insights and performance metrics.",
                  icon: "📈",
                },
                {
                  title: "Community & Collaboration",
                  desc: "Study groups, discussions, and peer learning.",
                  icon: "👥",
                },
                {
                  title: "Gamified Learning Experience",
                  desc: "Badges, challenges, and rewards to keep you engaged.",
                  icon: "🎮",
                },
                // Original extra features
                {
                  title: "Interactive Courses",
                  desc: "Video + hands-on tasks for real understanding.",
                  icon: "📘",
                },
                {
                  title: "Mock Exams",
                  desc: "Timed and topic-wise tests with detailed feedback.",
                  icon: "🧠",
                },
                {
                  title: "College Finder",
                  desc: "Compare programs, fees, and outcomes.",
                  icon: "🏫",
                },
                {
                  title: "Mentor Support",
                  desc: "Guidance from experienced mentors.",
                  icon: "🤝",
                },
              ].map((f, idx) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="glass rounded-xl p-6 text-center hover-glow group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{f.icon}</span>
                  </div>
                  <h3 className="mt-2 font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
