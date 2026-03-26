export const mockUsers = [
  {
    id: "super-001",
    name: "Neha Kapoor",
    username: "superadmin@sms.com",
    email: "superadmin@sms.com",
    password: "super123",
    role: "super_admin",
    accessPermissions: ["overview", "sis", "attendance", "exams", "fees", "homework", "communication", "leave", "settings"],
    responsibilities: "Platform oversight and school review",
    phone: "+91 99887 66554",
    campus: "EduCore HQ",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "admin-001",
    name: "Aarav Mehta",
    username: "admin@sms.com",
    email: "admin@sms.com",
    password: "admin123",
    role: "school_admin",
    accessPermissions: ["overview", "sis", "attendance", "exams", "fees", "homework", "communication", "leave", "settings"],
    responsibilities: "Principal access with full school administration control",
    phone: "+91 98765 43210",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "principal-001",
    name: "Meera Joshi",
    username: "principal@sms.com",
    email: "principal@sms.com",
    password: "principal123",
    role: "principal",
    linkedStaffId: "staff-005",
    accessPermissions: ["overview", "sis", "staff", "attendance", "timetable", "exams", "fees", "communication", "reports", "leave", "support", "settings"],
    responsibilities: "Academic and management authority with report, leave, and performance oversight",
    phone: "+91 98100 12001",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "vice-001",
    name: "Rohan Kulkarni",
    username: "vice@sms.com",
    email: "vice@sms.com",
    password: "vice123",
    role: "vice_principal",
    accessPermissions: ["overview", "sis", "attendance", "exams", "fees", "homework", "communication", "leave", "settings"],
    responsibilities: "Approves student leave and manages academic operations",
    phone: "+91 98220 44556",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "coord-001",
    name: "Sneha Rao",
    username: "coordinator@sms.com",
    email: "coordinator@sms.com",
    password: "coordinator123",
    role: "academic_coordinator",
    linkedStaffId: "staff-006",
    accessPermissions: ["overview", "staff", "attendance", "timetable", "exams", "content", "reports", "support", "settings"],
    responsibilities: "Handles timetable, syllabus monitoring, teacher assignment, and academic tracking",
    phone: "+91 98200 12002",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "teacher-001",
    name: "Priya Sharma",
    username: "teacher@sms.com",
    email: "teacher@sms.com",
    password: "teacher123",
    role: "teacher",
    accessPermissions: ["overview", "sis", "attendance", "exams", "fees", "homework", "communication", "leave", "settings"],
    responsibilities: "Class teacher for Grade 3 - B with homework and result visibility",
    phone: "+91 98765 11111",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "classteacher-001",
    name: "Priya Sharma",
    username: "classteacher@sms.com",
    email: "classteacher@sms.com",
    password: "classteacher123",
    role: "class_teacher",
    linkedStaffId: "staff-001",
    accessPermissions: ["overview", "sis", "attendance", "timetable", "exams", "fees", "homework", "communication", "leave", "support", "settings"],
    responsibilities: "Marks attendance, approves student leave for class, assigns homework, and views fee status for own class",
    phone: "+91 98765 11111",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "subjectteacher-001",
    name: "Arjun Deshmukh",
    username: "subjectteacher@sms.com",
    email: "subjectteacher@sms.com",
    password: "subjectteacher123",
    role: "subject_teacher",
    linkedStaffId: "staff-007",
    accessPermissions: ["overview", "sis", "timetable", "exams", "homework", "support", "settings"],
    responsibilities: "Handles subject homework, marks entry, and assigned class visibility",
    phone: "+91 98989 22007",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "accountant-001",
    name: "Nitin Verma",
    username: "accountant@sms.com",
    email: "accountant@sms.com",
    password: "accountant123",
    role: "accountant",
    linkedStaffId: "staff-002",
    accessPermissions: ["overview", "fees", "reports", "leave", "support", "settings"],
    responsibilities: "Manages fee records, pending dues, receipts, and finance reports",
    phone: "+91 98111 22003",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "librarian-001",
    name: "Ritu Singh",
    username: "librarian@sms.com",
    email: "librarian@sms.com",
    password: "librarian123",
    role: "librarian",
    linkedStaffId: "staff-003",
    accessPermissions: ["overview", "support", "settings"],
    responsibilities: "Manages library catalogue, issue desk, and digital resources",
    phone: "+91 98222 33004",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "hr-001",
    name: "Anita Menon",
    username: "hr@sms.com",
    email: "hr@sms.com",
    password: "hr123",
    role: "hr_admin",
    linkedStaffId: "staff-008",
    accessPermissions: ["overview", "staff", "attendance", "leave", "reports", "support", "settings"],
    responsibilities: "Manages staff, staff leave, payroll-adjacent administration, and staff attendance",
    phone: "+91 98111 11008",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "transport-001",
    name: "Suresh Patil",
    username: "transport@sms.com",
    email: "transport@sms.com",
    password: "transport123",
    role: "transport_manager",
    linkedStaffId: "staff-004",
    accessPermissions: ["overview", "transport", "sis", "support", "settings"],
    responsibilities: "Monitors routes, driver assignment, ETA, and student transport mapping",
    phone: "+91 98333 44005",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "driver-001",
    name: "Suresh Pawar",
    username: "driver@sms.com",
    email: "driver@sms.com",
    password: "driver123",
    role: "driver",
    linkedStaffId: "staff-009",
    accessPermissions: ["overview", "transport", "settings"],
    responsibilities: "Views assigned route, student list, and travel status",
    phone: "+91 98444 55009",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "helpdesk-001",
    name: "Support Team",
    username: "helpdesk@sms.com",
    email: "helpdesk@sms.com",
    password: "helpdesk123",
    role: "support_helpdesk",
    linkedStaffId: "staff-010",
    accessPermissions: ["overview", "support", "settings"],
    responsibilities: "Handles tickets and responds to school user queries",
    phone: "+91 98555 66010",
    campus: "EduCore Support",
    avatar:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "student-001",
    name: "Ivan Vinod Vishwakarma",
    username: "student@sms.com",
    email: "student@sms.com",
    password: "student123",
    role: "student",
    linkedStudentId: "stu-001",
    accessPermissions: ["overview", "sis", "attendance", "exams", "fees", "homework", "communication", "leave", "settings"],
    responsibilities: "Student portal access",
    phone: "+91 90000 12345",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=80"
  }
];

export const mockTenants = [
  {
    id: "tenant-001",
    name: "Rahul Education Campus",
    subdomain: "rahul.learning.in",
    board: "ICSE",
    status: "Active",
    plan: "Enterprise",
    students: 2480,
    activeUsers: 6120,
    modules: 14,
    mrr: 125000
  },
  {
    id: "tenant-002",
    name: "Shree Prastha Public School",
    subdomain: "sprps.learning.in",
    board: "CBSE",
    status: "Trial",
    plan: "Growth",
    students: 1680,
    activeUsers: 2940,
    modules: 10,
    mrr: 68000
  },
  {
    id: "tenant-003",
    name: "Vidya Bharati College",
    subdomain: "vidya.learning.in",
    board: "State Board",
    status: "Active",
    plan: "Professional",
    students: 3210,
    activeUsers: 5440,
    modules: 12,
    mrr: 91000
  }
];

export const mockOnboarding = [
  {
    id: "ob-001",
    institution: "Lotus Valley Academy",
    step: "Academic Setup",
    owner: "Success Team",
    eta: "2026-03-27",
    status: "In Progress"
  },
  {
    id: "ob-002",
    institution: "Golden Future Junior College",
    step: "Branding",
    owner: "Support Team",
    eta: "2026-03-26",
    status: "Awaiting School Inputs"
  },
  {
    id: "ob-003",
    institution: "Pioneer Convent School",
    step: "Go Live",
    owner: "Ops Team",
    eta: "2026-03-25",
    status: "Ready"
  }
];

export const mockStudents = [
  {
    id: "stu-001",
    admissionNo: "21RISNIC0049",
    applicationNo: "APP-2021-0049",
    name: "Ivan Vinod Vishwakarma",
    className: "Grade 3 - B",
    parentName: "Vinod Vishwakarma",
    admissionDate: "2021-06-12",
    academicHistory: "Promoted from Grade 2 - A in AY 2025-26 with A grade.",
    attendance: 94,
    feesDue: 12500,
    performance: "A",
    transportRoute: "Route 4",
    busStop: "Shivaji Nagar",
    busTrackingStatus: "Bus reached stop at 07:20 AM",
    medical: "No allergies",
    bloodGroup: "O+",
    emergencyContact: "+91 9876543210",
    siblingName: "Anish Vinod",
    siblingClass: "K 2 - A",
    tcIssued: "No",
    alumniStatus: "Active",
    promotedTo: "Grade 4 - A",
    academicRecords: [
      {
        academicYear: "2024-25",
        className: "Grade 2 - A",
        resultStatus: "Passed",
        attendance: 92,
        leaveCount: 4,
        holidayCount: 18,
        resultFileName: "ivan-grade-2-report-card.pdf",
        resultFileData: ""
      },
      {
        academicYear: "2025-26",
        className: "Grade 3 - B",
        resultStatus: "Promoted",
        attendance: 94,
        leaveCount: 3,
        holidayCount: 20,
        resultFileName: "ivan-grade-3-report-card.pdf",
        resultFileData: ""
      }
    ],
    documentUploads: [
      { name: "birth-certificate.pdf", type: "application/pdf", data: "" },
      { name: "aadhaar-card.pdf", type: "application/pdf", data: "" }
    ],
    documents: 5,
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "stu-002",
    admissionNo: "24RISNIC0021",
    applicationNo: "APP-2024-0021",
    name: "Anish Vinod",
    className: "K 2 - A",
    parentName: "Vinod Vishwakarma",
    admissionDate: "2024-06-10",
    academicHistory: "New admission for AY 2024-25.",
    attendance: 91,
    feesDue: 8500,
    performance: "A-",
    transportRoute: "Route 2",
    busStop: "Civil Lines",
    busTrackingStatus: "Bus departed school at 01:15 PM",
    medical: "Dust allergy",
    bloodGroup: "B+",
    emergencyContact: "+91 9876543210",
    siblingName: "Ivan Vinod Vishwakarma",
    siblingClass: "Grade 3 - B",
    tcIssued: "No",
    alumniStatus: "Active",
    promotedTo: "",
    academicRecords: [
      {
        academicYear: "2024-25",
        className: "K 2 - A",
        resultStatus: "Active",
        attendance: 91,
        leaveCount: 2,
        holidayCount: 16,
        resultFileName: "anish-k2-report-card.pdf",
        resultFileData: ""
      }
    ],
    documentUploads: [{ name: "vaccination-card.pdf", type: "application/pdf", data: "" }],
    documents: 4,
    avatar:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "stu-003",
    admissionNo: "22RPS0041",
    applicationNo: "APP-2022-0041",
    name: "Sara Iqbal",
    className: "Grade 8 - A",
    parentName: "Amina Iqbal",
    admissionDate: "2022-06-15",
    academicHistory: "Consistent topper since Grade 6. Participated in science fair and debate club.",
    attendance: 88,
    feesDue: 0,
    performance: "A+",
    transportRoute: "Route 1",
    busStop: "City Mall",
    busTrackingStatus: "No live route assigned today",
    medical: "No conditions",
    bloodGroup: "A+",
    emergencyContact: "+91 9988776655",
    siblingName: "",
    siblingClass: "",
    tcIssued: "No",
    alumniStatus: "Active",
    promotedTo: "Grade 9 - A",
    academicRecords: [
      {
        academicYear: "2024-25",
        className: "Grade 7 - A",
        resultStatus: "Passed",
        attendance: 89,
        leaveCount: 5,
        holidayCount: 18,
        resultFileName: "sara-grade-7-report-card.pdf",
        resultFileData: ""
      },
      {
        academicYear: "2025-26",
        className: "Grade 8 - A",
        resultStatus: "Topper",
        attendance: 88,
        leaveCount: 3,
        holidayCount: 20,
        resultFileName: "sara-grade-8-report-card.pdf",
        resultFileData: ""
      }
    ],
    documentUploads: [{ name: "admission-form.pdf", type: "application/pdf", data: "" }],
    documents: 6,
    avatar:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80"
  }
];

export const mockStaff = [
  {
    id: "staff-001",
    employeeId: "EMP-1001",
    name: "Priya Sharma",
    portalRole: "teacher",
    designation: "Class Teacher",
    department: "Academics",
    qualification: "M.Sc, B.Ed",
    workload: "28 periods/week",
    leaveBalance: 9,
    classes: "Grade 3 - B"
  },
  {
    id: "staff-002",
    employeeId: "EMP-1002",
    name: "Nitin Verma",
    portalRole: "accountant",
    designation: "Accountant",
    department: "Finance",
    qualification: "B.Com",
    workload: "Fee operations",
    leaveBalance: 12,
    classes: "Institution-wide"
  },
  {
    id: "staff-003",
    employeeId: "EMP-1003",
    name: "Ritu Singh",
    portalRole: "librarian",
    designation: "Librarian",
    department: "Library",
    qualification: "MLIS",
    workload: "Catalog + issue/return",
    leaveBalance: 10,
    classes: "Institution-wide"
  },
  {
    id: "staff-004",
    employeeId: "EMP-1004",
    name: "Suresh Patil",
    portalRole: "transport_manager",
    designation: "Transport Supervisor",
    department: "Transport",
    qualification: "Fleet Operations Certification",
    workload: "Route monitoring and student pickup operations",
    leaveBalance: 11,
    classes: "Institution-wide"
  },
  {
    id: "staff-005",
    employeeId: "EMP-1005",
    name: "Meera Joshi",
    portalRole: "principal",
    designation: "Principal",
    department: "Administration",
    qualification: "M.Ed, PhD",
    workload: "Institution leadership",
    leaveBalance: 15,
    classes: "Institution-wide"
  },
  {
    id: "staff-006",
    employeeId: "EMP-1006",
    name: "Sneha Rao",
    portalRole: "academic_coordinator",
    designation: "Academic Coordinator",
    department: "Academics",
    qualification: "M.A, B.Ed",
    workload: "Timetable, syllabus, teacher assignment",
    leaveBalance: 12,
    classes: "Grade 3 - B, Grade 8 - A"
  },
  {
    id: "staff-007",
    employeeId: "EMP-1007",
    name: "Arjun Deshmukh",
    portalRole: "subject_teacher",
    designation: "Subject Teacher",
    department: "Mathematics",
    qualification: "M.Sc",
    workload: "Subject classes and marks entry",
    leaveBalance: 9,
    classes: "Grade 8 - A, Grade 10 - C"
  },
  {
    id: "staff-008",
    employeeId: "EMP-1008",
    name: "Anita Menon",
    portalRole: "hr_admin",
    designation: "HR & Administrative Staff",
    department: "Administration",
    qualification: "MBA HR",
    workload: "Staff admin, leave, payroll support",
    leaveBalance: 14,
    classes: "Institution-wide"
  },
  {
    id: "staff-009",
    employeeId: "EMP-1009",
    name: "Suresh Pawar",
    portalRole: "driver",
    designation: "Driver",
    department: "Transport",
    qualification: "Heavy Vehicle License",
    workload: "Route 4 morning and afternoon run",
    leaveBalance: 8,
    classes: "Route 4"
  },
  {
    id: "staff-010",
    employeeId: "EMP-1010",
    name: "Support Team",
    portalRole: "support_helpdesk",
    designation: "Help Desk Executive",
    department: "Support",
    qualification: "BCA",
    workload: "Ticket handling and user support",
    leaveBalance: 10,
    classes: "Institution-wide"
  }
];

export const mockAttendance = {
  todayPresent: 2312,
  todayAbsent: 168,
  staffPresent: 82,
  shortageAlerts: 37,
  studentSummary: [
    { className: "Grade 3 - B", present: 28, absent: 3, late: 1 },
    { className: "Grade 8 - A", present: 32, absent: 2, late: 0 },
    { className: "Grade 10 - C", present: 36, absent: 4, late: 2 }
  ]
};

export const mockTimetable = [
  {
    id: "tt-001",
    className: "Grade 3 - B",
    day: "Monday",
    period: "08:30 - 09:15",
    subject: "Mathematics",
    teacher: "Priya Sharma",
    room: "3B"
  },
  {
    id: "tt-002",
    className: "Grade 3 - B",
    day: "Monday",
    period: "09:15 - 10:00",
    subject: "English",
    teacher: "Meenal Dutta",
    room: "3B"
  },
  {
    id: "tt-003a",
    className: "Grade 3 - B",
    day: "Monday",
    period: "10:20 - 11:05",
    subject: "EVS",
    teacher: "Priya Sharma",
    room: "3B"
  },
  {
    id: "tt-003",
    className: "Grade 8 - A",
    day: "Monday",
    period: "10:20 - 11:05",
    subject: "Science Lab",
    teacher: "Karan Sethi",
    room: "Lab 2"
  },
  {
    id: "tt-004",
    className: "Grade 3 - B",
    day: "Tuesday",
    period: "08:30 - 09:15",
    subject: "Science",
    teacher: "Priya Sharma",
    room: "3B"
  },
  {
    id: "tt-004a",
    className: "Grade 3 - B",
    day: "Tuesday",
    period: "09:15 - 10:00",
    subject: "Hindi",
    teacher: "Priya Sharma",
    room: "3B"
  },
  {
    id: "tt-005",
    className: "Grade 3 - B",
    day: "Wednesday",
    period: "08:30 - 09:15",
    subject: "Social Studies",
    teacher: "Priya Sharma",
    room: "3B"
  },
  {
    id: "tt-005a",
    className: "Grade 3 - B",
    day: "Wednesday",
    period: "09:15 - 10:00",
    subject: "Computer",
    teacher: "Priya Sharma",
    room: "Computer Lab"
  },
  {
    id: "tt-006",
    className: "Grade 3 - B",
    day: "Thursday",
    period: "08:30 - 09:15",
    subject: "Mathematics",
    teacher: "Priya Sharma",
    room: "3B"
  },
  {
    id: "tt-006a",
    className: "Grade 3 - B",
    day: "Thursday",
    period: "09:15 - 10:00",
    subject: "GK",
    teacher: "Priya Sharma",
    room: "3B"
  },
  {
    id: "tt-007",
    className: "Grade 3 - B",
    day: "Friday",
    period: "08:30 - 09:15",
    subject: "English",
    teacher: "Priya Sharma",
    room: "3B"
  },
  {
    id: "tt-007a",
    className: "Grade 3 - B",
    day: "Friday",
    period: "09:15 - 10:00",
    subject: "Art",
    teacher: "Priya Sharma",
    room: "Art Room"
  }
];

export const mockExams = [
  {
    id: "exam-001",
    name: "Unit Test 1",
    className: "Grade 3 - B",
    schedule: "2026-04-10 to 2026-04-14",
    examDate: "2026-04-10",
    uploadedBy: "Aarav Mehta",
    fileName: "unit-test-1-grade-3-b.pdf",
    hallTickets: "Ready",
    resultStatus: "Pending"
  },
  {
    id: "exam-002",
    name: "Mid Term",
    className: "Grade 8 - A",
    schedule: "2026-08-11 to 2026-08-20",
    examDate: "2026-08-11",
    uploadedBy: "Rohan Kulkarni",
    fileName: "mid-term-grade-8-a.pdf",
    hallTickets: "Draft",
    resultStatus: "Not Started"
  }
];

export const mockResults = [
  {
    id: "res-001",
    student: "Ivan Vinod Vishwakarma",
    className: "Grade 3 - B",
    exam: "Unit Test 1",
    percentage: 88,
    grade: "A",
    rank: 4,
    approvalStatus: "Approved",
    approvedBy: "Aarav Mehta"
  },
  {
    id: "res-002",
    student: "Sara Iqbal",
    className: "Grade 8 - A",
    exam: "Unit Test 1",
    percentage: 94,
    grade: "A+",
    rank: 1,
    approvalStatus: "Pending",
    approvedBy: ""
  }
];

export const mockAnnouncements = [
  {
    id: "ann-001",
    title: "School Holiday Circular",
    audience: "All Students",
    type: "Holiday Circular",
    targetRoles: ["teacher", "vice_principal", "school_admin"],
    deliveryMode: "Scheduled",
    date: "2026-03-20",
    scheduledAt: "2026-03-20T07:30",
    documentName: "school-holiday-circular.pdf",
    status: "Published",
    content: "School will remain closed on Friday due to a local public holiday. Regular classes will resume on Saturday."
  },
  {
    id: "ann-002",
    title: "Urgent School Closure Notice",
    audience: "All Staff and Students",
    type: "Urgent Closure",
    targetRoles: ["teacher", "vice_principal", "school_admin"],
    deliveryMode: "Instant",
    date: "2026-03-18",
    scheduledAt: "",
    documentName: "urgent-school-closure-notice.pdf",
    status: "Published",
    content: "Due to heavy rain and city advisory, the school campus will remain closed today. Further updates will be shared through EduCore circulars."
  },
  {
    id: "ann-003",
    title: "Fee Due Reminder Broadcast",
    audience: "Teachers and Management",
    type: "Fee Due Reminder",
    targetRoles: ["teacher", "vice_principal", "school_admin"],
    deliveryMode: "Scheduled",
    date: "2026-03-26",
    scheduledAt: "2026-03-26T09:00",
    documentName: "fee-due-reminder.pdf",
    status: "Scheduled",
    content: "Fee due reminder will be shown on dashboard and web portal for the selected academic roles at 9:00 AM."
  }
];

export const mockHomework = [
  {
    id: "hw-001",
    subject: "Mathematics",
    className: "Grade 3 - B",
    title: "Fractions Worksheet",
    dueDate: "2026-03-26",
    mode: "Online",
    attachmentName: "fractions-worksheet.pdf",
    attachmentType: "application/pdf",
    attachmentData: "",
    studentSubmission: "fractions-worksheet-ivan.pdf",
    studentSubmissionType: "application/pdf",
    studentSubmissionData: "",
    completionStatus: "Pending Review",
    submissions: 24,
    totalStudents: 31,
    status: "Active"
  },
  {
    id: "hw-002",
    subject: "Science",
    className: "Grade 3 - B",
    title: "Plant Life Cycle Diagram",
    dueDate: "2026-03-28",
    mode: "Offline",
    attachmentName: "plant-life-cycle-reference.pdf",
    attachmentType: "application/pdf",
    attachmentData: "",
    studentSubmission: "",
    studentSubmissionType: "",
    studentSubmissionData: "",
    completionStatus: "Pending",
    submissions: 18,
    totalStudents: 31,
    status: "Active"
  }
];

export const mockFees = [
  {
    id: "fee-001",
    studentId: "stu-001",
    studentName: "Ivan Vinod Vishwakarma",
    category: "Tuition Fee",
    className: "Grade 3 - B",
    dueDate: "2026-04-05",
    amount: 10000,
    paid: 7500,
    pending: 2500,
    status: "Partial",
    receiptNo: "RCPT-2026-001",
    lastPaymentDate: "2026-03-10"
  },
  {
    id: "fee-002",
    studentId: "stu-001",
    studentName: "Ivan Vinod Vishwakarma",
    category: "Transport Fee",
    className: "Grade 3 - B",
    dueDate: "2026-04-05",
    amount: 2500,
    paid: 0,
    pending: 2500,
    status: "Pending",
    receiptNo: "RCPT-2026-002",
    lastPaymentDate: ""
  },
  {
    id: "fee-003",
    studentId: "stu-003",
    studentName: "Sara Iqbal",
    category: "Activity Fee",
    className: "Grade 8 - A",
    dueDate: "2026-04-07",
    amount: 3500,
    paid: 3500,
    pending: 0,
    status: "Paid",
    receiptNo: "RCPT-2026-003",
    lastPaymentDate: "2026-03-12"
  }
];

export const mockLeaves = [
  {
    id: "leave-001",
    applicant: "Priya Sharma",
    role: "Teacher",
    from: "2026-03-29",
    to: "2026-03-30",
    reason: "Workshop attendance",
    status: "Pending"
  },
  {
    id: "leave-002",
    applicant: "Ivan Vinod Vishwakarma",
    role: "Student",
    from: "2026-03-27",
    to: "2026-03-27",
    reason: "Medical appointment",
    status: "Approved"
  },
  {
    id: "leave-003",
    applicant: "Anish Vinod",
    role: "Student",
    from: "2026-03-30",
    to: "2026-03-30",
    reason: "Family function",
    status: "Pending"
  },
  {
    id: "leave-004",
    applicant: "Rohan Kulkarni",
    role: "Vice Principal",
    from: "2026-04-02",
    to: "2026-04-03",
    reason: "Official travel",
    status: "Pending"
  }
];

export const mockAttendanceRecords = [
  {
    id: "att-001",
    className: "Grade 3 - B",
    date: "2026-03-25",
    present: 28,
    absent: 3,
    late: 1,
    markedBy: "Priya Sharma"
  },
  {
    id: "att-002",
    className: "Grade 8 - A",
    date: "2026-03-25",
    present: 32,
    absent: 2,
    late: 0,
    markedBy: "Rohan Kulkarni"
  }
];

export const mockLibrary = [
  {
    id: "lib-001",
    title: "Wings of Fire",
    isbn: "9788173711466",
    issuedTo: "Sara Iqbal",
    dueDate: "2026-03-30",
    status: "Issued"
  },
  {
    id: "lib-002",
    title: "NCERT Science Lab Manual",
    isbn: "9789351414490",
    issuedTo: "Grade 8 - A",
    dueDate: "2026-04-02",
    status: "Class Set"
  }
];

export const mockTransport = [
  {
    id: "tr-001",
    route: "Route 4",
    vehicle: "MH12 AB 4432",
    driver: "Suresh Pawar",
    driverPhone: "+91 98444 55009",
    conductor: "Mahesh Kale",
    conductorPhone: "+91 98877 66001",
    students: 42,
    eta: "07:42 AM",
    status: "On Route",
    gpsStatus: "Live",
    currentLocation: "Near Shree Nagar Circle"
  },
  {
    id: "tr-002",
    route: "Route 2",
    vehicle: "MH14 TK 9831",
    driver: "Rakesh Nair",
    driverPhone: "+91 98444 55010",
    conductor: "Vikas Patil",
    conductorPhone: "+91 98877 66002",
    students: 36,
    eta: "07:55 AM",
    status: "Reached School",
    gpsStatus: "Idle",
    currentLocation: "School Campus"
  }
];

export const mockContent = [
  {
    id: "content-001",
    subject: "Mathematics",
    className: "Grade 3 - B",
    chapter: "Fractions",
    completion: 75,
    resources: 8
  },
  {
    id: "content-002",
    subject: "Science",
    className: "Grade 8 - A",
    chapter: "Cell Structure",
    completion: 60,
    resources: 5
  }
];

export const mockReports = [
  {
    id: "rep-001",
    report: "Fee Collection Summary",
    schedule: "Daily 6:00 PM",
    format: "PDF + Excel",
    owner: "Accountant"
  },
  {
    id: "rep-002",
    report: "Attendance Defaulter Report",
    schedule: "Weekly Monday",
    format: "PDF",
    owner: "Vice Principal"
  },
  {
    id: "rep-003",
    report: "Academic Performance Dashboard",
    schedule: "Monthly",
    format: "Interactive",
    owner: "Principal"
  }
];

export const mockSupportTickets = [
  {
    id: "sup-001",
    school: "Shree Prastha Public School",
    issue: "Notification gateway credentials update",
    priority: "High",
    status: "Open"
  },
  {
    id: "sup-002",
    school: "Vidya Bharati College",
    issue: "Exam report export formatting",
    priority: "Medium",
    status: "In Progress"
  }
];

export const mockFeatureFlags = [
  { name: "Transport GPS", enabledSchools: 24, status: "Enabled" },
  { name: "WhatsApp Alerts", enabledSchools: 61, status: "Enabled" },
  { name: "Online Exams", enabledSchools: 13, status: "Pilot" }
];

export const mockIntegrations = {
  payments: ["Razorpay", "Stripe", "Paytm", "PayU"],
  notifications: ["Firebase Cloud Messaging", "Email", "Push Notifications", "WhatsApp Business API"],
  storage: ["Cloudinary", "AWS S3", "Cloudflare R2"],
  auth: ["JWT", "OAuth2", "OTP via Email"]
};

export const mockRoles = [
  {
    role: "super_admin",
    permissions: ["tenant.manage", "subscription.manage", "billing.manage", "support.manage", "audit.view"]
  },
  {
    role: "school_admin",
    permissions: ["institution.manage", "academics.manage", "staff.manage", "fees.manage", "communication.manage"]
  },
  {
    role: "principal",
    permissions: ["reports.view", "leave.approve", "communication.broadcast", "performance.monitor", "fees.view"]
  },
  {
    role: "vice_principal",
    permissions: ["academics.manage", "staff.read", "leave.approve", "reports.view"]
  },
  {
    role: "teacher",
    permissions: ["attendance.manage", "homework.manage", "results.manage", "content.manage"]
  },
  {
    role: "class_teacher",
    permissions: ["attendance.manage", "student_leave.approve", "homework.manage", "fees.view.class", "communication.class"]
  },
  {
    role: "subject_teacher",
    permissions: ["homework.manage", "marks.manage", "classes.view.assigned"]
  },
  {
    role: "academic_coordinator",
    permissions: ["timetable.manage", "syllabus.monitor", "teachers.assign", "academics.monitor"]
  },
  {
    role: "accountant",
    permissions: ["fees.manage", "receipts.generate", "financial_reports.view"]
  },
  {
    role: "hr_admin",
    permissions: ["staff.manage", "staff_leave.manage", "staff_attendance.manage"]
  },
  {
    role: "librarian",
    permissions: ["library.manage", "books.issue", "catalog.manage"]
  },
  {
    role: "transport_manager",
    permissions: ["routes.manage", "drivers.assign", "transport.map_students"]
  },
  {
    role: "driver",
    permissions: ["route.view.assigned", "students.view.assigned"]
  },
  {
    role: "support_helpdesk",
    permissions: ["tickets.manage", "queries.respond"]
  }
];

export const mockStats = {
  totalStudents: 1248,
  totalTeachers: 86,
  feesCollected: 4825000,
  feesPending: 735000,
  announcements: 18,
  activeAssignments: 37,
  pendingLeaves: 9,
  totalSchools: 128,
  monthlyUsers: 58240,
  appDownloads: 27110,
  uptime: "99.94%",
  apiP95: "248ms",
  nps: 59,
  feeCollectionCoverage: "82%"
};

export const mockPlatformData = {
  stats: mockStats,
  tenants: mockTenants,
  onboarding: mockOnboarding,
  students: mockStudents,
  staff: mockStaff,
  attendance: mockAttendance,
  attendanceRecords: mockAttendanceRecords,
  timetable: mockTimetable,
  exams: mockExams,
  results: mockResults,
  fees: mockFees,
  homework: mockHomework,
  announcements: mockAnnouncements,
  leaves: mockLeaves,
  library: mockLibrary,
  transport: mockTransport,
  content: mockContent,
  reports: mockReports,
  supportTickets: mockSupportTickets,
  featureFlags: mockFeatureFlags
};
