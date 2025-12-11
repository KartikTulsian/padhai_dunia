"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatInterface from "./ChatInterface"; 

export default function StudentChatButton({ 
  courseId, 
  teacherId, 
  teacherName 
}: { 
  courseId: string; 
  teacherId: string;
  teacherName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#FAE27C] text-gray-900 px-3 py-1.5 rounded-lg text-sm font-semibold shadow hover:bg-[#fce997] transition-all hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Chat</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 bg-white/90 p-2 rounded-full hover:bg-gray-100 shadow-sm border border-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 overflow-hidden h-full">
               <ChatInterface 
                  defaultCourseId={courseId} 
                  forceTeacherId={teacherId}
                  forceTeacherName={teacherName}
                  hideConversationList={true} 
               />
            </div>
          </div>
        </div>
      )}
    </>
  );
}