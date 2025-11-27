// TEMPORARY DATA

export let role = "admin";

export const loggedInUser = {
  id: "S001",
  name: "Ipsita Ghosh",
  className: "CSE-3A",
  enrolledSubjects: ["CS101", "CS102"], // subjectCode list
};

export const teachersData = [
  {
    id: 1,
    teacherId: "1234567890",
    name: "John Doe",
    email: "john@doe.com",
    photo:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Math", "Geometry"],
    classes: ["1B", "2A", "3C"],
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    teacherId: "1234567890",
    name: "Jane Doe",
    email: "jane@doe.com",
    photo:
      "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Physics", "Chemistry"],
    classes: ["5A", "4B", "3C"],
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 3,
    teacherId: "1234567890",
    name: "Mike Geller",
    email: "mike@geller.com",
    photo:
      "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Biology"],
    classes: ["5A", "4B", "3C"],
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 4,
    teacherId: "1234567890",
    name: "Jay French",
    email: "jay@gmail.com",
    photo:
      "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["History"],
    classes: ["5A", "4B", "3C"],
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 5,
    teacherId: "1234567890",
    name: "Jane Smith",
    email: "jane@gmail.com",
    photo:
      "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Music", "History"],
    classes: ["5A", "4B", "3C"],
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 6,
    teacherId: "1234567890",
    name: "Anna Santiago",
    email: "anna@gmail.com",
    photo:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Physics"],
    classes: ["5A", "4B", "3C"],
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 7,
    teacherId: "1234567890",
    name: "Allen Black",
    email: "allen@black.com",
    photo:
      "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["English", "Spanish"],
    classes: ["5A", "4B", "3C"],
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 8,
    teacherId: "1234567890",
    name: "Ophelia Castro",
    email: "ophelia@castro.com",
    photo:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Math", "Geometry"],
    classes: ["5A", "4B", "3C"],
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 9,
    teacherId: "1234567890",
    name: "Derek Briggs",
    email: "derek@briggs.com",
    photo:
      "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Literature", "English"],
    classes: ["5A", "4B", "3C"],
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 10,
    teacherId: "1234567890",
    name: "John Glover",
    email: "john@glover.com",
    photo:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Biology"],
    classes: ["5A", "4B", "3C"],
    address: "123 Main St, Anytown, USA",
  },
];

export const studentsData = [
  {
    id: 1,
    studentId:"S001",
    name: "Cameron Moran",
    email: "cameron.moran@example.com",
    phone: "+1 234 567",
    batch: "6A",
    grade: "6th",
    attendance: 90,
    courses: ["Math", "Science", "English", "History"],
    joinDate: "January 2025",
    address: "123 Oakwood Ave, New York",
    gender: "Male",
    bloodGroup: "A+",
    image: "https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: 2,
    name: "Sofia Patel",
    studentId:"S002",
    email: "sofia.patel@example.com",
    phone: "+91 9001234567",
    batch: "7B",
    grade: "7th",
    attendance: 95,
    courses: ["Physics", "Chemistry", "Mathematics"],
    joinDate: "March 2024",
    address: "Delhi, India",
    gender: "Female",
    bloodGroup: "B+",
    image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];


export const parentsData = [
  {
    id: 1,
    name: "Robert Moran",
    email: "robert.moran@example.com",
    students: ["Cameron Moran"],
    phone: "+1 987 654 3210",
    address: "123 Oakwood Ave, New York",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    students: ["Sofia Patel"],
    phone: "+91 9812345678",
    address: "Delhi, India",
  },
  {
    id: 3,
    name: "Anita Singh",
    email: "anita.singh@example.com",
    students: [],
    phone: "+91 9988776655",
    address: "Mumbai, India",
  },
  {
    id: 4,
    name: "John Miller",
    email: "john.miller@example.com",
    students: [],
    phone: "+1 555 112 3344",
    address: "Los Angeles, USA",
  },
  {
    id: 5,
    name: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    students: [],
    phone: "+91 9090909090",
    address: "Bangalore, India",
  },
];


export const subjectsData = [
  {
    id: 1,
    name: "Physics",
    subjectCode: "PHY101",
    className: "Class 10",
    teachers: ["Dr. Sen", "Ms. Roy"],
    assignments: 5,
    studentsEnrolled: 120,
    modules: [
      {
        title: "Mechanics",
        session: "Q1 2025",
        chapters: ["Motion", "Force", "Work & Energy"],
      },
      {
        title: "Optics",
        session: "Q2 2025",
        chapters: ["Light Reflection", "Refraction"],
      },
    ],
  },
  {
    id:2,
    name:"Database Management System",
    subjectCode:"CS101",
    className:"CSE-3A",
    teachers:["Mr. Sharma"],
    assignments:3,
    studentsEnrolled:40,
    modules:[
      {
        title:"Introduction to DBMS",
        session:"Sep 2025",
        chapters:["Database Concepts","ER Diagrams"],
      },
      {
        title:"Normalization",
        session:"Oct 2025",
        chapters:["1NF","2NF","3NF"],
      },
    ],
  }
];

export const classesData = [
  {
    id: 1,
    name: "1A",
    capacity: 20,
    grade: 1,
    supervisor: "Joseph Padilla",
  },
  {
    id: 2,
    name: "2B",
    capacity: 22,
    grade: 2,
    supervisor: "Blake Joseph",
  },
  {
    id: 3,
    name: "3C",
    capacity: 20,
    grade: 3,
    supervisor: "Tom Bennett",
  },
  {
    id: 4,
    name: "4B",
    capacity: 18,
    grade: 4,
    supervisor: "Aaron Collins",
  },
  {
    id: 5,
    name: "5A",
    capacity: 16,
    grade: 5,
    supervisor: "Iva Frank",
  },
  {
    id: 5,
    name: "5B",
    capacity: 20,
    grade: 5,
    supervisor: "Leila Santos",
  },
  {
    id: 7,
    name: "7A",
    capacity: 18,
    grade: 7,
    supervisor: "Carrie Walton",
  },
  {
    id: 8,
    name: "6B",
    capacity: 22,
    grade: 6,
    supervisor: "Christopher Butler",
  },
  {
    id: 9,
    name: "6C",
    capacity: 18,
    grade: 6,
    supervisor: "Marc Miller",
  },
  {
    id: 10,
    name: "6D",
    capacity: 20,
    grade: 6,
    supervisor: "Ophelia Marsh",
  },
];

export const lessonsData = [
  {
    id: 1,
    teacherId: "T001",
    teacher: "Mr. Sharma",
    courses: ["DBMS", "SQL Fundamentals"],
    currentLesson: "Normalization",
    history: [
      {
        id: 1,
        date: "2025-09-05",
        class: "CSE-3A",
        topic: "Introduction to DBMS",
        progress: "Completed",
      },
      {
        id: 2,
        date: "2025-09-12",
        class: "CSE-3A",
        topic: "Normalization",
        progress: "Completed",
      },
      {
        id: 3,
        date: "2025-09-19",
        class: "CSE-3A",
        topic: "ER Diagrams",
        progress: "In Progress",
      },
    ],
  },
  {
    id: 2,
    teacherId: "T002",
    teacher: "Ms. Roy",
    courses: ["Operating Systems"],
    currentLesson: "Process Scheduling",
    history: [
      {
        id: 1,
        date: "2025-09-03",
        class: "CSE-3B",
        topic: "OS Basics",
        progress: "Completed",
      },
      {
        id: 2,
        date: "2025-09-10",
        class: "CSE-3B",
        topic: "System Calls",
        progress: "Completed",
      },
      {
        id: 3,
        date: "2025-09-25",
        class: "CSE-3B",
        topic: "Process Scheduling",
        progress: "In Progress",
      },
    ],
  },
];


export const examsData = [
  {
    id: 1,
    subject: "Math",
    class: "1A",
    teacher: "Martha Morris",
    date: "2025-01-01",
  },
  {
    id: 2,
    subject: "English",
    class: "2A",
    teacher: "Randall Garcia",
    date: "2025-01-01",
  },
  {
    id: 3,
    subject: "Science",
    class: "3A",
    teacher: "Myrtie Scott",
    date: "2025-01-01",
  },
  {
    id: 4,
    subject: "Social Studies",
    class: "1B",
    teacher: "Alvin Swanson",
    date: "2025-01-01",
  },
  {
    id: 5,
    subject: "Art",
    class: "4A",
    teacher: "Mabelle Wallace",
    date: "2025-01-01",
  },
  {
    id: 6,
    subject: "Music",
    class: "5A",
    teacher: "Dale Thompson",
    date: "2025-01-01",
  },
  {
    id: 7,
    subject: "History",
    class: "6A",
    teacher: "Allie Conner",
    date: "2025-01-01",
  },
  {
    id: 8,
    subject: "Geography",
    class: "6B",
    teacher: "Hunter Fuller",
    date: "2025-01-01",
  },
  {
    id: 9,
    subject: "Physics",
    class: "7A",
    teacher: "Lois Lindsey",
    date: "2025-01-01",
  },
  {
    id: 10,
    subject: "Chemistry",
    class: "8A",
    teacher: "Vera Soto",
    date: "2025-01-01",
  },
];

export const assignmentsData = [
  {
    id: 1,
    subject: "Mathematics",
    subjectCode: "MATH101",
    class: "10-A",
    teacher: "Mr. Sharma",
    startDate: "2025-10-01",
    dueDate: "2025-10-10",
    submitted: 12,
    totalStudents: 20,
  },
  {
    id: 2,
    subject: "Science",
    subjectCode: "SCI101",
    class: "10-B",
    teacher: "Ms. Gupta",
    startDate: "2025-10-05",
    dueDate: "2025-10-12",
    submitted: 0,
    totalStudents: 42,
  },
  {
    id: 3,
    subject: "History",
    subjectCode: "HIST104",
    class: "9-A",
    teacher: "Mr. Verma",
    startDate: "2025-10-07",
    dueDate: "2025-10-15",
    submitted: 0,
    totalStudents: 40,
  },
  {
    id: 4,
    subject: "English",
    subjectCode: "ENG201",
    class: "9-B",
    teacher: "Ms. Roy",
    startDate: "2025-10-11",
    dueDate: "2025-10-18",
    submitted: 5,
    totalStudents: 20,
  },
  {
    id: 5,
    subject: "Geography",
    subjectCode: "GEO301",
    class: "8-A",
    teacher: "Mr. Das",
    startDate: "2025-10-03",
    dueDate: "2025-10-09",
    submitted: 10,
    totalStudents: 15,
  },
  {
    id: 6,
    subject: "Computer Science",
    subjectCode: "CS101",
    class: "10-C",
    teacher: "Ms. Iyer",
    startDate: "2025-10-08",
    dueDate: "2025-10-16",
    submitted: 0,
    totalStudents: 20,
  },
];


export const resultsData = [
  {
    id: 1,
    subjectCode: "CS101",
    subject: "Database Management Systems",
    class: "CSE-3A",
    teacher: "Mr. Sharma",
    examDate: "2025-09-20",
    resultDate: "2025-09-25",
    students: [
      { id: 1, studentId: "S001", studentName: "Riya Sen", score: 88 },
      { id: 2, studentId: "S002", studentName: "Amit Das", score: 92 },
      { id: 3, studentId: "S003", studentName: "Ipsita Ghosh", score: 85 },
    ],
  },
  {
    id: 2,
    subjectCode: "CS202",
    subject: "Operating Systems",
    class: "CSE-3B",
    teacher: "Ms. Roy",
    examDate: "2025-09-18",
    resultDate: "2025-09-23",
    students: [
      { id: 1, studentId: "S004", studentName: "Priya Paul", score: 76 },
      { id: 2, studentId: "S005", studentName: "Rohan Das", score: 81 },
      { id: 3, studentId: "S003", studentName: "Ipsita Ghosh", score: 79 },
    ],
  },
];



export const eventsData = [
  {
    id: 1,
    title: "Lake Trip",
    class: "1A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 2,
    title: "Picnic",
    class: "2A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 3,
    title: "Beach Trip",
    class: "3A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 4,
    title: "Museum Trip",
    class: "4A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 5,
    title: "Music Concert",
    class: "5A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 6,
    title: "Magician Show",
    class: "1B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 7,
    title: "Lake Trip",
    class: "2B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 8,
    title: "Cycling Race",
    class: "3B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 9,
    title: "Art Exhibition",
    class: "4B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 10,
    title: "Sports Tournament",
    class: "5B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
];

export const announcementsData = [
  {
    id: 1,
    title: "About 4A Math Test",
    class: "4A",
    date: "2025-01-01",
  },
  {
    id: 2,
    title: "About 3A Math Test",
    class: "3A",
    date: "2025-01-01",
  },
  {
    id: 3,
    title: "About 3B Math Test",
    class: "3B",
    date: "2025-01-01",
  },
  {
    id: 4,
    title: "About 6A Math Test",
    class: "6A",
    date: "2025-01-01",
  },
  {
    id: 5,
    title: "About 8C Math Test",
    class: "8C",
    date: "2025-01-01",
  },
  {
    id: 6,
    title: "About 2A Math Test",
    class: "2A",
    date: "2025-01-01",
  },
  {
    id: 7,
    title: "About 4C Math Test",
    class: "4C",
    date: "2025-01-01",
  },
  {
    id: 8,
    title: "About 4B Math Test",
    class: "4B",
    date: "2025-01-01",
  },
  {
    id: 9,
    title: "About 3C Math Test",
    class: "3C",
    date: "2025-01-01",
  },
  {
    id: 10,
    title: "About 1C Math Test",
    class: "1C",
    date: "2025-01-01",
  },
];



export const calendarEvents = [
  {
    title: "Math",
    allDay: false,
    start: new Date(2024, 7, 12, 8, 0),
    end: new Date(2024, 7, 12, 8, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2024, 7, 12, 9, 0),
    end: new Date(2024, 7, 12, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2024, 7, 12, 10, 0),
    end: new Date(2024, 7, 12, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2024, 7, 12, 11, 0),
    end: new Date(2024, 7, 12, 11, 45),
  },
  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2024, 7, 12, 13, 0),
    end: new Date(2024, 7, 12, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 12, 14, 0),
    end: new Date(2024, 7, 12, 14, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2024, 7, 13, 9, 0),
    end: new Date(2024, 7, 13, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2024, 7, 13, 10, 0),
    end: new Date(2024, 7, 13, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2024, 7, 13, 11, 0),
    end: new Date(2024, 7, 13, 11, 45),
  },

  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 13, 14, 0),
    end: new Date(2024, 7, 13, 14, 45),
  },
  {
    title: "Math",
    allDay: false,
    start: new Date(2024, 7, 14, 8, 0),
    end: new Date(2024, 7, 14, 8, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2024, 7, 14, 10, 0),
    end: new Date(2024, 7, 14, 10, 45),
  },

  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2024, 7, 14, 13, 0),
    end: new Date(2024, 7, 14, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 14, 14, 0),
    end: new Date(2024, 7, 13, 14, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2024, 7, 15, 9, 0),
    end: new Date(2024, 7, 15, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2024, 7, 15, 10, 0),
    end: new Date(2024, 7, 15, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2024, 7, 15, 11, 0),
    end: new Date(2024, 7, 15, 11, 45),
  },

  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 15, 14, 0),
    end: new Date(2024, 7, 15, 14, 45),
  },
  {
    title: "Math",
    allDay: false,
    start: new Date(2024, 7, 16, 8, 0),
    end: new Date(2024, 7, 16, 8, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2024, 7, 16, 9, 0),
    end: new Date(2024, 7, 16, 9, 45),
  },

  {
    title: "Physics",
    allDay: false,
    start: new Date(2024, 7, 16, 11, 0),
    end: new Date(2024, 7, 16, 11, 45),
  },
  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2024, 7, 16, 13, 0),
    end: new Date(2024, 7, 16, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2024, 7, 16, 14, 0),
    end: new Date(2024, 7, 16, 14, 45),
  },
];

export type Student = {
  id: number;
  name: string;
  university: string;
  dateOfAdmit: string;
  status: "pending" | "checked in" | "cancelled";
  fees: number;
};
export const students: Student[] = [
  {
    id: 1,
    name: "Alice Johnson",
    university: "Harvard University",
    dateOfAdmit: "2025-09-01",
    status: "pending",
    fees: 1200,
  },
  {
    id: 2,
    name: "Rahul Verma",
    university: "IIT Delhi",
    dateOfAdmit: "2025-09-10",
    status: "checked in",
    fees: 1500,
  },
  {
    id: 3,
    name: "Sophia Lee",
    university: "Oxford University",
    dateOfAdmit: "2025-09-15",
    status: "cancelled",
    fees: 1000,
  },
];

export type Institute = {
  id: string;
  name: string;
  type: "School" | "College" | "Coaching";
  location: string;
  status: "Active" | "Pending" | "Premium";
  contact: string;
  courses?: { name: string; fee: string; duration: string }[];
  description?: string;
};

export const institutes: Institute[] = [
  {
    id: "1",
    name: "ABC International School",
    type: "School",
    location: "Delhi",
    status: "Active",
    contact: "abc@school.com",
  },
  {
    id: "2",
    name: "XYZ Engineering College",
    type: "College",
    location: "Mumbai",
    status: "Pending",
    contact: "xyz@college.com",
  },
  {
    id: "3",
    name: "Focus Coaching Center",
    type: "Coaching",
    location: "Kolkata",
    status: "Premium",
    contact: "focus@coaching.com",
  },
];

export const universityRegistrationData = [
  { month: "Jan", Schools: 15, Colleges: 10, Coaching: 5 },
  { month: "Feb", Schools: 20, Colleges: 12, Coaching: 8 },
  { month: "Mar", Schools: 25, Colleges: 15, Coaching: 10 },
  { month: "Apr", Schools: 30, Colleges: 20, Coaching: 12 },
  { month: "May", Schools: 35, Colleges: 25, Coaching: 15 },
];


export const attendanceData = [
  {
    id: 1,
    student: "Ipsita Ghosh",
    subject: "DBMS",
    class: "CSE-3A",
    date: "2025-09-10",
    topic: "ER Diagrams",
    status: "Present",
  },
  {
    id: 2,
    student: "Ipsita Ghosh",
    subject: "DBMS",
    class: "CSE-3A",
    date: "2025-09-12",
    topic: "Normalization",
    status: "Absent",
  },
  {
    id: 3,
    student: "Ipsita Ghosh",
    subject: "Operating Systems",
    class: "CSE-3A",
    date: "2025-09-15",
    topic: "Process Scheduling",
    status: "Present",
  },
  {
    id: 4,
    student: "Ipsita Ghosh",
    subject: "Operating Systems",
    class: "CSE-3A",
    date: "2025-09-20",
    topic: "Memory Management",
    status: "Present",
  },
];
