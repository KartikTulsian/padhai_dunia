"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TeamCarousel from "@/components/ui/TeamCarousel";
import ExploreTeamSection from "@/components/ui/ExploreTeamSection";
import { TeamMember } from "@/components/ui/TeamCard";
import Image from "next/image";
import FloatingParticles from "@/components/FloatingParticles";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Teams() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const members: TeamMember[] = [
    {
      name: "Aninda Sankar Sukla",
      role: "Co Founder",
      img: "/Team%20Pictures/aninda_sir.png",
      description: "Co Founder",
      linkedinUrl: "#",
    },
    {
      name: "Founder 2",
      role: "Co Founder",
      img: "/Team%20Pictures/aa.png",
      description: "Co Founder",
      linkedinUrl: "#",
    },
    {
      name: "Snehashis Pati",
      role: "Team lead",
      img: "/Team%20Pictures/Snehashis.png",
      description: "Leads component architecture and smooth user experiences.",
      linkedinUrl: "#",
    },

    {
      name: "Tanushree Mandal",
      role: "Frontend",
      img: "/Team%20Pictures/Tanushree.jpeg",
      description:
        "Leads component architecture and smooth user experiences.",
      linkedinUrl:
        "https://www.linkedin.com/in/tanushree-mandal-aba24b286?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Soumick Samanta",
      role: "Frontend",
      img: "/Team%20Pictures/Soumick.jpeg",
      description:
        "Leads component architecture and smooth user experiences.",
      linkedinUrl:
        "https://www.linkedin.com/in/soumick-samanta-a9103028b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Suthirtha Dey",
      role: "Frontend",
      img: "/Team%20Pictures/Suthirtha.jpeg",
      description:
        "Leads component architecture and smooth user experiences.",
      linkedinUrl:
        "https://www.linkedin.com/in/suthirtha-dey-942478273?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Pratik Samanta",
      role: "Full Stack",
      img: "/Team%20Pictures/Pratik.jpeg",
      description:
        "Focuses on accessibility-first interfaces and design systems.",
      linkedinUrl: "https://www.linkedin.com/in/pratik-samanta-31b5ba28b",
    },
    {
      name: "Debosmita Ghosh",
      role: "Frontend",
      img: "/Team%20Pictures/Debosmita.jpeg",
      description:
        "Focuses on accessibility-first interfaces and design systems.",
      linkedinUrl: "",
    },
    {
      name: "Kartik Tulsian",
      role: "Frontend",
      img: "/Team%20Pictures/Kartik.jpeg",
      description:
        "Crafts engaging UI and elevates performance across the web app.",
      linkedinUrl:
        "https://www.linkedin.com/in/kartik-tulsian-682a6128a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Indira Chatterjee",
      role: "Frontend",
      img: "/Team%20Pictures/Indira.jpeg",
      description:
        "Focuses on accessibility-first interfaces and design systems.",
      linkedinUrl:
        "https://www.linkedin.com/in/indira-chatterjee-48253428b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Anubrata Guin",
      role: "Backend",
      img: "/Team%20Pictures/Anubrata.jpg",
      description:
        "Focuses on accessibility-first interfaces and design systems.",
      linkedinUrl: "https://www.linkedin.com/in/anubrata-guin/",
    },
    {
      name: "Agnijit Basu",
      role: "Backend",
      img: "/Team%20Pictures/Agnijit.jpeg",
      description:
        "Focuses on accessibility-first interfaces and design systems.",
      linkedinUrl:
        "https://www.linkedin.com/in/agnijit-basu-725201382?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
  ];

  // Organize members into sections
  const founders = members.filter((member) => member.role === "Co Founder");
  const frontend = members.filter((member) => member.role === "Frontend");
  const backend = members.filter((member) => member.role === "Backend");
  const teamLead = members.filter((member) => member.role === "Team lead");
  const fullStack = members.filter((member) => member.role === "Full Stack");

  const teamSections = [
    {
      title: "Founders",
      members: founders,
      icon: "👑",
    },
    {
      title: "Team Lead",
      members: teamLead,
      icon: "🎯",
    },
    {
      title: "Frontend Team",
      members: frontend,
      icon: "🎨",
    },
    {
      title: "Backend Team",
      members: backend,
      icon: "⚙️",
    },
    {
      title: "Full Stack Team",
      members: fullStack,
      icon: "🚀",
    },
  ].filter((section) => section.members.length > 0);

  return (
    <main className="min-h-screen relative text-gray-800 overflow-x-hidden">
      {/* Landing page animated background */}
      <FloatingParticles />

      {/* NAVBAR (same behavior pattern as other pages) */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Brand */}
          <Link href="/">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-extrabold text-primary tracking-tight cursor-pointer"
            >
              PadhaiDunia
            </motion.h1>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/AboutUs"
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/Courses"
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/teams"
              className="text-primary transition-colors relative group"
            >
              Teams
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary-glow text-primary-foreground">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 px-6 pb-4 bg-background/95 backdrop-blur-lg border-t border-white/10">
            <Link
              href="/"
              className="text-foreground font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/AboutUs"
              className="text-foreground font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/Courses"
              className="text-foreground font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/teams"
              className="text-primary font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Teams
            </Link>
            <Link
              href="/contact"
              className="text-foreground font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>

            {/* Auth Buttons (Mobile) */}
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary"
                >
                  Login
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary-glow text-primary-foreground">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </motion.nav>

      {/* Meet Our Team Section - At the top with 3D Effects */}
      <section
        className="max-w-5xl mx-auto text-center mb-8 px-4 pt-24 relative z-10 perspective-[1000px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x"
          style={{ transform: "translateZ(50px)" }}
        >
          Meet Our{" "}
          <span className="bg-linear-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Team
          </span>
        </h1>
        <p
          className="mt-4 text-xl text-purple-200/80 max-w-3xl mx-auto"
          style={{ transform: "translateZ(30px)" }}
        >
          The minds shaping the future of education at PadhaiDunia
        </p>
        <div className="absolute -z-10 inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-xl"
            style={{
              transform: "translateZ(-200px)",
              animation: "float 20s ease-in-out infinite",
            }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-purple-500/10 blur-xl"
            style={{
              transform: "translateZ(-250px)",
              animation: "float 25s ease-in-out infinite reverse",
            }}
          ></div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="w-full pt-4 pb-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="relative text-center">
            <div className="absolute -inset-6 bg-blue-500/10 blur-2xl rounded-3xl"></div>
            <div className="relative rounded-3xl border border-white/25 bg-white/5 backdrop-blur-sm p-4 sm:p-6 shadow-2xl transition-transform duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <h2 className="text-3xl font-bold text-center mb-2 bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Meet Our Team Members
              </h2>
              <div
                className="perspective-distant"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative h-[700px] sm:h-[750px]">
                  {/* 3D Background Elements */}
                  <div
                    className="absolute top-10 left-10 w-20 h-20 rounded-full bg-blue-500/5 blur-xl"
                    style={{
                      transform: "translateZ(-50px)",
                      animation: "float 15s ease-in-out infinite",
                    }}
                  ></div>
                  <div
                    className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-purple-500/5 blur-xl"
                    style={{
                      transform: "translateZ(-50px)",
                      animation: "float 20s ease-in-out infinite reverse",
                    }}
                  ></div>
                  <div className="flex justify-center items-center h-full w-full">
                    <TeamCarousel members={members} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Team Section */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateZ(0);
          }
          50% {
            transform: translateY(-20px) translateZ(20px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
      <ExploreTeamSection sections={teamSections} />

      {/* Why Join Us Section - Console Design */}
      {/* ... the rest of your sections remain exactly as you wrote ... */}

      {/* Background gradient & glowing effects (unchanged) */}
  <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#0b1521] via-[#0f2234] to-[#0a1a2b]" />
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
  <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-teal-400/25 blur-3xl animate-pulse" />
  <div className="absolute bottom-[-20%] left-[-10%] h-112 w-md rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 h-48 w-48 rounded-full bg-cyan-400/15 blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-32 w-32 rounded-full bg-blue-400/20 blur-xl animate-pulse" />
        {mounted &&
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-linear-to-br from-teal-400/30 to-cyan-400/30 rounded-sm animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
                boxShadow: `0 0 20px rgba(56, 189, 248, 0.3)`,
              }}
            />
          ))}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-teal-500/8 via-transparent to-cyan-500/8" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_40%,rgba(255,255,255,0.08),rgba(0,0,0,0))]" />
      </div>
    </main>
  );
}
