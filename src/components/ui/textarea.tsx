import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export const Textarea = ({ className = "", ...props }: Props) => {
  return <textarea {...props} className={`w-full rounded-md border border-border bg-transparent px-3 py-2 ${className}`} />;
};

export default Textarea;
