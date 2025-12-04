import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        <div className="absolute top-2 left-2 h-12 w-12 rounded-full border-4 border-transparent border-t-purple-500 animate-spin-slow"></div>
      </div>
    </div>
  );
}

