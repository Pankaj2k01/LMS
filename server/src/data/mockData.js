export const mockUsers = [
  {
    id: "super-001",
    name: "Neha Kapoor",
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
    id: "vice-001",
    name: "Rohan Kulkarni",
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
    id: "teacher-001",
    name: "Priya Sharma",
    email: "teacher@sms.com",
    password: "teacher123",
    role: "teacher",
    accessPermissions: ["overview", "sis", "attendance", "exams", "fees", "homework", "communication", "leave", "settings"],
    responsibilities: "Class teacher for Grade 3 - B with homework and result visibility",
    phone: "+91 98765 11111",
    campus: "Rahul Education Campus",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
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
    name: "Ivan Vinod Vishwakarma",
    className: "Grade 3 - B",
    parentName: "Vinod Vishwakarma",
    attendance: 94,
    feesDue: 12500,
    performance: "A",
    transportRoute: "Route 4",
    medical: "No allergies",
    documents: 5,
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "stu-002",
    admissionNo: "24RISNIC0021",
    name: "Anish Vinod",
    className: "K 2 - A",
    parentName: "Vinod Vishwakarma",
    attendance: 91,
    feesDue: 8500,
    performance: "A-",
    transportRoute: "Route 2",
    medical: "Dust allergy",
    documents: 4,
    avatar:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "stu-003",
    admissionNo: "22RPS0041",
    name: "Sara Iqbal",
    className: "Grade 8 - A",
    parentName: "Amina Iqbal",
    attendance: 88,
    feesDue: 0,
    performance: "A+",
    transportRoute: "Route 1",
    medical: "No conditions",
    documents: 6,
    avatar:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80"
  }
];

export const mockStaff = [
  {
    id: "staff-001",
    name: "Priya Sharma",
    designation: "Class Teacher",
    department: "Academics",
    qualification: "M.Sc, B.Ed",
    workload: "28 periods/week",
    leaveBalance: 9,
    classes: "Grade 3 - B"
  },
  {
    id: "staff-002",
    name: "Nitin Verma",
    designation: "Accountant",
    department: "Finance",
    qualification: "B.Com",
    workload: "Fee operations",
    leaveBalance: 12,
    classes: "Institution-wide"
  },
  {
    id: "staff-003",
    name: "Ritu Singh",
    designation: "Librarian",
    department: "Library",
    qualification: "MLIS",
    workload: "Catalog + issue/return",
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
    date: "2026-03-20",
    documentName: "school-holiday-circular.pdf",
    status: "Published",
    content: "School will remain closed on Friday due to a local public holiday. Regular classes will resume on Saturday."
  },
  {
    id: "ann-002",
    title: "Urgent School Closure Notice",
    audience: "All Staff and Students",
    type: "Urgent Closure",
    date: "2026-03-18",
    documentName: "urgent-school-closure-notice.pdf",
    status: "Published",
    content: "Due to heavy rain and city advisory, the school campus will remain closed today. Further updates will be shared through EduCore circulars."
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
    studentSubmission: "fractions-worksheet-ivan.pdf",
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
    studentSubmission: "",
    completionStatus: "Pending",
    submissions: 18,
    totalStudents: 31,
    status: "Active"
  }
];

export const mockFees = [
  {
    id: "fee-001",
    studentName: "Ivan Vinod Vishwakarma",
    category: "Tuition Fee",
    className: "Grade 3 - B",
    dueDate: "2026-04-05",
    amount: 10000,
    paid: 7500,
    pending: 2500,
    status: "Partial"
  },
  {
    id: "fee-002",
    studentName: "Ivan Vinod Vishwakarma",
    category: "Transport Fee",
    className: "Grade 3 - B",
    dueDate: "2026-04-05",
    amount: 2500,
    paid: 0,
    pending: 2500,
    status: "Pending"
  },
  {
    id: "fee-003",
    studentName: "Sara Iqbal",
    category: "Activity Fee",
    className: "Grade 8 - A",
    dueDate: "2026-04-07",
    amount: 3500,
    paid: 3500,
    pending: 0,
    status: "Paid"
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
    students: 42,
    eta: "07:42 AM",
    status: "On Route"
  },
  {
    id: "tr-002",
    route: "Route 2",
    vehicle: "MH14 TK 9831",
    driver: "Rakesh Nair",
    students: 36,
    eta: "07:55 AM",
    status: "Reached School"
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
    role: "vice_principal",
    permissions: ["academics.manage", "staff.read", "leave.approve", "reports.view"]
  },
  {
    role: "teacher",
    permissions: ["attendance.manage", "homework.manage", "results.manage", "content.manage"]
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
