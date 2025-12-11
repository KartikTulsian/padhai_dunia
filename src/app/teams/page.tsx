"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TeamCarousel from "@/components/ui/TeamCarousel";
import AuthNavButtons from "@/components/ui/AuthNavButtons";
import ExploreTeamSection from "@/components/ui/ExploreTeamSection";
import { TeamMember } from "@/components/ui/TeamCard";
import FloatingParticles from "@/components/FloatingParticles";

export default function Teams() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

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
      description: "Leads component architecture and smooth user experiences.",
      linkedinUrl:
        "https://www.linkedin.com/in/tanushree-mandal-aba24b286?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Soumick Samanta",
      role: "Frontend",
      img: "/Team%20Pictures/Soumick.jpeg",
      description: "Leads component architecture and smooth user experiences.",
      linkedinUrl:
        "https://www.linkedin.com/in/soumick-samanta-a9103028b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Suthirtha Dey",
      role: "Frontend",
      img: "/Team%20Pictures/Suthirtha.jpeg",
      description: "Leads component architecture and smooth user experiences.",
      linkedinUrl:
        "https://www.linkedin.com/in/suthirtha-dey-942478273?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Pratik Samanta",
      role: "Full Stack",
      img: "/Team%20Pictures/Pratik.jpeg",
      description: "Focuses on accessibility-first interfaces and design systems.",
      linkedinUrl: "https://www.linkedin.com/in/pratik-samanta-31b5ba28b",
    },
    {
      name: "Debosmita Ghosh",
      role: "Frontend",
      img: "/Team%20Pictures/Debosmita.jpeg",
      description: "Focuses on accessibility-first interfaces and design systems.",
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
      description: "Focuses on accessibility-first interfaces and design systems.",
      linkedinUrl:
        "https://www.linkedin.com/in/indira-chatterjee-48253428b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      name: "Anubrata Guin",
      role: "Backend",
      img: "/Team%20Pictures/Anubrata.jpg",
      description: "Focuses on accessibility-first interfaces and design systems.",
      linkedinUrl: "https://www.linkedin.com/in/anubrata-guin/",
    },
    {
      name: "Agnijit Basu",
      role: "Backend",
      img: "/Team%20Pictures/Agnijit.jpeg",
      description: "Focuses on accessibility-first interfaces and design systems.",
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
    <main className="min-h-screen relative text-foreground overflow-x-hidden">
      {/* Animated background */}
      <FloatingParticles />

      {/* Navbar - same layout as old Teams, new colors */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg shadow-md z-50 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Brand Name */}
          <Link href="/">
            <h1 className="text-2xl font-extrabold text-primary tracking-tight hover:scale-105 hover:opacity-90 transition-transform duration-300 cursor-pointer">
              PadhaiDunia
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/" className="relative group">
              <span className="text-foreground transition-colors duration-300 group-hover:text-primary">
                Home
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/AboutUs" className="relative group">
              <span className="text-foreground transition-colors duration-300 group-hover:text-primary">
                About Us
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/Courses" className="relative group">
              <span className="text-foreground transition-colors duration-300 group-hover:text-primary">
                Courses
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/teams" className="relative group">
              <span className="text-primary transition-colors duration-300">
                Teams
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
            </Link>
            <Link href="/contact" className="relative group">
              <span className="text-foreground transition-colors duration-300 group-hover:text-primary">
                Contact Us
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Auth Buttons (Desktop) */}
          <AuthNavButtons variant="desktop" />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 px-6 pb-4 bg-background/95 backdrop-blur-lg animate-slideDown border-t border-white/10">
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
            <AuthNavButtons
              variant="mobile"
              onNavigate={() => setIsOpen(false)}
            />
          </div>
        )}
      </header>

      {/* Meet Our Team Section - 3D Effects */}
      <section
        className="max-w-5xl mx-auto text-center mb-8 px-4 pt-24 relative z-10 perspective-[1000px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent"
          style={{ transform: "translateZ(50px)" }}
        >
          Meet Our{" "}
          <span className="bg-linear-to-r from-emerald-400 via-primary to-emerald-400 bg-clip-text text-transparent">
            Team
          </span>
        </h1>
        <p
          className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
          style={{ transform: "translateZ(30px)" }}
        >
          The minds shaping the future of education at PadhaiDunia
        </p>
        <div className="absolute -z-10 inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-xl"
            style={{
              transform: "translateZ(-200px)",
              animation: "float 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-emerald-500/10 blur-xl"
            style={{
              transform: "translateZ(-250px)",
              animation: "float 25s ease-in-out infinite reverse",
            }}
          />
        </div>
      </section>

      {/* Carousel Section */}
      <section className="w-full pt-4 pb-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="relative text-center">
            <div className="absolute -inset-6 bg-primary/10 blur-2xl rounded-3xl" />
            <div className="relative rounded-3xl border border-white/15 bg-background/80 backdrop-blur-sm p-4 sm:p-6 shadow-2xl transition-transform duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
              <h2 className="text-3xl font-bold text-center mb-2 bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                Meet Our Team Members
              </h2>
              <div
                className="perspective-distant"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative h-[700px] sm:h-[750px]">
                  {/* 3D Background Elements */}
                  <div
                    className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 blur-xl"
                    style={{
                      transform: "translateZ(-50px)",
                      animation: "float 15s ease-in-out infinite",
                    }}
                  />
                  <div
                    className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-emerald-500/10 blur-xl"
                    style={{
                      transform: "translateZ(-50px)",
                      animation: "float 20s ease-in-out infinite reverse",
                    }}
                  />
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
      <section className="relative z-10 py-16 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Join{" "}
             <span className="bg-linear-to-r from-emerald-300 via-primary to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
  PadhaiDunia
</span>
              ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover what makes exceptional talent thrive in our
              education-first environment
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Console Interface */}
            <div className="relative group">
              <div className="relative bg-linear-to-br from-background via-background to-background backdrop-blur-xl rounded-2xl border border-primary/30 p-6 shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] transition-all duration-700">
                {/* Console Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <span className="text-foreground font-mono text-sm">
                      PadhaiDunia Career Terminal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-xs font-mono">
                      ONLINE
                    </span>
                  </div>
                </div>

                {/* Console Content */}
                <div className="space-y-4 mb-6 font-mono text-sm">
                  {/* Terminal Lines */}
                  <div className="flex items-start gap-2">
                    <span className="text-primary">$</span>
                    <span className="text-emerald-400">why-join-padhaidunia</span>
                  </div>

                  <div className="ml-4 space-y-2">
                    <div className="text-emerald-400">
                      ✓ Analyzing career opportunities...
                    </div>
                    <div className="text-emerald-400">
                      ✓ Scanning company culture...
                    </div>
                    <div className="text-emerald-400">
                      ✓ Evaluating growth potential...
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-primary">$</span>
                    <span className="text-emerald-400">cat benefits.txt</span>
                  </div>

                  <div className="ml-4 space-y-3 text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>
                        <span className="text-primary font-bold">
                          Innovative Environment:
                        </span>{" "}
                        Work on cutting-edge educational technology
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>
                        <span className="text-primary font-bold">
                          Growth Opportunities:
                        </span>{" "}
                        Rapid career advancement in a growing startup
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>
                        <span className="text-primary font-bold">
                          Meaningful Impact:
                        </span>{" "}
                        Directly influence the future of education
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>
                        <span className="text-primary font-bold">
                          Collaborative Culture:
                        </span>{" "}
                        Work with passionate, talented teammates
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-primary">$</span>
                    <span className="text-emerald-400">./join-team.sh</span>
                  </div>

                  <div className="ml-4 text-emerald-400">
                    <div>🚀 Initializing career journey...</div>
                    <div className="animate-pulse">
                      ⏳ Ready to make an impact?
                    </div>
                  </div>
                </div>

                {/* Console Input */}
                <div className="flex items-center gap-2 border-t border-primary/30 pt-4">
                  <span className="text-primary">$</span>
                  <div className="flex-1 relative">
                    <span className="text-emerald-400">
                      join-team --position=your-dream-role
                    </span>
                    <span className="absolute right-0 top-0 h-full w-2 bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Benefits List */}
            <div className="space-y-4">
              {/* Inclusive Culture */}
              <div className="relative group/benefit">
                <div className="bg-linear-to-br from-background/80 via-primary/10 to-background/80 backdrop-blur-xl rounded-2xl border border-primary/30 p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all duration-500 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-r from-primary to-emerald-400 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold text-lg mb-1">
                        Inclusive Culture
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Diverse perspectives driving breakthrough innovations in
                        education technology.
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-foreground group-hover/benefit:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Mission-Driven */}
              <div className="relative group/benefit">
                <div className="bg-linear-to-br from-background/80 via-primary/10 to-background/80 backdrop-blur-xl rounded-2xl border border-primary/30 p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all duration-500 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-r from-primary to-emerald-400 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold text-lg mb-1">
                        Mission-Driven
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Every decision aligned with our commitment to advancing
                        education for global impact.
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-foreground group-hover/benefit:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Professional Growth */}
              <div className="relative group/benefit">
                <div className="bg-linear-to-br from-background/80 via-primary/10 to-background/80 backdrop-blur-xl rounded-2xl border border-primary/30 p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all duration-500 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-r from-primary to-emerald-400 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.083 12.083 0 01.665-6.479L12 14z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold text-lg mb-1">
                        Professional Growth
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Structured career development with mentorship and
                        continuous learning opportunities.
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-foreground group-hover/benefit:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Work-Life Integration */}
              <div className="relative group/benefit">
                <div className="bg-linear-to-br from-background/80 via-primary/10 to-background/80 backdrop-blur-xl rounded-2xl border border-primary/30 p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all duration-500 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-r from-primary to-emerald-400 rounded-full flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold text-lg mb-1">
                        Work-Life Integration
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Flexible arrangements supporting peak performance and
                        personal well-being.
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-foreground group-hover/benefit:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            {/* 3D Glow Container */}
            <div
              className="relative bg-linear-to-br from-background/80 via-primary/10 to-background/80 backdrop-blur-xl rounded-3xl border border-primary/30 p-12 shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300"
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              {/* 3D Glow Elements */}
              {mounted && (
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${20 + Math.random() * 30}px`,
                        height: `${20 + Math.random() * 30}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        backgroundColor:
                          i % 2 === 0
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(56, 189, 248, 0.2)",
                        boxShadow: `0 0 15px rgba(16, 185, 129, 0.5)`,
                        transform: `translateZ(${i * 5}px)`,
                        animation: `float ${5 + i}s ease-in-out infinite ${
                          i * 0.5
                        }s`,
                      }}
                    />
                  ))}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`line-${i}`}
                      className="absolute"
                      style={{
                        width: `${100 + Math.random() * 200}px`,
                        height: "1px",
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        background:
                          "linear-gradient(90deg, rgba(56,189,248,0) 0%, rgba(56,189,248,0.3) 50%, rgba(56,189,248,0) 100%)",
                        transform: `rotate(${
                          Math.random() * 360
                        }deg) translateZ(${10 + i * 8}px)`,
                        boxShadow: `0 0 20px rgba(56,189,248,0.4)`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div
                className="relative z-10 text-center"
                style={{ transform: "translateZ(30px)" }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors duration-500">
                  Ready to Join the{" "}
                 <span className="bg-linear-to-r from-emerald-300 via-primary to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
  Future
</span>
                  ?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Connect with our team to explore opportunities and see if
                  PadhaiDunia is the right fit for your career aspirations.
                </p>

                {/* 3D Glow Button – navigates to /contact */}
                <div
                  className="relative inline-block group/btn"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-primary to-emerald-400 rounded-2xl blur-lg opacity-75 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  <button
                    onClick={() => router.push("/contact")}
                    className="relative bg-linear-to-r from-primary to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-500 hover:scale-105 hover:-translate-y-1 flex items-center gap-3 mx-auto"
                  >
                    <span className="text-lg">CONNECT WITH OUR TEAM</span>
                    <svg
                      className="w-6 h-6 animate-bounce-slow"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Corner Glow Effects */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-primary/20 to-transparent rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-emerald-400/20 to-transparent rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-emerald-400/20 to-transparent rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-primary/20 to-transparent rounded-br-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Background gradient & glow */}
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] h-112 w-md rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 h-48 w-48 rounded-full bg-primary/15 blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-32 w-32 rounded-full bg-emerald-400/20 blur-xl animate-pulse" />

        {mounted &&
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-linear-to-br from-primary/30 to-emerald-400/30 rounded-sm animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
                boxShadow: `0 0 20px rgba(56,189,248,0.3)`,
              }}
            />
          ))}

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/8 via-transparent to-emerald-500/8" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_40%,rgba(255,255,255,0.08),rgba(0,0,0,0))]" />
      </div>
    </main>
  );
}
