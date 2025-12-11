"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Search, MoreVertical, Paperclip, Phone, Video, MessageSquare, ArrowLeft, CheckCircle, Eye, CheckCheck } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";

type UserBasic = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role?: string
};

type Conversation = {
  conversationId: string;
  otherUser: UserBasic;
  // Participants array for the "A & B Conversation" title
  participants?: { id: string; name: string; role: string }[];
  subjectId?: string;
  course: { id: string; title: string; code: string } | null;
  lastMessage: { content: string; sentAt: string; isRead: boolean; senderId: string };
  unreadCount: number;
};

type Message = {
  id: string;
  content: string;
  sentAt: string;
  senderId: string;
  isRead?: boolean;
  sender: UserBasic;
};

export default function ChatInterface({
  defaultCourseId,
  forceTeacherId,
  forceTeacherName,
  hideConversationList = false
}: {
  defaultCourseId?: string;
  forceTeacherId?: string;
  forceTeacherName?: string;
  hideConversationList?: boolean;
}) {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isStudent = user?.publicMetadata?.role === 'student';

  // --- UI HELPERS ---

  const getHeaderTitle = (chat: Conversation) => {
    if (isStudent && chat.course) {
      return `${chat.course.title} Group`;
    }
    // Admin View: If participants exist, show "Student & Teacher"
    if (chat.participants && chat.participants.length >= 2) {
      // Filter out myself if I am part of it
      const others = chat.participants.filter(p => p.id !== user?.id);

      // If I am Admin/Institute (not in chat), show 2 people
      if (others.length >= 2) {
        // Find Student and Teacher names specifically if possible, else take first two
        const sName = others.find(p => p.role === 'student')?.name || others[0].name;
        const tName = others.find(p => p.role === 'teacher')?.name || others[1].name;
        return `${sName} & ${tName} Conversation`;
      }
    }
    // Fallback
    return `${chat.otherUser.firstName} ${chat.otherUser.lastName}`;
  };

  const getSenderLabel = (sender: UserBasic) => {
    if (sender.role === 'admin') return "Admin";
    if (sender.role === 'institute') return "Institute Admin";
    if (sender.role === 'teacher') return `${sender.firstName} (Teacher)`;
    return `${sender.firstName} (Student ID: ${sender.id.slice(0, 6)}...)`;
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-50 border border-red-100';
      case 'institute': return 'text-purple-600 bg-purple-50 border border-purple-100';
      case 'teacher': return 'text-blue-600 bg-blue-50 border border-blue-100';
      default: return 'text-orange-600 bg-orange-50 border border-orange-100';
    }
  };

  // 1. Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        let url = `/api/chat/conversations`;
        const params = new URLSearchParams();
        if (defaultCourseId) params.append("courseId", defaultCourseId);
        if (forceTeacherId) params.append("otherUserId", forceTeacherId);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
          setConversations(data);

          if (hideConversationList && forceTeacherId) {
            if (data.length > 0) {
              setSelectedChat(data[0]);
            } else {
              setSelectedChat({
                conversationId: "new",
                otherUser: {
                  id: forceTeacherId,
                  firstName: forceTeacherName || "Teacher",
                  lastName: "",
                  avatar: null,
                  role: "teacher"
                },
                participants: [], // Will be empty for new chat
                course: { id: defaultCourseId || "", title: "Course", code: "" },
                lastMessage: { content: "Start conversation", sentAt: new Date().toISOString(), isRead: true, senderId: "" },
                unreadCount: 0
              });
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, [defaultCourseId, forceTeacherId, forceTeacherName, hideConversationList]);

  // 2. Fetch Messages
  useEffect(() => {
    if (!selectedChat) return;
    if (selectedChat.conversationId === "new") {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        // If I am student, anchor is Me. If I am Admin, anchor is selectedChat.subjectId (the student)
        // If subjectId is missing (older chats), fallback to otherUser.id if they are student.
        const targetId = isStudent ? user?.id : (selectedChat.subjectId || selectedChat.otherUser.id);

        const res = await fetch(
          `/api/chat/messages?courseId=${selectedChat.course?.id || ""}&otherUserId=${targetId}`
        );
        const data = await res.json();
        setMessages(data);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedChat, isStudent, user]);

  const handleMarkAsSeen = async () => {
    if (!selectedChat || !user) return;

    // Optimistic Update: Update local UI immediately
    setMessages(prev => prev.map(msg => 
        (msg.senderId !== user.id) ? { ...msg, isRead: true } : msg
    ));

    try {
        await fetch("/api/chat/seen", {
            method: "POST",
            body: JSON.stringify({
                senderId: selectedChat.otherUser.id,
                courseId: selectedChat.course?.id
            })
        });
    } catch (error) {
        console.error("Failed to mark as seen", error);
    }
  };

  // Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedChat || !user) return;

    const role = (user.publicMetadata.role as string) || "student";

    const tempMsg: Message = {
      id: Math.random().toString(),
      content: inputText,
      sentAt: new Date().toISOString(),
      senderId: user.id,
      sender: {
        id: user.id,
        firstName: user.firstName || "Me",
        lastName: user.lastName || "",
        avatar: user.imageUrl,
        role: role
      }
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText("");

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: tempMsg.content,
          receiverId: selectedChat.otherUser.id,
          courseId: defaultCourseId || selectedChat.course?.id
        })
      });
      if (!res.ok) throw new Error("Failed");
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  return (
    <div className="flex h-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">

      {/* SIDEBAR */}
      {!hideConversationList && (
        <div className={`w-full md:w-1/3 lg:w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-800">Messages</h2>
            <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
          <div className="p-3">
            <input type="text" placeholder="Search..." className="w-full pl-4 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#FAE27C]" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.map((chat) => (
              <div
                key={chat.conversationId}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white transition-colors border-b border-gray-100 ${selectedChat?.conversationId === chat.conversationId ? "bg-white border-l-4 border-l-[#FAE27C]" : ""}`}
              >
                <div className="relative shrink-0">
                  <Image src={chat.otherUser.avatar || "/avatar.png"} alt="Avatar" width={48} height={48} className="rounded-full object-cover w-12 h-12 border border-gray-200" />
                  {chat.unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 min-w-5 px-1 flex items-center justify-center rounded-full border-2 border-white">{chat.unreadCount}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    {/* Use getHeaderTitle for sidebar consistency too */}
                    <h3 className="font-semibold text-gray-900 truncate text-sm">
                      {getHeaderTitle(chat)}
                    </h3>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{format(new Date(chat.lastMessage.sentAt), "HH:mm")}</span>
                  </div>
                  {chat.course ? (
                    // Existing: Show Course Code
                    <p className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block font-medium mb-1">
                      {chat.course.code}
                    </p>
                  ) : (
                    // NEW: Show Role and Short ID for personal chats
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${getRoleColor(chat.otherUser.role)}`}>
                        {chat.otherUser.role === 'institute' ? 'Institute' : chat.otherUser.role || 'User'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        #{chat.otherUser.id.slice(0, 5)}
                      </span>
                    </div>
                  )}
                  <p className="text-xs truncate text-gray-500">{chat.lastMessage.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHAT AREA */}
      <div className={`flex-1 flex flex-col bg-[#F1F0FF] ${!selectedChat && !hideConversationList ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-3 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                {!hideConversationList && <ArrowLeft className="w-5 h-5 md:hidden cursor-pointer" onClick={() => setSelectedChat(null)} />}
                <Image src={selectedChat.otherUser.avatar || "/avatar.png"} alt="Avatar" width={40} height={40} className="rounded-full w-10 h-10 object-cover border border-gray-100" />
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {getHeaderTitle(selectedChat)}
                  </h3>
                  {selectedChat.course ? (
                    // Existing: Show Course Title
                    <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      {selectedChat.course.title}
                    </p>
                  ) : (
                    // NEW: Show Role and Full ID for personal chats
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${getRoleColor(selectedChat.otherUser.role)}`}>
                        {selectedChat.otherUser.role === 'institute' ? 'Institute Admin' : selectedChat.otherUser.role || 'User'}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        ID: {selectedChat.otherUser.id}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 text-gray-500">
                <Search className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center mt-10"><span className="loader text-gray-400">Loading...</span></div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderId === user?.id;

                  const isLastReceived = !isMe && messages.slice(idx + 1).every(m => m.senderId === user?.id);

                  return (
                    <div key={msg.id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>

                      {/* Name Label Above Message */}
                      <span className={`text-[10px] font-bold mb-0.5 px-1.5 ${getRoleColor(msg.sender.role)}`}>
                        {getSenderLabel(msg.sender)}
                      </span>

                      <div className={`max-w-[75%] rounded-lg p-2 shadow-sm text-sm relative ${isMe ? "bg-[#d1fae5] text-gray-900 rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"
                        }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                            <span className={`text-[9px] ${isMe ? "text-green-800" : "text-gray-400"}`}>
                            {msg.sentAt ? format(new Date(msg.sentAt), "HH:mm") : "..."}
                            </span>
                        </div>
                      </div>
                      {/* 1. Show "Seen" Text if message is read (For both Sender and Receiver) */}
                      {isMe && msg.isRead && (
                         <div className="flex items-center gap-0.5 mt-0.5 mr-1">
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                            <span className="text-[9px] text-blue-500 font-medium">Seen</span>
                         </div>
                      )}

                      {/* 2. Show "Mark as Seen" Button ONLY for Receiver on the LAST received message */}
                      {isLastReceived && !msg.isRead && (
                        <button 
                            onClick={handleMarkAsSeen}
                            className="mt-1 flex items-center gap-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-semibold px-3 py-1 rounded-full transition-all shadow-sm"
                        >
                            <Eye className="w-3 h-3" /> Mark Seen
                        </button>
                      )}
                    </div>
                    
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              {/* <Paperclip className="w-6 h-6 text-gray-500 cursor-pointer" /> */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-white border-none outline-none rounded-lg px-4 py-2 text-sm focus:ring-0 text-gray-800"
              />
              <button onClick={handleSendMessage} className="bg-[#FAE27C] p-2 rounded-full hover:bg-[#fce997] shadow-sm">
                <Send className="w-4 h-4 text-gray-800" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="w-12 h-12 mb-3 text-gray-200" />
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}