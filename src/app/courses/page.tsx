"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import FloatingParticles from "@/components/FloatingParticles";
import AppLink from "@/components/AppLink";
import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "Web Development Fundamentals",
    description:
      "Learn HTML, CSS, and JavaScript basics to build responsive websites from scratch.",
    duration: "8 weeks",
    level: "Beginner",
    price: "₹2,999",
  },
  {
    title: "React.js Mastery",
    description:
      "Master React.js with hooks, state management, and modern development practices.",
    duration: "10 weeks",
    level: "Intermediate",
    price: "₹4,999",
  },
  {
    title: "Full Stack Development",
    description:
      "Complete web development course covering frontend, backend, and database technologies.",
    duration: "16 weeks",
    level: "Advanced",
    price: "₹8,999",
  },
  {
    title: "Python Programming",
    description:
      "Learn Python from basics to advanced concepts including data structures and algorithms.",
    duration: "12 weeks",
    level: "Beginner",
    price: "₹3,499",
  },
  {
    title: "Data Science & Analytics",
    description:
      "Analyze data, build models, and visualize results using Python and industry tools.",
    duration: "14 weeks",
    level: "Intermediate",
    price: "₹7,499",
  },
  {
    title: "Mobile App Development",
    description:
      "Build cross-platform mobile apps using React Native and modern frameworks.",
    duration: "12 weeks",
    level: "Intermediate",
    price: "₹6,999",
  },
  {
    title: "UI/UX Design",
    description:
      "Design beautiful, user-friendly interfaces and experiences for web and mobile.",
    duration: "8 weeks",
    level: "Beginner",
    price: "₹3,999",
  },
  {
    title: "Cloud Computing & DevOps",
    description:
      "Learn cloud platforms, CI/CD, and DevOps practices for scalable deployments.",
    duration: "10 weeks",
    level: "Advanced",
    price: "₹9,499",
  },
];

export default function CoursesPage(): React.ReactElement {
  return (
    <main className="min-h-screen relative text-foreground overflow-x-hidden">
      <FloatingParticles />

      {/* NAVBAR – matched to landing page */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand with logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-primary flex items-center gap-2"
          >
            <Image
              src="/logo_single.png"
              alt="PadhaiDunia Logo"
              width={50}
              height={50}
            />
            PadhaiDunia
          </motion.div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <AppLink
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </AppLink>
            <AppLink
              href="/AboutUs"
              className="text-foreground hover:text-primary transition-colors"
            >
              About Us
            </AppLink>
            <AppLink
              href="/Courses"
              className="text-primary font-medium transition-colors"
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

      {/* HEADER */}
      <section className="pt-28 lg:pt-32 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-foreground mb-4"
          >
            Explore Our Courses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto max-w-2xl text-muted-foreground mb-8"
          >
            Learn cutting-edge skills with our modern, interactive courses tailored
            for every level of learner.
          </motion.p>
        </div>
      </section>

      {/* COURSES GRID */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {courses.map((course, idx) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass rounded-2xl p-6 flex flex-col justify-between border border-white/10 bg-background/80 backdrop-blur-md transition-all duration-300 relative overflow-hidden hover-glow"
              >
                <div>
                  <h2 className="text-lg font-bold text-primary mb-2">
                    {course.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    {course.description}
                  </p>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{course.duration}</span>
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[0.7rem] font-medium">
                      {course.level}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {course.price}
                  </div>
                  <Button className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold">
                    Enroll Now
                  </Button>
                </div>

                {/* subtle accent blob */}
                <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-primary/10 blur-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER – same as landing/footer pattern */}
      <footer className="glass border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-4">
                PadhaiDunia
              </div>
              <p className="text-muted-foreground">
                Empowering learners worldwide with AI-powered education
                platform.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Courses</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    AI &amp; Machine Learning
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Web Development
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Data Science
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Mobile Development
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 PadhaiDunia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
