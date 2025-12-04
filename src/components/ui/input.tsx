import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  className?: string;
};

export const Input = ({ label, className = "", ...props }: Props) => {
  return (
    <input {...props} className={`w-full rounded-md border border-border bg-transparent px-3 py-2 ${className}`} />
  );
};

export default Input;
