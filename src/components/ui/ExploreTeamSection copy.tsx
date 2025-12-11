"use client";

import { useState } from "react";
import TeamCard, { TeamMember } from "./TeamCard";

type TeamSection = {
  title: string;
  members: TeamMember[];
  icon: string;
};

type ExploreTeamSectionProps = {
  sections: TeamSection[];
};

export default function ExploreTeamSection({ sections }: ExploreTeamSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 relative z-10">
      {/* Main Header - Collapsible */}
      <div className="text-center mb-4">
        <button
          onClick={toggleExpanded}
          className="group bg-[#1a1a2e]/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-8 w-full hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)] transition-all duration-500"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">
              Explore Our Teams
            </h2>
            <div className={`transform transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}>
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full"></div>
          <p className="mt-6 text-teal-100/80 text-lg">
            Meet the talented individuals behind PadhaiDunia
          </p>
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <>
          {sections.map((section, index) => (
            <div key={section.title} className="mb-8">
              {/* Section Heading */}
              <div className="flex items-center gap-4 mb-2">
                <div className="text-3xl">{section.icon}</div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{section.title}</h3>
                  <p className="text-purple-300 text-lg">
                    {section.members.length} member{section.members.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
              </div>

              {/* Team Cards Grid */}
              <div className={`grid gap-16 ${
                section.title === "Founders" 
                  ? "grid-cols-1 md:grid-cols-2 justify-center" 
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
              }`}>
                {section.members.map((member, memberIndex) => (
                  <TeamCard
                    key={`${member.name}-${memberIndex}`}
                    member={member}
                    size={section.title === "Founders" ? "large" : "medium"}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
