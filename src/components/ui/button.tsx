import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "default" | "ghost";
  className?: string;
};

export const Button = ({ size = "md", variant = "default", className = "", children, ...props }: ButtonProps) => {
  const sizeClass = size === "lg" ? "px-6 py-3 text-lg" : size === "sm" ? "px-2 py-1 text-sm" : "px-4 py-2";
  const variantClass =
    variant === "outline"
      ? "border border-current bg-transparent"
      : variant === "ghost"
      ? "bg-transparent"
      : "bg-primary text-white";

  return (
    <button {...props} className={`${sizeClass} ${variantClass} rounded-md font-semibold ${className}`}>
      {children}
    </button>
  );
};

export default Button;
