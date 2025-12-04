import React from "react";
import { TeamMember } from "./TeamCard";

type Section = {
  title: string;
  members: TeamMember[];
  icon?: string;
};

export default function ExploreTeamSection({ sections }: { sections: Section[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((s, i) => (
          <div key={i} className="glass rounded-xl p-6">
            <div className="text-2xl mb-2">{s.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
            <div className="text-sm text-muted-foreground">
              {s.members.slice(0, 4).map((m) => m.name).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
