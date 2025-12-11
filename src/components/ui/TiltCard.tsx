"use client";

import { PropsWithChildren, useRef, useState } from "react";

type TiltCardProps = PropsWithChildren<{
  className?: string;
  maxRotate?: number;
}>;

export default function TiltCard({ className, maxRotate = 10, children }: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rx = Math.max(-1, Math.min(1, dy)) * maxRotate;
    const ry = Math.max(-1, Math.min(1, -dx)) * maxRotate;
    setStyle({ transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)` });
  };

  const onLeave = () => {
    setStyle({ transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)` });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 200ms ease", transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </div>
  );
}


