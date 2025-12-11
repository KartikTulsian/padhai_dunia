"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Notification = {
  id: string;
  title: string;
  content: string;
  link: string;
  createdAt: string;
};

const Navbar = () => {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string;
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
    // Optional: Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: Notification) => {
    try {
      // Mark as read in DB
      await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ notificationId: notif.id }),
      });

      // Remove from local state immediately
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      setShowDropdown(false);

      // Navigate
      if (notif.link) router.push(notif.link);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <Image src="/search.png" alt="" width={14} height={14} />
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        {/* NOTIFICATION BELL */}
        <div 
            className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'
            onClick={() => setShowDropdown(!showDropdown)}
            ref={dropdownRef}
        >
          <Image src="/announcement.png" alt="" width={20} height={20}/>
          {notifications.length > 0 && (
            <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>
                {notifications.length}
            </div>
          )}

          {/* DROPDOWN MENU */}
          {showDropdown && (
            <div className="absolute top-10 right-0 w-80 bg-white shadow-xl rounded-xl border border-gray-100 z-50 overflow-hidden">
                <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
                    <span className="text-[10px] text-gray-400">{notifications.length} Unread</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-xs">No new notifications</div>
                    ) : (
                        notifications.map((notif) => (
                            <div 
                                key={notif.id} 
                                onClick={(e) => { e.stopPropagation(); handleNotificationClick(notif); }}
                                className="p-3 border-b hover:bg-purple-50 cursor-pointer transition-colors"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-xs font-bold text-gray-800">{notif.title}</h4>
                                    <span className="text-[9px] text-gray-400 whitespace-nowrap ml-2">
                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-600 line-clamp-2">{notif.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
          )}
        </div>
        <div className='flex flex-col text-right'>
          <span className="text-xs leading-3 font-medium">
            {user?.fullName || user?.firstName || "Guest"}
          </span>
          <span className="text-[10px] text-gray-500">
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "No role"}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  )
}

export default Navbar