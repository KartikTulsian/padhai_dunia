import React from "react";

export type TeamMember = {
  name: string;
  role: string;
  img?: string;
  description?: string;
  linkedinUrl?: string;
};

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="glass rounded-xl p-4 text-center">
      <div className="mx-auto w-28 h-28 rounded-full overflow-hidden mb-3 bg-muted-foreground/10 flex items-center justify-center">
        {member.img ? (
          // use basic img tag for simplicity; next/image requires layout and src handling
          // The project's other pages commonly use public/ assets so this is fine
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-muted-foreground font-bold">{member.name?.[0]}</div>
        )}
      </div>

      <div className="font-semibold">{member.name}</div>
      <div className="text-sm text-muted-foreground">{member.role}</div>
      {member.description && <div className="mt-2 text-sm">{member.description}</div>}
    </div>
  );
}
