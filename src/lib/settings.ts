export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin/(.*)": ["admin"],
  "/institute/(.*)": ["institute", "admin"],
  "/teacher/(.*)": ["teacher", "admin"],
  "/student/(.*)": ["student", "admin",],
  "/list/teachers": ["admin", "teacher", "institute"],
  "/list/students": ["admin", "teacher", "institute"],
  "/list/institutes": ["admin"],
  "/list/courses": ["admin", "teacher", "student", "institute"],
  "/list/classes": ["admin", "teacher", "student", "institute"],
  "/list/exams": ["admin", "teacher", "student", "institute"],
  "/list/assignments": ["admin", "teacher", "student", "institute"],
  "/list/results": ["admin", "teacher", "student", "institute"],
  "/list/attendance": ["admin", "teacher", "student", "institute"],
  "/list/events": ["admin", "teacher", "student", "institute"],
  "/list/announcements": ["admin", "teacher", "student", "institute"],
  "/list/lessons": ["admin", "teacher"],
  "/list/messages": ["admin", "teacher", "student", "institute"],
};