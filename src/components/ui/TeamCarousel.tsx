import React from "react";
import TeamCard, { TeamMember } from "./TeamCard";

export default function TeamCarousel({ members }: { members: TeamMember[] }) {
  return (
    <div className="w-full flex gap-4 overflow-x-auto px-4 py-2">
      {members.map((m, i) => (
        <div key={i} className="min-w-[220px]">
          <TeamCard member={m} />
        </div>
      ))}
    </div>
  );
}
