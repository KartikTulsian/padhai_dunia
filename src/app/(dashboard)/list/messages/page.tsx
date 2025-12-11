import ChatInterface from "@/components/ChatInterface";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId) {
    redirect("/sign-in");
  }

  // Students shouldn't access this page - they use the chat button
  // if (role === "student") {
  //   redirect("/list/courses");
  // }

  return (
    <div className="p-4 h-[calc(100vh-120px)] flex flex-col"> 
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <p className="text-sm text-gray-500">
          {role === "admin" 
            ? "Monitor and manage all course conversations" 
            : role === "institute"
            ? "View conversations in your institute's courses"
            : "Chat with students and manage course queries in real-time"}
        </p>
      </div>
      
      {/* The main chat UI container - taking remaining height */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}