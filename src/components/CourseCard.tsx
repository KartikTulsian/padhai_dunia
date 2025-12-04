import React from "react";

type Props = {
  title: string;
  description: string;
  image?: string;
  rating?: number;
  duration?: string;
  students?: string;
  level?: string;
  index?: number;
};

export default function CourseCard({
  title,
  description,
  image,
  rating,
  duration,
  students,
  level,
}: Props) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="h-40 bg-muted-foreground/10 rounded-md mb-4 flex items-center justify-center">
        {image ? <img src={image} alt={title} className="h-full object-cover w-full rounded-md" /> : <div className="text-muted-foreground">No image</div>}
      </div>

      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="flex items-center justify-between text-sm">
        <div>{duration}</div>
        <div>{students}</div>
        <div>{rating ? `${rating} ★` : null}</div>
      </div>
    </div>
  );
}
