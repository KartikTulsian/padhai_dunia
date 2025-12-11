import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import AppLink from "./AppLink";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "",
        visible: ["admin", "teacher", "student", "institute"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers Info",
        href: "/list/teachersInfo",
        visible: ["admin", "institute"],
      },
      {
        icon: "/student.png",
        label: "Students Info",
        href: "/list/studentsInfo",
        visible: ["admin", "teacher", "institute"],
      },
      {
        icon: "/institutes.png",
        label: "Institute hub",
        href: "/list/institutes",
        visible: ["admin"],
      },
      {
        icon: "/subject.png",
        label: "Courses",
        href: "/list/courses",
        visible: ["admin", "teacher", "student", "institute"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher", "student", "institute"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "institute"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "institute"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "institute"],
      },
      // {
      //   icon: "/attendance.png",
      //   label: "Attendance",
      //   href: "/list/attendance",
      //   visible: ["admin", "teacher", "institute"],
      // },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "institute"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "institute"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "institute"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return (
    <div className="mt-1 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>

          {section.items.map((item) => {
            if (!role || !item.visible.includes(role)) return null;

            // Dynamically route to role dashboard
            const targetHref =
              item.label === "Home"
                ? `/${role}`  // <-- this correctly navigates to dashboard route
                : item.href;

            return (
              <AppLink
                href={targetHref}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#EDF9FD]"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </AppLink>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
