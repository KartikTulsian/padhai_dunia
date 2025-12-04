import React from "react";

type Props = {
  lines: string[];
  speed?: number;
  className?: string;
};

export default function TypeWriter({ lines, className }: Props) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
