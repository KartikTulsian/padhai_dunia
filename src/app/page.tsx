"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
// lightweight in-file replacements used to avoid extra runtime deps
import {
  Brain,
  TrendingUp,
  Users,
  Gamepad2,
  ArrowRight,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import TypeWriter from "@/components/TypeWriter";
import FloatingParticles from "@/components/FloatingParticles";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import AppLink from "@/components/AppLink";
import Image from "next/image";

// small animated number used instead of react-countup (avoids extra dep)
function AnimatedNumber({
  end,
  suffix = "",
  duration = 1200,
  animate = false,
  format,
}: any) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let start: number | null = null;
    const from = 0;
    const to = end;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = from + (to - from) * progress;
      setValue(current);
      if (progress < 1) requestAnimationFrame(step);
    }

    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animate, end, duration]);

  const display = format ? format(value) : `${Math.round(value)}${suffix}`;
  return <>{display}</>;
}

const Page = () => {
  // ---------- AUTH + ROLE REDIRECT (FROM YOUR page.tsx) ----------
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const role = user.publicMetadata.role as string;
      if (role) {
        router.push(`/${role}`);
      }
    }
  }, [user, router]);

  // ---------- LANDING PAGE LOGIC (FROM index.tsx) ----------
  const statsRef = useRef<HTMLElement | null>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [statsRef]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Personalized learning paths powered by advanced AI algorithms that adapt to your learning style and pace.",
    },
    {
      icon: TrendingUp,
      title: "Personalized Progress Tracking",
      description:
        "Advanced analytics to track your learning journey with detailed insights and performance metrics.",
    },
    {
      icon: Users,
      title: "Community & Collaboration",
      description:
        "Connect with fellow learners, join study groups, and collaborate on projects with peers worldwide.",
    },
    {
      icon: Gamepad2,
      title: "Gamified Learning Experience",
      description:
        "Earn badges, complete challenges, and level up your skills with our engaging gamification system.",
    },
  ];

  const courses = [
    {
      title: "AI & Machine Learning Mastery",
      description:
        "Learn AI fundamentals, machine learning algorithms, and neural networks with hands-on projects.",
      image: "aiml.jpeg",
      rating: 4.9,
      duration: "12 weeks",
      students: "2.5k+",
      level: "Intermediate" as const,
    },
    {
      title: "Full Stack Web Development",
      description:
        "Master modern web development with React, Node.js, and database integration from scratch.",
      image: "webdev.jpeg",
      rating: 4.8,
      duration: "16 weeks",
      students: "3.2k+",
      level: "Beginner" as const,
    },
    {
      title: "Data Science & Analytics",
      description:
        "Dive into data analysis, visualization, and statistical modeling with Python and R.",
      image: "datascience.jpeg",
      rating: 4.9,
      duration: "10 weeks",
      students: "1.8k+",
      level: "Intermediate" as const,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content:
        "PadhaiDunia transformed my career! The AI-powered learning paths helped me transition from marketing to tech in just 6 months.",
      avatar: "SJ",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      content:
        "The personalized approach and hands-on projects made learning complex concepts enjoyable. Highly recommend!",
      avatar: "MC",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Product Manager",
      content:
        "Amazing platform! The community support and gamification kept me engaged throughout my learning journey.",
      avatar: "PS",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="min-h-screen relative">
      <FloatingParticles />

      {/* ---------------- NAVIGATION ---------------- */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-primary flex items-center gap-2"
          >
            <Image src="/logo_single.png" alt="PadhaiDunia Logo" width={50} height={50} />
            PadhaiDunia
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <AppLink
              href="#"
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
              href="/courses"
              className="text-foreground hover:text-primary transition-colors"
            >
              Courses
            </AppLink>
            { <AppLink
              href="/teams"
              className="text-foreground hover:text-primary transition-colors"
            >
              Team
            </AppLink> }
            <AppLink href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact Us
            </AppLink>
          </div>

          {/* 🔐 AUTH BUTTONS – includes your REQUIRED Join Now code */}
          <div className="flex items-center gap-4">
            {/* Simple login link */}
            <AppLink
              href="/sign-in"
              className="text-foreground hover:text-primary transition-colors"
            >
              Login
            </AppLink>

            {/* ✅ REQUIRED SNIPPET 1: JOIN NOW -> /sign-up */}
            <AppLink
              href="/sign-up"
              className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all"
            >
              Join Now
            </AppLink>
          </div>
        </div>
      </motion.nav>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Image src="/logo_main.png" alt="PadhaiDunia Hero" width={300} height={100} />
              <TypeWriter
                lines={[
                  "Learn Smarter, Grow Faster",
                  "Explore interactive courses,",
                  "Track your progress,",
                  "Unlock your full potential with PadhaiDunia.",
                ]}
                speed={50}
                className="text-2xl lg:text-4xl font-bold text-foreground leading-tight"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-xl text-muted-foreground max-w-lg"
            >
              Transform your learning experience with AI-powered education that
              adapts to your unique style and pace.
            </motion.p>

            {/* ✅ REQUIRED SNIPPET 2: SIGN-IN BUTTON (wrapped in your flex div) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/sign-in")}
                className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-full shadow-2xl text-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                Start Learning
                <ArrowRight className="ml-1 h-5 w-5" />
              </motion.button>

              {/* Secondary CTA – Explore courses (unchanged) */}
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold"
              >
                Explore Courses
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="landingimage.png"
                alt="AI-powered learning illustration"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent rounded-2xl" />
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ---------------- WHY CHOOSE SECTION ---------------- */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Why Choose PadhaiDunia?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of education with our cutting-edge platform
              designed to maximize your learning potential.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-xl p-8 text-center hover-glow group cursor-pointer"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- COURSES SECTION ---------------- */}
      <section id="courses" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our most popular courses designed by industry experts and
              powered by AI for optimal learning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4"
            >
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ---------------- STATS SECTION ---------------- */}
      <section
        ref={statsRef}
        className="py-20 bg-linear-to-r from-primary/10 to-accent/10"
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-5xl lg:text-6xl font-bold text-primary mb-2">
                {statsInView && (
                  <AnimatedNumber end={50} suffix="+" animate={statsInView} />
                )}
              </div>
              <div className="text-xl text-foreground font-semibold">
                Courses
              </div>
              <div className="text-muted-foreground">
                Expert-designed curriculum
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-5xl lg:text-6xl font-bold text-primary mb-2">
                {statsInView && (
                  <AnimatedNumber end={10000} suffix="+" animate={statsInView} format={(v: number) => `${Math.round(v / 1000)}k`} />
                )}
              </div>
              <div className="text-xl text-foreground font-semibold">
                Students
              </div>
              <div className="text-muted-foreground">Learning community</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-5xl lg:text-6xl font-bold text-primary mb-2">
                {statsInView && (
                  <AnimatedNumber end={95} suffix="%" animate={statsInView} />
                )}
              </div>
              <div className="text-xl text-foreground font-semibold">
                Satisfaction
              </div>
              <div className="text-muted-foreground">Student success rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS SECTION ---------------- */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of successful learners who have transformed their
              careers with PadhaiDunia.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <Quote className="w-12 h-12 text-primary mx-auto mb-6" />

              <p className="text-xl text-foreground mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                {Array.from({
                  length: testimonials[currentTestimonial].rating,
                }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </motion.div>

            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentTestimonial
                    ? "bg-primary"
                    : "bg-primary/30"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
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
    </div>
  );
};

export default Page;
