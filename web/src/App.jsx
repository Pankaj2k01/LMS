import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Bus,
  CheckSquare,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  FileBadge,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  Megaphone,
  Pencil,
  Plus,
  Receipt,
  Save,
  School,
  Settings,
  ShieldCheck,
  SquareLibrary,
  Ticket,
  Trash2,
  Upload,
  UserSquare2,
  Users,
  X
} from "lucide-react";
import { demoUser } from "./data/demoData";
import {
  createAnnouncement,
  createAttendanceRecord,
  createExam,
  createFee,
  createHomework,
  createLeave,
  createResult,
  createStaff,
  createStudent,
  createSupportTicket,
  createTimetableEntry,
  deleteAnnouncement,
  deleteAttendanceRecord,
  deleteExam,
  deleteFee,
  deleteHomework,
  deleteLeave,
  deleteResult,
  deleteStaff,
  deleteStudent,
  deleteTimetableEntry,
  fetchCurrentUser,
  fetchDashboard,
  fetchIntegrations,
  fetchPlatformData,
  fetchRoles,
  fetchUsers,
  login,
  logout,
  payFee,
  requestPasswordReset,
  submitHomework,
  updateAnnouncement,
  updateAttendanceRecord,
  updateExam,
  updateFee,
  updateHomework,
  updateLeave,
  updateResult,
  updateStaff,
  updateStudent,
  updateTimetableEntry,
  updateUserAccess,
} from "./lib/api";

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "onboarding", label: "Onboarding", icon: School },
  { id: "sis", label: "Students", icon: Users },
  { id: "staff", label: "Staff", icon: Briefcase },
  { id: "attendance", label: "Attendance", icon: CheckSquare },
  { id: "timetable", label: "Timetable", icon: ClipboardList },
  { id: "exams", label: "Exams & Results", icon: GraduationCap },
  { id: "fees", label: "Fee Management", icon: CreditCard },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "transport", label: "Transport", icon: Bus },
  { id: "library", label: "Library", icon: Library },
  { id: "content", label: "Academic Content", icon: SquareLibrary },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "communication", label: "Notifications", icon: Megaphone },
  { id: "leave", label: "Leave Applications", icon: ClipboardList },
  { id: "support", label: "Help & Support", icon: Ticket },
  { id: "settings", label: "Settings", icon: Settings }
];

const moduleAccessOptions = [
  { id: "onboarding", label: "Onboarding" },
  { id: "sis", label: "Students" },
  { id: "staff", label: "Staff" },
  { id: "attendance", label: "Attendance" },
  { id: "timetable", label: "Timetable" },
  { id: "exams", label: "Exams & Results" },
  { id: "fees", label: "Fee Management" },
  { id: "homework", label: "Homework" },
  { id: "transport", label: "Transport" },
  { id: "library", label: "Library" },
  { id: "content", label: "Academic Content" },
  { id: "reports", label: "Reports" },
  { id: "communication", label: "Notifications" },
  { id: "leave", label: "Leave Applications" }
];

const notificationTargetOptions = [
  { id: "teacher", label: "Teachers" },
  { id: "vice_principal", label: "Vice Principal" },
  { id: "school_admin", label: "Principal" },
  { id: "super_admin", label: "Super Admin" }
];

const roleTabs = {
  super_admin: navigation.map((item) => item.id),
  school_admin: navigation.map((item) => item.id),
  principal: ["overview", "sis", "staff", "attendance", "timetable", "exams", "fees", "communication", "reports", "leave", "support", "settings"],
  vice_principal: ["overview", "sis", "staff", "attendance", "timetable", "exams", "fees", "communication", "reports", "leave", "support", "settings"],
  academic_coordinator: ["overview", "staff", "attendance", "timetable", "exams", "content", "reports", "support", "settings"],
  teacher: ["overview", "sis", "attendance", "timetable", "exams", "fees", "homework", "content", "reports", "communication", "leave", "support", "settings"],
  class_teacher: ["overview", "sis", "attendance", "timetable", "exams", "fees", "homework", "communication", "leave", "support", "settings"],
  subject_teacher: ["overview", "sis", "timetable", "exams", "homework", "support", "settings"],
  support_agent: ["settings"],
  accountant: ["overview", "fees", "reports", "leave", "support", "settings"],
  hr_admin: ["overview", "staff", "attendance", "leave", "reports", "support", "settings"],
  librarian: ["overview", "library", "support", "settings"],
  parent: ["settings"],
  student: ["overview", "sis", "attendance", "timetable", "exams", "fees", "homework", "transport", "library", "content", "communication", "leave", "support", "settings"],
  transport_staff: ["overview", "transport", "support", "settings"],
  transport_manager: ["overview", "transport", "sis", "support", "settings"],
  driver: ["overview", "transport", "settings"],
  support_helpdesk: ["overview", "support", "settings"]
};

const roleAccess = {
  manageStudents: ["super_admin", "school_admin", "principal", "vice_principal"],
  manageStaff: ["super_admin", "school_admin", "principal", "vice_principal", "hr_admin"],
  manageAttendance: ["school_admin", "principal", "vice_principal", "class_teacher"],
  manageTimetable: ["school_admin", "principal", "vice_principal", "academic_coordinator"],
  manageExams: ["school_admin", "principal", "vice_principal", "academic_coordinator"],
  manageResults: ["school_admin", "principal", "vice_principal", "academic_coordinator", "class_teacher", "subject_teacher"],
  approveResults: ["school_admin", "principal", "vice_principal"],
  manageFees: ["super_admin", "school_admin", "accountant"],
  manageHomework: ["super_admin", "school_admin", "vice_principal", "class_teacher", "subject_teacher", "teacher"],
  manageCommunication: ["super_admin", "school_admin", "principal", "vice_principal", "class_teacher"],
  manageLeave: ["super_admin", "school_admin", "principal", "vice_principal", "class_teacher", "hr_admin"],
  accessControl: ["school_admin"],
  fullOverview: ["school_admin", "super_admin", "principal", "vice_principal"]
};

const loginNotes = [
  "EduCore includes linked student, staff, academic, fee, notification, and support workflows.",
  "Login supports email or username with JWT-based access control.",
  "New student and staff accounts use assigned username as the first login password."
];

const overviewStats = [
  { key: "totalSchools", label: "Schools", icon: School, color: "bg-blue-100 text-blue-700" },
  { key: "monthlyUsers", label: "MAU", icon: Users, color: "bg-amber-100 text-amber-700" },
  { key: "appDownloads", label: "Downloads", icon: Receipt, color: "bg-emerald-100 text-emerald-700" },
  { key: "nps", label: "NPS", icon: Bell, color: "bg-rose-100 text-rose-700" }
];

const schoolStats = [
  { key: "totalStudents", label: "Students", icon: Users, color: "bg-blue-100 text-blue-700" },
  { key: "totalTeachers", label: "Teachers", icon: GraduationCap, color: "bg-amber-100 text-amber-700" },
  { key: "feesCollected", label: "Fees Collected", icon: Receipt, color: "bg-emerald-100 text-emerald-700", currency: true },
  { key: "feesPending", label: "Pending Fees", icon: FileBadge, color: "bg-rose-100 text-rose-700", currency: true }
];

const initialForms = {
  student: {
    name: "",
    admissionNo: "",
    applicationNo: "",
    className: "",
    parentName: "",
    admissionDate: "",
    academicHistory: "",
    feesDue: "",
    transportRoute: "",
    busStop: "",
    busTrackingStatus: "",
    medical: "",
    bloodGroup: "",
    emergencyContact: "",
    siblingName: "",
    siblingClass: "",
    tcIssued: "No",
    alumniStatus: "Active",
    promotedTo: "",
    portalUsername: "",
    academicRecords: [],
    attendance: "",
    performance: "Pending",
    documents: "",
    documentUploads: []
  },
  staff: {
    employeeId: "",
    name: "",
    portalRole: "teacher",
    designation: "",
    department: "",
    qualification: "",
    workload: "",
    leaveBalance: "",
    classes: "",
    portalUsername: ""
  },
  attendance: { className: "", date: "", present: "", absent: "", late: "", markedBy: "" },
  timetable: { className: "", day: "Monday", period: "", subject: "", teacher: "", room: "" },
  exam: { name: "", className: "", schedule: "", examDate: "", uploadedBy: "", fileName: "", fileType: "", fileData: "", hallTickets: "Draft", resultStatus: "Pending" },
  result: { student: "", className: "", exam: "", percentage: "", grade: "", rank: "", approvalStatus: "Pending", approvedBy: "" },
  fee: { studentName: "", category: "", className: "", dueDate: "", amount: "", paid: "", pending: "", status: "Pending" },
  announcement: {
    title: "",
    audience: "",
    type: "General Circular",
    targetRoles: ["teacher"],
    deliveryMode: "Instant",
    date: "",
    scheduledAt: "",
    documentName: "",
    documentType: "",
    documentData: "",
    content: "",
    status: "Published"
  },
  homework: {
    subject: "",
    className: "",
    title: "",
    dueDate: "",
    mode: "Offline",
    attachmentName: "",
    attachmentType: "",
    attachmentData: "",
    studentSubmission: "",
    studentSubmissionType: "",
    studentSubmissionData: "",
    completionStatus: "Pending",
    submissions: "",
    totalStudents: "",
    status: "Active"
  },
  leave: { applicant: "", role: "", from: "", to: "", reason: "", status: "Pending" }
};

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const sectionTitles = {
  student: "Student",
  staff: "Staff Member",
  attendance: "Attendance",
  exam: "Exam",
  result: "Result",
  fee: "Fee",
  announcement: "Circular",
  homework: "Homework",
  leave: "Leave Request"
};

const formatRoleLabel = (role) =>
  String(role || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getAccessibleTabsForUser = (user) => {
  const baseTabs = roleTabs[user?.role] || ["overview", "settings"];
  if (!user) {
    return ["overview", "settings"];
  }

  if (["school_admin", "super_admin", "principal", "vice_principal"].includes(user.role)) {
    return baseTabs;
  }

  const assignedTabs = Array.isArray(user.accessPermissions) && user.accessPermissions.length > 0 ? user.accessPermissions : baseTabs;
  const filtered = baseTabs.filter((tab) => assignedTabs.includes(tab) || ["overview", "settings"].includes(tab));
  const roleEnhancements = baseTabs.filter((tab) => ["transport", "library", "content", "reports", "support", "timetable"].includes(tab));
  return [...new Set(["overview", ...filtered, ...roleEnhancements, "settings"])];
};

const getPageMeta = (activeTab) => {
  const labels = {
    overview: { title: "Dashboard", subtitle: "Role-based overview of academic and operational activity." },
    onboarding: { title: "Onboarding", subtitle: "School setup wizard, academic configuration, and go-live checklist." },
    sis: { title: "Students", subtitle: "Student profiles, fee status, and class-level details." },
    staff: { title: "Staff", subtitle: "Staff profiles, roles, responsibilities, and portal access." },
    attendance: { title: "Attendance", subtitle: "Daily attendance entries and class attendance history." },
    timetable: { title: "Timetable", subtitle: "Weekly class schedule, lecture allocation, and downloadable timetable." },
    exams: { title: "Examinations", subtitle: "Exam schedules, result status, and academic performance." },
    fees: { title: "Fee Management", subtitle: "Collection, dues, receipts, and payment status." },
    homework: { title: "Homework", subtitle: "Assignments, due dates, and submission tracking." },
    transport: { title: "Transport", subtitle: "Routes, bus tracking, ETA, and assigned transport details." },
    library: { title: "Library", subtitle: "Catalogue, issue-return records, due dates, and digital resources." },
    content: { title: "Academic Content", subtitle: "Syllabus progress, study resources, and chapter completion." },
    reports: { title: "Reports", subtitle: "Operational and academic reports with export-ready views." },
    communication: { title: "Notifications", subtitle: "Broadcast circulars, announcements, and notices." },
    leave: { title: "Leave", subtitle: "Leave requests, approvals, and status tracking." },
    support: { title: "Help & Support", subtitle: "Support contacts, ticket queue, and platform assistance." },
    settings: { title: "Settings", subtitle: "Account access and system configuration." }
  };

  return labels[activeTab] || labels.overview;
};

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const calendarWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseCalendarDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildMonthGrid(items) {
  const datedItems = items
    .map((item) => ({ ...item, parsedDate: parseCalendarDate(item.date) }))
    .filter((item) => item.parsedDate);

  if (!datedItems.length) {
    return null;
  }

  const anchor = datedItems[0].parsedDate;
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const monthStart = new Date(year, month, 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  const cells = Array.from({ length: 35 }, (_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    const isoDate = cellDate.toISOString().slice(0, 10);
    return {
      isoDate,
      dayNumber: cellDate.getDate(),
      isCurrentMonth: cellDate.getMonth() === month,
      items: datedItems.filter((item) => item.parsedDate.toISOString().slice(0, 10) === isoDate)
    };
  });

  return {
    title: anchor.toLocaleString("en-IN", { month: "long", year: "numeric" }),
    cells
  };
}

function buildWeekBoard(items) {
  const normalized = weekDays.map((day) => ({
    day,
    items: items.filter((item) => String(item.date || "").toLowerCase() === day.toLowerCase())
  }));

  return normalized.some((column) => column.items.length) ? normalized : null;
}

function getSubjectsForClass(className, timetable = []) {
  return [...new Set(timetable.filter((item) => item.className === className).map((item) => item.subject).filter(Boolean))];
}

function buildReceiptContent(fee) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>EduCore Fee Receipt</title>
    <style>
      body { font-family: Arial, sans-serif; color: #0f172a; margin: 24px; }
      .wrap { max-width: 760px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; }
      .head { background: #0f2f5f; color: white; padding: 24px; }
      .head h1 { margin: 0 0 8px; font-size: 28px; }
      .head p { margin: 4px 0; font-size: 14px; opacity: 0.92; }
      .section { padding: 24px; }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 10px 0; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
      td:first-child { color: #475569; width: 34%; }
      .footer { padding: 24px; background: #f8fafc; font-size: 12px; color: #64748b; }
      .status { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #dbeafe; color: #1d4ed8; font-weight: 700; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="head">
        <h1>EduCore</h1>
        <p>Rahul Education Campus</p>
        <p>Official Fee Receipt</p>
      </div>
      <div class="section">
        <table>
          <tr><td>Receipt No.</td><td>${fee.receiptNo || fee.id}</td></tr>
          <tr><td>Student Name</td><td>${fee.studentName || "Student"}</td></tr>
          <tr><td>Class / Section</td><td>${fee.className}</td></tr>
          <tr><td>Fee Category</td><td>${fee.category}</td></tr>
          <tr><td>Total Amount</td><td>${currency(fee.amount)}</td></tr>
          <tr><td>Paid Amount</td><td>${currency(fee.paid)}</td></tr>
          <tr><td>Pending Amount</td><td>${currency(fee.pending)}</td></tr>
          <tr><td>Due Date</td><td>${fee.dueDate}</td></tr>
          <tr><td>Last Payment Date</td><td>${fee.lastPaymentDate || "-"}</td></tr>
          <tr><td>Status</td><td><span class="status">${fee.status}</span></td></tr>
          <tr><td>Generated On</td><td>${new Date().toLocaleDateString("en-IN")}</td></tr>
        </table>
      </div>
      <div class="footer">
        This is a system-generated EduCore receipt for school fee records.
      </div>
    </div>
  </body>
</html>`;
}

function buildWeeklyTimetableContent(className, timetable = []) {
  const lines = [`EduCore Weekly Timetable`, `School: Rahul Education Campus`, `Class: ${className}`, ``];
  weekDays.forEach((day) => {
    lines.push(day);
    const rows = timetable.filter((item) => item.className === className && item.day === day);
    if (rows.length === 0) {
      lines.push("  No lecture scheduled");
    } else {
      rows.forEach((row) => lines.push(`  ${row.period} - ${row.subject} - ${row.teacher || "Teacher"} - Room ${row.room || "-"}`));
    }
    lines.push("");
  });
  return lines.join("\n");
}

function buildAnnouncementDocument(item) {
  return `EduCore Notification Document

Title: ${item.title}
Audience: ${item.audience}
Type: ${item.type}
Target Roles: ${(item.targetRoles || []).join(", ") || "All"}
Delivery Mode: ${item.deliveryMode || "Instant"}
Date: ${item.date}
Scheduled At: ${item.scheduledAt || "Immediate"}
Status: ${item.status}
Document: ${item.documentName || "No file attached"}

Details:
${item.content}`;
}

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

async function readFilesAsAttachmentList(fileList) {
  const files = Array.from(fileList || []);
  return Promise.all(
    files.map(async (file) => ({
      name: file.name,
      type: file.type || "",
      data: await readFileAsDataUrl(file)
    }))
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [integrations, setIntegrations] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("sms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [forms, setForms] = useState(initialForms);
  const [editing, setEditing] = useState({
    student: null,
    staff: null,
    attendance: null,
    timetable: null,
    exam: null,
    result: null,
    fee: null,
    announcement: null,
    homework: null,
    leave: null
  });
  const [submitting, setSubmitting] = useState("");

  const isAuthenticated = Boolean(currentUser && localStorage.getItem("sms_token"));
  const accessibleTabs = useMemo(() => getAccessibleTabsForUser(currentUser), [currentUser]);
  const pageMeta = useMemo(() => getPageMeta(activeTab), [activeTab]);
  const filteredNavigation = useMemo(
    () => navigation.filter((item) => accessibleTabs.includes(item.id)),
    [accessibleTabs]
  );

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("sms_token");
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch {
        logout();
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAppData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!accessibleTabs.includes(activeTab)) {
      setActiveTab(accessibleTabs[0] || "overview");
    }
  }, [accessibleTabs, activeTab]);

  async function loadAppData() {
    setDataLoading(true);
    setError("");
    try {
      const [dashboardResult, platformResult, rolesResult, integrationsResult, usersResult] = await Promise.allSettled([
        fetchDashboard(),
        fetchPlatformData(),
        fetchRoles(),
        fetchIntegrations(),
        currentUser?.role === "school_admin" ? fetchUsers() : Promise.resolve([])
      ]);

      if (dashboardResult.status !== "fulfilled" || platformResult.status !== "fulfilled") {
        throw new Error("Unable to load application data.");
      }

      setDashboard(dashboardResult.value);
      setPlatform(platformResult.value);
      setRoles(rolesResult.status === "fulfilled" ? rolesResult.value : []);
      setIntegrations(integrationsResult.status === "fulfilled" ? integrationsResult.value : null);
      setUsers(usersResult.status === "fulfilled" ? usersResult.value : []);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Unable to load application data.");
    } finally {
      setDataLoading(false);
    }
  }

  function updateForm(section, field, value) {
    setForms((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value
      }
    }));
  }

  async function handleFileUpload(section, file, fieldMap) {
    if (!file) {
      updateForm(section, fieldMap.name, "");
      updateForm(section, fieldMap.type, "");
      updateForm(section, fieldMap.data, "");
      return;
    }

    const fileData = await readFileAsDataUrl(file);
    setForms((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [fieldMap.name]: file.name,
        [fieldMap.type]: file.type || "",
        [fieldMap.data]: fileData
      }
    }));
  }

  async function handleMultipleFileUpload(section, files, fieldName) {
    const attachments = await readFilesAsAttachmentList(files);
    setForms((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [fieldName]: attachments,
        documents: String(attachments.length)
      }
    }));
  }

  function resetForm(section) {
    setForms((current) => ({
      ...current,
      [section]: initialForms[section]
    }));
    setEditing((current) => ({
      ...current,
      [section]: null
    }));
  }

  function startEdit(section, item) {
    setForms((current) => ({
      ...current,
      [section]: mapItemToForm(section, item)
    }));
    setEditing((current) => ({
      ...current,
      [section]: item.id
    }));
    setSuccessMessage("");
    setError("");
  }

  async function handleDelete(section, removeAction, id) {
    const itemLabel = sectionTitles[section] || "Record";
    if (!window.confirm(`Delete this ${itemLabel.toLowerCase()}?`)) {
      return;
    }

    setSubmitting(section);
    setError("");
    setSuccessMessage("");
    try {
      await removeAction(id);
      await loadAppData();
      if (editing[section] === id) {
        resetForm(section);
      }
      setSuccessMessage(`${itemLabel} deleted successfully.`);
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || `Unable to delete ${itemLabel.toLowerCase()}.`);
    } finally {
      setSubmitting("");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setAuthError("");
    setAuthLoading(true);

    try {
      const auth = await login({ email, password });
      setCurrentUser(auth.user);
    } catch (loginError) {
      setAuthError(loginError?.response?.data?.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  async function saveSection(section, createAction, updateAction, payloadBuilder) {
    setSubmitting(section);
    setError("");
    setSuccessMessage("");

    try {
      const payload = payloadBuilder(forms[section]);
      if (editing[section]) {
        await updateAction(editing[section], payload);
        setSuccessMessage(`${sectionTitles[section]} updated successfully.`);
      } else {
        const created = await createAction(payload);
        if (created?.portalUsername && created?.initialPassword) {
          setSuccessMessage(
            `${sectionTitles[section]} created successfully. First login username: ${created.portalUsername} | password: ${created.initialPassword}`
          );
        } else {
          setSuccessMessage(`${sectionTitles[section]} created successfully.`);
        }
      }
      await loadAppData();
      resetForm(section);
    } catch (submitError) {
      setError(submitError?.response?.data?.message || `Unable to save ${section}.`);
    } finally {
      setSubmitting("");
    }
  }

  function handleLogout() {
    logout();
    setCurrentUser(null);
    setDashboard(null);
    setPlatform(null);
    setRoles([]);
    setUsers([]);
    setIntegrations(null);
    setForms(initialForms);
    setEditing({
      student: null,
      staff: null,
      attendance: null,
      timetable: null,
      exam: null,
      result: null,
      fee: null,
      announcement: null,
      homework: null,
      leave: null
    });
    setActiveTab("overview");
  }

  const welcomeUser = currentUser || demoUser;

  const pageContent = useMemo(() => {
    if (!platform || !dashboard) {
      return null;
    }

    switch (activeTab) {
      case "onboarding":
        return <OnboardingSection onboarding={platform.onboarding || []} currentUser={currentUser} />;
      case "sis":
        return (
          <StudentsSection
            students={platform.students}
            timetable={platform.timetable || []}
            role={currentUser?.role}
            form={forms.student}
            editing={Boolean(editing.student)}
            canManage={roleAccess.manageStudents.includes(currentUser?.role)}
            onChange={(field, value) => updateForm("student", field, value)}
            onDocumentUpload={(files) => handleMultipleFileUpload("student", files, "documentUploads")}
            onSubmit={() =>
              saveSection("student", createStudent, updateStudent, (payload) => ({
                ...payload,
                portalUsername: payload.portalUsername || payload.admissionNo || "",
                documents: Number(payload.documents || (payload.documentUploads || []).length || 0),
                feesDue: Number(payload.feesDue || 0),
                attendance: Number(payload.attendance || 0),
                documentUploads: payload.documentUploads || []
              }))
            }
            onEdit={(item) => startEdit("student", item)}
            onDelete={(id) => handleDelete("student", deleteStudent, id)}
            onCancel={() => resetForm("student")}
            submitting={submitting === "student"}
          />
        );
      case "staff":
        return (
          <StaffSection
            staff={platform.staff || []}
            roles={roles}
            form={forms.staff}
            editing={Boolean(editing.staff)}
            canManage={roleAccess.manageStaff.includes(currentUser?.role)}
            onChange={(field, value) => updateForm("staff", field, value)}
            onSubmit={() =>
              saveSection("staff", createStaff, updateStaff, (payload) => ({
                ...payload,
                leaveBalance: Number(payload.leaveBalance || 0)
              }))
            }
            onEdit={(item) => startEdit("staff", item)}
            onDelete={(id) => handleDelete("staff", deleteStaff, id)}
            onCancel={() => resetForm("staff")}
            submitting={submitting === "staff"}
          />
        );
      case "attendance":
        return (
          <AttendanceSection
            attendance={platform.attendance}
            records={platform.attendanceRecords || []}
            students={platform.students || []}
            form={forms.attendance}
            editing={Boolean(editing.attendance)}
            canManage={roleAccess.manageAttendance.includes(currentUser?.role)}
            onChange={(field, value) => updateForm("attendance", field, value)}
            onSubmit={() =>
              saveSection("attendance", createAttendanceRecord, updateAttendanceRecord, (payload) => ({
                ...payload,
                present: Number(payload.present || 0),
                absent: Number(payload.absent || 0),
                late: Number(payload.late || 0),
                markedBy: payload.markedBy || currentUser?.name || ""
              }))
            }
            onEdit={(item) => startEdit("attendance", item)}
            onDelete={(id) => handleDelete("attendance", deleteAttendanceRecord, id)}
            onCancel={() => resetForm("attendance")}
            submitting={submitting === "attendance"}
            role={currentUser?.role}
          />
        );
      case "timetable":
        return (
          <TimetableSection
            timetable={platform.timetable || []}
            form={forms.timetable}
            editing={Boolean(editing.timetable)}
            canManage={roleAccess.manageTimetable.includes(currentUser?.role)}
            onChange={(field, value) => updateForm("timetable", field, value)}
            onSubmit={() => saveSection("timetable", createTimetableEntry, updateTimetableEntry)}
            onEdit={(item) => startEdit("timetable", item)}
            onDelete={(id) => handleDelete("timetable", deleteTimetableEntry, id)}
            onCancel={() => resetForm("timetable")}
            submitting={submitting === "timetable"}
            role={currentUser?.role}
          />
        );
      case "exams":
        return (
          <ExamsSection
            exams={platform.exams || []}
            results={platform.results || []}
            timetable={platform.timetable || []}
            form={forms.exam}
            resultForm={forms.result}
            timetableForm={forms.timetable}
            editingExam={Boolean(editing.exam)}
            editingResult={Boolean(editing.result)}
            editingTimetable={Boolean(editing.timetable)}
            canManage={roleAccess.manageExams.includes(currentUser?.role)}
            canApproveResults={roleAccess.approveResults.includes(currentUser?.role)}
            onExamChange={(field, value) => updateForm("exam", field, value)}
            onResultChange={(field, value) => updateForm("result", field, value)}
            onTimetableChange={(field, value) => updateForm("timetable", field, value)}
            onTimetableSubmit={() => saveSection("timetable", createTimetableEntry, updateTimetableEntry)}
            onExamFileChange={(file) => handleFileUpload("exam", file, { name: "fileName", type: "fileType", data: "fileData" })}
            onExamSubmit={() =>
              saveSection("exam", createExam, updateExam, (payload) => ({
                ...payload,
                uploadedBy: payload.uploadedBy || currentUser?.name || ""
              }))
            }
            onResultSubmit={() =>
              saveSection("result", createResult, updateResult, (payload) => ({
                ...payload,
                percentage: Number(payload.percentage || 0),
                rank: Number(payload.rank || 0),
                approvedBy:
                  ["Approved", "Published"].includes(payload.approvalStatus) ? payload.approvedBy || currentUser?.name || "" : payload.approvedBy || ""
              }))
            }
            onEditExam={(item) => startEdit("exam", item)}
            onDeleteExam={(id) => handleDelete("exam", deleteExam, id)}
            onCancelExam={() => resetForm("exam")}
            onEditTimetable={(item) => startEdit("timetable", item)}
            onDeleteTimetable={(id) => handleDelete("timetable", deleteTimetableEntry, id)}
            onCancelTimetable={() => resetForm("timetable")}
            onEditResult={(item) => startEdit("result", item)}
            onDeleteResult={(id) => handleDelete("result", deleteResult, id)}
            onCancelResult={() => resetForm("result")}
            submitting={submitting}
            role={currentUser?.role}
          />
        );
      case "fees":
        return (
          <FeesSection
            fees={platform.fees}
            stats={platform.stats}
            form={forms.fee}
            editing={Boolean(editing.fee)}
            canManage={roleAccess.manageFees.includes(currentUser?.role)}
            onChange={(field, value) => updateForm("fee", field, value)}
            onSubmit={() =>
              saveSection("fee", createFee, updateFee, (payload) => ({
                ...payload,
                amount: Number(payload.amount || 0),
                paid: Number(payload.paid || 0),
                pending: Number(payload.pending || 0)
              }))
            }
            onEdit={(item) => startEdit("fee", item)}
            onDelete={(id) => handleDelete("fee", deleteFee, id)}
            onCancel={() => resetForm("fee")}
            submitting={submitting === "fee"}
            role={currentUser?.role}
            onStudentPay={async (item) => {
              setSubmitting("fee");
              setError("");
              setSuccessMessage("");
              try {
                await payFee(item.id, { amount: Number(item.pending || 0) });
                await loadAppData();
                setSuccessMessage("Fee payment recorded successfully.");
              } catch (submitError) {
                setError(submitError?.response?.data?.message || "Unable to record fee payment.");
              } finally {
                setSubmitting("");
              }
            }}
          />
        );
      case "homework":
        return (
          <HomeworkSection
            homework={platform.homework}
            form={forms.homework}
            editing={Boolean(editing.homework)}
            canManage={roleAccess.manageHomework.includes(currentUser?.role)}
            onChange={(field, value) => updateForm("homework", field, value)}
            onAttachmentChange={(file) => handleFileUpload("homework", file, { name: "attachmentName", type: "attachmentType", data: "attachmentData" })}
            onSubmit={() =>
              saveSection("homework", createHomework, updateHomework, (payload) => ({
                ...payload,
                attachmentName: payload.attachmentName || "",
                attachmentType: payload.attachmentType || "",
                attachmentData: payload.attachmentData || "",
                studentSubmission: payload.studentSubmission || "",
                studentSubmissionType: payload.studentSubmissionType || "",
                studentSubmissionData: payload.studentSubmissionData || "",
                submissions: Number(payload.submissions || 0),
                totalStudents: Number(payload.totalStudents || 0)
              }))
            }
            onEdit={(item) => startEdit("homework", item)}
            onDelete={(id) => handleDelete("homework", deleteHomework, id)}
            onCancel={() => resetForm("homework")}
            submitting={submitting === "homework"}
            role={currentUser?.role}
            onStudentSubmit={async (item, file) => {
              setSubmitting("homework");
              setError("");
              setSuccessMessage("");
              try {
                const fileData = await readFileAsDataUrl(file);
                await submitHomework(item.id, {
                  studentSubmission: file.name,
                  studentSubmissionType: file.type || "",
                  studentSubmissionData: fileData
                });
                await loadAppData();
                setSuccessMessage("Homework submitted successfully.");
              } catch (submitError) {
                setError(submitError?.response?.data?.message || "Unable to submit homework.");
              } finally {
                setSubmitting("");
              }
            }}
          />
        );
      case "transport":
        return <TransportSection transport={platform.transport || []} role={currentUser?.role} />;
      case "library":
        return <LibrarySection library={platform.library || []} role={currentUser?.role} />;
      case "content":
        return <ContentSection content={platform.content || []} role={currentUser?.role} />;
      case "reports":
        return <ReportsSection reports={platform.reports || []} stats={platform.stats} role={currentUser?.role} />;
      case "communication":
        return (
          <CommunicationSection
            announcements={platform.announcements}
            form={forms.announcement}
            editing={Boolean(editing.announcement)}
            canManage={roleAccess.manageCommunication.includes(currentUser?.role)}
            onChange={(field, value) => updateForm("announcement", field, value)}
            onFileChange={(file) => handleFileUpload("announcement", file, { name: "documentName", type: "documentType", data: "documentData" })}
            onSubmit={() => saveSection("announcement", createAnnouncement, updateAnnouncement, (payload) => payload)}
            onEdit={(item) => startEdit("announcement", item)}
            onDelete={(id) => handleDelete("announcement", deleteAnnouncement, id)}
            onCancel={() => resetForm("announcement")}
            submitting={submitting === "announcement"}
            role={currentUser?.role}
          />
        );
      case "leave":
        return (
          <LeavesSection
            leaves={platform.leaves}
            form={forms.leave}
            editing={Boolean(editing.leave)}
            canManage={roleAccess.manageLeave.includes(currentUser?.role)}
            onChange={(field, value) => updateForm("leave", field, value)}
            onSubmit={() =>
              saveSection("leave", createLeave, updateLeave, (payload) => ({
                ...payload,
                applicant: payload.applicant || currentUser?.name || "",
                role: payload.role || formatRoleLabel(currentUser?.role)
              }))
            }
            onEdit={(item) => startEdit("leave", item)}
            onDelete={(id) => handleDelete("leave", deleteLeave, id)}
            onCancel={() => resetForm("leave")}
            submitting={submitting === "leave"}
            currentRole={currentUser?.role}
            currentUser={currentUser}
          />
        );
      case "support":
        return <SupportSection tickets={platform.supportTickets || []} currentUser={currentUser} />;
      case "settings":
        return (
          <SettingsSection
            integrations={integrations}
            roles={roles}
            users={users}
            currentUser={welcomeUser}
            onSaveAccess={async (userId, payload) => {
              const updated = await updateUserAccess(userId, payload);
              if (updated.id === currentUser?.id) {
                setCurrentUser(updated);
                localStorage.setItem("sms_user", JSON.stringify(updated));
              }
              await loadAppData();
            }}
          />
        );
      default:
        return <OverviewSection dashboard={dashboard} platform={platform} />;
    }
  }, [activeTab, currentUser, dashboard, editing, forms, integrations, platform, roles, submitting]);

  if (authLoading && !isAuthenticated) {
    return <CenteredMessage message="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onSubmit={handleLogin} error={authError} loading={authLoading} />;
  }

  return (
    <div className="min-h-screen text-brand-slate">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-[268px] shrink-0 transform overflow-y-auto bg-brand-navy px-4 py-6 text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start gap-3 px-2">
            <div className="rounded-2xl bg-brand-gold/95 p-3 text-brand-navy">
              <School size={24} />
            </div>
            <div className="max-w-[170px]">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200">EduCore</p>
              <h1 className="mt-1 text-[15px] font-bold leading-[1.35]">EduCore</h1>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] bg-white/10 p-4 backdrop-blur">
            <img src={welcomeUser.avatar} alt={welcomeUser.name} className="h-16 w-16 rounded-2xl object-cover" />
            <p className="mt-4 text-[17px] font-semibold leading-tight">{welcomeUser.name}</p>
            <p className="text-sm capitalize text-blue-100">{String(welcomeUser.role).replaceAll("_", " ")}</p>
            <p className="mt-2 text-xs text-blue-200">{welcomeUser.campus}</p>
          </div>

          <nav className="mt-7 space-y-1.5">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    active ? "bg-white text-brand-navy" : "text-blue-100 hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-[15px] font-medium leading-snug">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 text-blue-100 transition hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 p-2 lg:hidden"
                  onClick={() => setSidebarOpen((open) => !open)}
                >
                  <Menu size={20} />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">EduCore</p>
                  <h2 className="text-2xl font-bold text-brand-slate">{pageMeta.title}</h2>
                  <p className="mt-1 hidden text-sm text-slate-500 md:block">{pageMeta.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-2xl bg-brand-paper px-4 py-3 md:block">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Today</p>
                  <p className="text-sm font-semibold text-brand-slate">
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-2xl bg-brand-navy p-3 text-white shadow-panel"
                  onClick={() => setActiveTab("communication")}
                >
                  <Bell size={18} />
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
            {platform?.announcements?.length ? <AnnouncementTicker announcements={platform.announcements} compact /> : null}
            {successMessage ? <Banner tone="success" message={successMessage} onClose={() => setSuccessMessage("")} /> : null}
            {error ? <Banner tone="error" message={error} onClose={() => setError("")} /> : null}
            {dataLoading && !platform ? <CenteredPanel message="Loading platform modules..." /> : pageContent}
          </main>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onSubmit, error, loading }) {
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotValue, setForgotValue] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  async function handleForgotPassword() {
    setForgotLoading(true);
    setForgotMessage("");
    setForgotError("");

    try {
      const result = await requestPasswordReset({ email: forgotValue, username: forgotValue });
      setForgotMessage(result.message || "Password reset request submitted.");
    } catch (requestError) {
      setForgotError(requestError?.response?.data?.message || "Unable to process forgot password request.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-panel lg:p-10">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-paper p-3 text-brand-navy">
              <School size={22} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">EduCore</p>
              <h1 className="text-3xl font-bold text-brand-slate">EduCore</h1>
            </div>
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            A focused workspace for exams, results, fees, homework, notifications, attendance, student details, and leave approvals.
          </p>
          <div className="mt-8 space-y-3">
            {loginNotes.map((note) => (
              <div key={note} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-blue" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-panel lg:p-10">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-navy p-3 text-white">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Secure Access</p>
              <h2 className="text-2xl font-bold">Sign In</h2>
            </div>
          </div>
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <Field label="Email or Username" name="email" type="text" />
            <Field label="Password" name="password" type="password" />
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-2xl bg-brand-navy px-4 py-3 font-semibold text-white transition hover:bg-brand-blue"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setForgotOpen((current) => !current)}
            className="mt-4 text-sm font-medium text-brand-blue"
          >
            {forgotOpen ? "Hide Forgot Password" : "Forgot Password?"}
          </button>
          {forgotOpen ? (
            <div className="mt-4 rounded-[1.5rem] bg-slate-50 p-4">
              <Field label="Registered Email or Username" value={forgotValue} onChange={setForgotValue} />
              {forgotMessage ? <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{forgotMessage}</p> : null}
              {forgotError ? <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{forgotError}</p> : null}
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={!forgotValue || forgotLoading}
                className="mt-4 rounded-2xl bg-brand-navy px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {forgotLoading ? "Processing..." : "Request Password Reset"}
              </button>
            </div>
          ) : null}
          <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
            Accounts are managed from EduCore administration. Newly created student and staff accounts use their assigned username as the first login password.
          </div>
        </section>
      </div>
    </div>
  );
}

function OverviewSection({ dashboard, platform }) {
  const role = dashboard.userRole;
  if (role === "parent") {
    return <ParentDashboard platform={platform} />;
  }
  if (role === "student") {
    return <StudentDashboard platform={platform} />;
  }
  if (["teacher", "class_teacher", "subject_teacher", "academic_coordinator"].includes(role)) {
    return <TeacherDashboard platform={platform} />;
  }
  if (role === "accountant") {
    return <AccountantDashboard platform={platform} stats={dashboard.stats} />;
  }
  if (role === "hr_admin") {
    return <HRDashboard platform={platform} />;
  }
  if (role === "librarian") {
    return <LibrarianDashboard platform={platform} />;
  }
  if (["transport_staff", "transport_manager", "driver"].includes(role)) {
    return <TransportDashboard platform={platform} />;
  }
  if (role === "support_helpdesk") {
    return <SupportDashboard platform={platform} />;
  }

  const overviewCards = getOverviewCards(role, dashboard, platform);
  const highlights = getOverviewHighlights(role, platform);
  const visibleStudents = (platform.students || []).slice(0, role === "parent" ? 2 : 1);

  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} color={card.color} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Quick Summary" subtitle="Relevant information for your role">
          <div className="grid gap-4 md:grid-cols-2">
            {highlights.map((item) => (
              <KpiTile key={item.label} label={item.label} value={item.value} hint={item.hint} />
            ))}
          </div>
        </Panel>
        <Panel title={role === "parent" ? "My Children" : role === "student" ? "My Profile" : "Student Snapshot"} subtitle="Focused academic and fee information">
          <div className="space-y-4">
            {visibleStudents.map((student) => (
              <article key={student.id} className="rounded-[1.75rem] bg-gradient-to-br from-brand-navy to-brand-blue p-5 text-white">
                <div className="flex items-center gap-4">
                  <img src={student.avatar} alt={student.name} className="h-16 w-16 rounded-2xl object-cover" />
                  <div>
                    <p className="text-lg font-semibold">{student.name}</p>
                    <p className="text-sm text-blue-100">{student.className}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-200">{student.admissionNo}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <MetricTile label="Attendance" value={`${student.attendance}%`} />
                  <MetricTile label="Grade" value={student.performance} />
                  <MetricTile label="Due" value={currency(student.feesDue)} />
                </div>
              </article>
            ))}
            {visibleStudents.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No student-specific records are available for this role.</div>
            ) : null}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function SuperAdminSection({ stats, tenants, tickets, featureFlags, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting }) {
  return (
    <section className="mt-6 space-y-6">
      <Panel title="Super Admin Dashboard" subtitle="System-wide oversight for institutions, support, billing visibility, and platform health">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiTile label="Active Schools" value="104" hint="Out of 128 total tenants" />
          <KpiTile label="Trial Schools" value="16" hint="High conversion opportunity" />
          <KpiTile label="Monthly Revenue" value={currency(284000)} hint="MRR across active subscriptions" />
          <KpiTile label="Platform NPS" value={String(stats.nps)} hint="Customer satisfaction score" />
        </div>
      </Panel>
      <TwoColumn
        left={
          <Panel title="Tenant Portfolio" subtitle="Schools and colleges onboarded on the platform">
            <div className="space-y-4">
              {tenants.map((tenant) => (
                <RecordCard
                  key={tenant.id}
                  title={tenant.name}
                  subtitle={`${tenant.subdomain} • ${tenant.board} • ${tenant.plan}`}
                  details={[`Students: ${tenant.students}`, `Active Users: ${tenant.activeUsers}`, `Status: ${tenant.status}`]}
                  canManage={canManage}
                  onEdit={() => onEdit(tenant)}
                  onDelete={() => onDelete(tenant.id)}
                  busy={submitting}
                />
              ))}
            </div>
          </Panel>
        }
        right={
          <CrudPanel
            title={editing ? "Edit School / College" : "Add New School / College"}
            subtitle="Create or update a tenant for the platform"
            canManage={canManage}
            editing={editing}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel={editing ? "Save Tenant" : "Create Tenant"}
          >
            <FormGrid>
              <Field label="Institution Name" value={form.name} onChange={(value) => onChange("name", value)} />
              <Field label="Subdomain" value={form.subdomain} onChange={(value) => onChange("subdomain", value)} />
              <Field label="Board" value={form.board} onChange={(value) => onChange("board", value)} />
              <SelectField label="Plan" value={form.plan} options={["Starter", "Growth", "Professional", "Enterprise"]} onChange={(value) => onChange("plan", value)} />
              <SelectField label="Status" value={form.status} options={["Trial", "Active", "Inactive"]} onChange={(value) => onChange("status", value)} />
              <Field label="Students" type="number" value={form.students} onChange={(value) => onChange("students", value)} />
              <Field label="Active Users" type="number" value={form.activeUsers} onChange={(value) => onChange("activeUsers", value)} />
              <Field label="Modules Enabled" type="number" value={form.modules} onChange={(value) => onChange("modules", value)} />
              <Field label="MRR" type="number" value={form.mrr} onChange={(value) => onChange("mrr", value)} />
            </FormGrid>
          </CrudPanel>
        }
      />
      <TwoColumn
        left={
          <Panel title="Feature Flags" subtitle="Operational module switches across tenants">
            <div className="space-y-4">
              {featureFlags.map((flag) => (
                <InfoRow key={flag.name} icon={Flag} title={flag.name} subtitle={`${flag.enabledSchools} schools`} badge={flag.status} />
              ))}
            </div>
          </Panel>
        }
        right={
          <Panel title="Support Tickets" subtitle="Current platform support queue">
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <InfoRow key={ticket.id} icon={Ticket} title={ticket.issue} subtitle={`${ticket.school} • ${ticket.priority}`} badge={ticket.status} />
              ))}
            </div>
          </Panel>
        }
      />
    </section>
  );
}

function OnboardingSection({ onboarding, currentUser }) {
  const steps = [
    "School Profile",
    "Academic Setup",
    "Classes & Sections",
    "Subjects & Curriculum",
    "Staff Setup",
    "Student Import",
    "Fee Structure",
    "Branding",
    "Module Configuration",
    "Go Live"
  ];

  return (
    <section className="mt-6 space-y-6">
      <Panel title="Onboarding Wizard" subtitle="School configuration and activation pipeline for EduCore">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step} className="rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Step {index + 1}</p>
              <p className="mt-2 text-sm font-semibold text-brand-slate">{step}</p>
            </div>
          ))}
        </div>
      </Panel>
      <TwoColumn
        left={
          <Panel title="Active School Setups" subtitle="Current onboarding status by institution">
            <div className="space-y-4">
              {(onboarding || []).map((item) => (
                <RecordCard
                  key={item.id}
                  title={item.institution}
                  subtitle={`${item.step} • ${item.status}`}
                  details={[`Owner: ${item.owner}`, `ETA: ${item.eta}`]}
                />
              ))}
            </div>
          </Panel>
        }
        right={
          <Panel title="Configuration Coverage" subtitle="Core setup areas expected before go-live">
            <div className="grid gap-4">
              <KpiTile label="Academic Calendar" value="Ready" hint="Years, terms, holidays, exam windows" />
              <KpiTile label="Grading Schemes" value="Ready" hint="Percentage, GPA, CGPA, custom grading" />
              <KpiTile label="Attendance Rules" value="Ready" hint="Working hours, periods, shortage threshold" />
              <KpiTile label="Notification Preferences" value="Ready" hint="SMS, email, push, template triggers" />
              <KpiTile label="Languages" value="4" hint="English, Hindi, Marathi, Tamil" />
              <KpiTile label="Reviewed By" value={currentUser?.name || "Admin"} hint="Current portal operator" />
            </div>
          </Panel>
        }
      />
    </section>
  );
}

function StudentsSection({ students, timetable, role, form, editing, canManage, onChange, onDocumentUpload, onSubmit, onEdit, onDelete, onCancel, submitting }) {
  const studentView = role === "student";
  const currentStudent = students[0];
  return (
    <section className="mt-6 space-y-6">
      <TwoColumn
        left={
          <Panel title={studentView ? "My Details" : "Student Information System"} subtitle={studentView ? "Your complete profile, admission details, documents, medical, sibling, transport, and academic history" : "Student profiles, admission records, transport, medical, sibling linkage, and academic history"}>
            <div className="grid gap-5 lg:grid-cols-2">
              {students.map((student) => (
                <div key={student.id} className="rounded-[1.75rem] border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={student.avatar} alt={student.name} className="h-20 w-20 rounded-3xl object-cover" />
                      <div>
                        <p className="text-xl font-semibold">{student.name}</p>
                        <p className="text-sm text-slate-500">{student.className}</p>
                        <p className="text-sm text-slate-500">{student.parentName}</p>
                      </div>
                    </div>
                    <ActionButtons canManage={canManage} onEdit={() => onEdit(student)} onDelete={() => onDelete(student.id)} busy={submitting} />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <InfoChip icon={Ticket} label="Application No." value={student.applicationNo || "-"} />
                    <InfoChip icon={UserSquare2} label="Admission No." value={student.admissionNo} />
                    <InfoChip icon={Briefcase} label="Route" value={student.transportRoute} />
                    <InfoChip icon={FileBadge} label="Performance" value={student.performance} />
                    <InfoChip icon={Receipt} label="Fee Due" value={currency(student.feesDue)} />
                    <InfoChip icon={FolderKanban} label="Documents" value={`${student.documents} files`} />
                    <InfoChip icon={Bell} label="Medical" value={student.medical} />
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2 text-sm text-slate-600">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admission</p>
                      <p className="mt-2 font-semibold">{student.admissionDate || "-"}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sibling Link</p>
                      <p className="mt-2 font-semibold">{student.siblingName ? `${student.siblingName} • ${student.siblingClass}` : "No sibling linked"}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Medical / Blood</p>
                      <p className="mt-2 font-semibold">{student.bloodGroup || "-"} • {student.medical}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Transport / Bus</p>
                      <p className="mt-2 font-semibold">{student.busStop || "-"} • {student.busTrackingStatus || "No live status"}</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-600">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Academic History</p>
                    <p className="mt-2">{student.academicHistory || "No academic history added yet."}</p>
                  </div>
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Subjects For {student.className}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getSubjectsForClass(student.className, timetable).map((subject) => (
                        <span key={`${student.id}-${subject}`} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-brand-blue">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  {(student.documentUploads || []).length ? (
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Uploaded Documents</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {student.documentUploads.map((doc) => (
                          <AttachmentDownloadLink key={`${student.id}-${doc.name}`} label={doc.name} data={doc.data || "data:text/plain;charset=utf-8,"} filename={doc.name} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Panel>
        }
        right={
          studentView ? (
            <Panel title="Student Information" subtitle="Only your personal school record is visible here">
              {currentStudent ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <InfoChip icon={UserSquare2} label="Student Name" value={currentStudent.name} />
                    <InfoChip icon={Ticket} label="Admission No." value={currentStudent.admissionNo} />
                    <InfoChip icon={FileBadge} label="Application No." value={currentStudent.applicationNo || "-"} />
                    <InfoChip icon={Receipt} label="Current Fee Due" value={currency(currentStudent.feesDue)} />
                    <InfoChip icon={Bell} label="Attendance" value={`${currentStudent.attendance}%`} />
                    <InfoChip icon={Briefcase} label="Bus Route" value={currentStudent.transportRoute || "-"} />
                    <InfoChip icon={FolderKanban} label="Bus Tracking" value={currentStudent.busTrackingStatus || "-"} />
                    <InfoChip icon={Ticket} label="TC Issued" value={currentStudent.tcIssued || "No"} />
                    <InfoChip icon={GraduationCap} label="Alumni Status" value={currentStudent.alumniStatus || "Active"} />
                    <InfoChip icon={CheckSquare} label="Promoted To" value={currentStudent.promotedTo || "-"} />
                    <InfoChip icon={FileBadge} label="Emergency Contact" value={currentStudent.emergencyContact || "-"} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Admission Record</p>
                      <div className="mt-3 space-y-2">
                        <p><span className="font-medium text-brand-slate">Admission Date:</span> {currentStudent.admissionDate || "-"}</p>
                        <p><span className="font-medium text-brand-slate">Application No:</span> {currentStudent.applicationNo || "-"}</p>
                        <p><span className="font-medium text-brand-slate">Admission No:</span> {currentStudent.admissionNo || "-"}</p>
                        <p><span className="font-medium text-brand-slate">Class:</span> {currentStudent.className || "-"}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Academic & School Status</p>
                      <div className="mt-3 space-y-2">
                        <p><span className="font-medium text-brand-slate">Performance:</span> {currentStudent.performance || "-"}</p>
                        <p><span className="font-medium text-brand-slate">Sibling Link:</span> {currentStudent.siblingName ? `${currentStudent.siblingName} • ${currentStudent.siblingClass}` : "Not linked"}</p>
                        <p><span className="font-medium text-brand-slate">Medical:</span> {currentStudent.medical || "-"}</p>
                        <p><span className="font-medium text-brand-slate">Blood Group:</span> {currentStudent.bloodGroup || "-"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Academic History</p>
                    <p className="mt-2">{currentStudent.academicHistory || "No academic history available."}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Your student details are not available yet.</div>
              )}
            </Panel>
          ) : (
            <CrudPanel
              title={editing ? "Edit Student" : "Add Student"}
              subtitle="Create or update student profile, admission, academic history, transport, medical, and documents"
              canManage={canManage}
              editing={editing}
              onSubmit={onSubmit}
              onCancel={onCancel}
              submitting={submitting}
              submitLabel={editing ? "Save Student" : "Create Student"}
            >
              <FormGrid>
                <Field label="Student Name" value={form.name} onChange={(value) => onChange("name", value)} />
                <Field label="Application No." value={form.applicationNo} onChange={(value) => onChange("applicationNo", value)} />
                <Field label="Admission No." value={form.admissionNo} onChange={(value) => onChange("admissionNo", value)} />
                <Field label="Class / Section" value={form.className} onChange={(value) => onChange("className", value)} />
                <Field label="Parent Name" value={form.parentName} onChange={(value) => onChange("parentName", value)} />
                <Field label="Admission Date" type="date" value={form.admissionDate} onChange={(value) => onChange("admissionDate", value)} />
                <Field label="Attendance" type="number" value={form.attendance} onChange={(value) => onChange("attendance", value)} />
                <Field label="Performance" value={form.performance} onChange={(value) => onChange("performance", value)} />
                <Field label="Fee Due" type="number" value={form.feesDue} onChange={(value) => onChange("feesDue", value)} />
                <Field label="Transport Route" value={form.transportRoute} onChange={(value) => onChange("transportRoute", value)} />
                <Field label="Bus Stop" value={form.busStop} onChange={(value) => onChange("busStop", value)} />
                <Field label="Bus Tracking Status" value={form.busTrackingStatus} onChange={(value) => onChange("busTrackingStatus", value)} />
                <Field label="Medical Notes" value={form.medical} onChange={(value) => onChange("medical", value)} />
                <Field label="Blood Group" value={form.bloodGroup} onChange={(value) => onChange("bloodGroup", value)} />
                <Field label="Emergency Contact" value={form.emergencyContact} onChange={(value) => onChange("emergencyContact", value)} />
                <Field label="Sibling Name" value={form.siblingName} onChange={(value) => onChange("siblingName", value)} />
                <Field label="Sibling Class" value={form.siblingClass} onChange={(value) => onChange("siblingClass", value)} />
                <SelectField label="TC Issued" value={form.tcIssued} options={["No", "Yes"]} onChange={(value) => onChange("tcIssued", value)} />
                <SelectField label="Alumni Status" value={form.alumniStatus} options={["Active", "Promoted", "Alumni"]} onChange={(value) => onChange("alumniStatus", value)} />
                <Field label="Promoted To" value={form.promotedTo} onChange={(value) => onChange("promotedTo", value)} />
                <Field label="Portal Username" value={form.portalUsername || form.admissionNo} onChange={(value) => onChange("portalUsername", value)} />
                <FileFieldMultiple label="Upload Student Documents" accept=".pdf,.doc,.docx,image/*" onChange={onDocumentUpload} />
                <TextAreaField label="Academic History" value={form.academicHistory} onChange={(value) => onChange("academicHistory", value)} />
              </FormGrid>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                First-time login for new students uses the portal username as the password. If left blank, the admission number is used.
              </div>
            </CrudPanel>
          )
        }
      />
      {!studentView ? (
        <Panel title="Student Operations" subtitle="Bulk import, promotions, TC generation, alumni tracking, and transport visibility">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DownloadLink label="Download Import CSV" content={"name,applicationNo,admissionNo,className,parentName,admissionDate,transportRoute"} filename="student-import-template.csv" />
            <DownloadLink label="Promotion Sheet" content={students.map((item) => `${item.name},${item.className},${item.promotedTo || "-"}`).join("\n")} filename="student-promotion-sheet.csv" />
            <DownloadLink label="TC Register" content={students.map((item) => `${item.name},TC Issued:${item.tcIssued},Alumni:${item.alumniStatus}`).join("\n")} filename="tc-register.txt" />
            <DownloadLink label="Bus Tracking List" content={students.map((item) => `${item.name},${item.transportRoute},${item.busStop || "-"},${item.busTrackingStatus || "-"}`).join("\n")} filename="student-bus-tracking.txt" />
          </div>
        </Panel>
      ) : null}
    </section>
  );
}

function StaffSection({ staff, roles, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting }) {
  return (
    <section className="mt-6 space-y-6">
      <TwoColumn
        left={
          <Panel title="Staff & Teacher Management" subtitle="Profiles, workload, department allocation, and leave balances">
            <div className="grid gap-4 lg:grid-cols-2">
              {staff.map((member) => (
                <div key={member.id} className="rounded-[1.75rem] bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-semibold">{member.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{member.designation}</p>
                      <p className="mt-1 text-sm text-slate-500">{member.department}</p>
                    </div>
                    <ActionButtons canManage={canManage} onEdit={() => onEdit(member)} onDelete={() => onDelete(member.id)} busy={submitting} />
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>Employee ID: {member.employeeId || "-"}</p>
                    <p>Portal Role: {formatRoleLabel(member.portalRole || "teacher")}</p>
                    <p>Qualification: {member.qualification}</p>
                    <p>Workload: {member.workload}</p>
                    <p>Assignments: {member.classes}</p>
                    <p>Leave Balance: {member.leaveBalance} days</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        }
        right={
          <CrudPanel
            title={editing ? "Edit Staff Member" : "Add Staff Member"}
            subtitle="Create or update teachers, accountants, librarians, and support staff"
            canManage={canManage}
            editing={editing}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel={editing ? "Save Staff" : "Create Staff"}
          >
            <FormGrid>
              <Field label="Employee ID" value={form.employeeId} onChange={(value) => onChange("employeeId", value)} />
              <Field label="Name" value={form.name} onChange={(value) => onChange("name", value)} />
              <SelectField
                label="Portal Role"
                value={form.portalRole}
                options={[
                  "school_admin",
                  "principal",
                  "vice_principal",
                  "academic_coordinator",
                  "class_teacher",
                  "subject_teacher",
                  "accountant",
                  "hr_admin",
                  "librarian",
                  "transport_manager",
                  "driver",
                  "support_helpdesk"
                ]}
                onChange={(value) => onChange("portalRole", value)}
              />
              <Field label="Designation" value={form.designation} onChange={(value) => onChange("designation", value)} />
              <Field label="Department" value={form.department} onChange={(value) => onChange("department", value)} />
              <Field label="Qualification" value={form.qualification} onChange={(value) => onChange("qualification", value)} />
              <Field label="Workload" value={form.workload} onChange={(value) => onChange("workload", value)} />
              <Field label="Leave Balance" type="number" value={form.leaveBalance} onChange={(value) => onChange("leaveBalance", value)} />
              <Field label="Class Assignment" value={form.classes} onChange={(value) => onChange("classes", value)} />
              <Field label="Portal Username" value={form.portalUsername} onChange={(value) => onChange("portalUsername", value)} />
            </FormGrid>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              First-time login for new staff uses the portal username as the password.
            </div>
          </CrudPanel>
        }
      />
      <Panel title="Role Matrix" subtitle="School access configuration and role permissions">
        <div className="grid gap-4 lg:grid-cols-2">
          {roles.map((role) => (
            <div key={role.role} className="rounded-[1.75rem] border border-slate-100 bg-white p-5">
              <p className="text-lg font-semibold capitalize">{role.role.replaceAll("_", " ")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span key={permission} className="rounded-full bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function AttendanceSection({ attendance, records, students, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting, role }) {
  const teacherMode = role === "teacher";
  const studentMode = role === "student";
  const primaryClass = attendance.studentSummary?.[0];
  const currentStudent = students[0];
  return (
    <section className="mt-6 space-y-6">
      <Panel title="Attendance Snapshot" subtitle="Daily attendance summary and class status">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiTile label={teacherMode ? "My Class" : studentMode ? "My Class" : "Students Present"} value={teacherMode ? primaryClass?.className || "-" : studentMode ? currentStudent?.className || "-" : String(attendance.todayPresent)} hint={teacherMode ? "Assigned class section" : studentMode ? "Your current class section" : "Live daily count"} />
          <KpiTile label={teacherMode ? "Present" : studentMode ? "My Attendance" : "Students Absent"} value={teacherMode ? String(primaryClass?.present || 0) : studentMode ? `${currentStudent?.attendance || 0}%` : String(attendance.todayAbsent)} hint={teacherMode ? "Today's recorded present count" : studentMode ? "Overall attendance percentage" : "Current absent count"} />
          <KpiTile label={teacherMode ? "Absent" : studentMode ? "Medical Status" : "Staff Present"} value={teacherMode ? String(primaryClass?.absent || 0) : studentMode ? currentStudent?.medical || "-" : String(attendance.staffPresent)} hint={teacherMode ? "Today's absences" : studentMode ? "Personal medical note on file" : "Staff attendance summary"} />
          <KpiTile label={teacherMode ? "Late" : studentMode ? "Bus Tracking" : "Shortage Alerts"} value={teacherMode ? String(primaryClass?.late || 0) : studentMode ? currentStudent?.busTrackingStatus || "No live status" : String(attendance.shortageAlerts)} hint={teacherMode ? "Late arrivals" : studentMode ? "Assigned transport update" : "Below minimum threshold"} />
        </div>
      </Panel>
      <Panel title="Attendance Calendar" subtitle="Date-wise attendance activity calendar">
        <CalendarList
          items={(records || []).map((item) => ({
            id: item.id,
            date: item.date,
            title: item.className,
            description: `Marked by ${item.markedBy || "School staff"}`
          }))}
        />
      </Panel>
      {studentMode ? (
        <TwoColumn
          left={
            <Panel title="My Attendance Record" subtitle="Only your attendance information is visible here">
              {currentStudent ? (
                <div className="space-y-4">
                  <RecordCard
                    title={currentStudent.name}
                    subtitle={`${currentStudent.className} • ${currentStudent.admissionNo}`}
                    details={[
                      `Attendance Percentage: ${currentStudent.attendance}%`,
                      `Performance: ${currentStudent.performance}`,
                      `Fee Due: ${currency(currentStudent.feesDue)}`
                    ]}
                  />
                  <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm text-slate-600">
                    Attendance details are restricted to your personal record only.
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No attendance profile available.</div>
              )}
            </Panel>
          }
          right={
            <Panel title="Recent Attendance Dates" subtitle="Attendance entries logged by the school for your class">
              <div className="space-y-4">
                {(records || []).map((item) => (
                  <div key={item.id} className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-brand-slate">{item.date}</p>
                    <p className="mt-1">{item.className}</p>
                    <p className="mt-2 text-slate-500">Recorded by {item.markedBy || "School staff"}</p>
                  </div>
                ))}
                {!(records || []).length ? <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No attendance entries available.</div> : null}
              </div>
            </Panel>
          }
        />
      ) : (
        <>
          <TwoColumn
            left={
              <Panel title="Daily Attendance Register" subtitle="Create and review attendance records by date">
                <div className="space-y-4">
                  {(records || []).map((item) => (
                    <RecordCard
                      key={item.id}
                      title={`${item.className} • ${item.date}`}
                      subtitle={`Marked by ${item.markedBy || "Staff"}`}
                      details={[`Present: ${item.present}`, `Absent: ${item.absent}`, `Late: ${item.late}`]}
                      canManage={canManage}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item.id)}
                      busy={submitting}
                    />
                  ))}
                </div>
              </Panel>
            }
            right={
              <CrudPanel
                title={editing ? "Edit Attendance Entry" : "Mark Attendance"}
                subtitle="Create a new daily attendance entry for your class"
                canManage={canManage}
                editing={editing}
                onSubmit={onSubmit}
                onCancel={onCancel}
                submitting={submitting}
                submitLabel={editing ? "Save Attendance" : "Create Attendance"}
              >
                <FormGrid>
                  <Field label="Class" value={form.className} onChange={(value) => onChange("className", value)} />
                  <Field label="Date" type="date" value={form.date} onChange={(value) => onChange("date", value)} />
                  <Field label="Present" type="number" value={form.present} onChange={(value) => onChange("present", value)} />
                  <Field label="Absent" type="number" value={form.absent} onChange={(value) => onChange("absent", value)} />
                  <Field label="Late" type="number" value={form.late} onChange={(value) => onChange("late", value)} />
                  <Field label="Marked By" value={form.markedBy} onChange={(value) => onChange("markedBy", value)} />
                </FormGrid>
              </CrudPanel>
            }
          />
          <Panel title="Student Details" subtitle="Students in class with academic and fee status">
            <div className="grid gap-4 lg:grid-cols-2">
              {(students || []).map((student) => (
                <RecordCard
                  key={student.id}
                  title={student.name}
                  subtitle={`${student.className} • ${student.admissionNo}`}
                  details={[`Attendance: ${student.attendance}%`, `Performance: ${student.performance}`, `Fee Due: ${currency(student.feesDue)}`]}
                />
              ))}
            </div>
          </Panel>
        </>
      )}
    </section>
  );
}

function TimetableSection({ timetable, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting, role }) {
  const timetableClasses = [...new Set((timetable || []).map((item) => item.className))];
  return (
    <section className="mt-6 space-y-6">
      <Panel title="Weekly Timetable Calendar" subtitle="Class-wise weekly timetable with download support">
        {timetableClasses.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {timetableClasses.map((className) => (
              <div key={className} className="rounded-[1.75rem] bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-brand-slate">{className}</p>
                    <p className="text-sm text-slate-500">Weekly class schedule</p>
                  </div>
                  <DownloadLink
                    label="Download Timetable"
                    content={buildWeeklyTimetableContent(className, timetable)}
                    filename={`${className.toLowerCase().replaceAll(" ", "-")}-weekly-timetable.txt`}
                  />
                </div>
                <div className="mt-4">
                  <CalendarList
                    items={(timetable || [])
                      .filter((item) => item.className === className)
                      .map((item) => ({
                        id: item.id,
                        date: item.day,
                        title: `${item.period} • ${item.subject}`,
                        description: `${item.teacher} • Room ${item.room || "-"}`
                      }))}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No timetable entries available.</div>
        )}
      </Panel>
      <TwoColumn
        left={
          <Panel title="Timetable Entries" subtitle="Published class and subject timetable rows">
            <SimpleTable
              columns={["Class", "Day", "Period", "Subject", "Teacher", "Room"]}
              rows={(timetable || []).map((item) => [item.className, item.day, item.period, item.subject, item.teacher, item.room || "-"])}
            />
          </Panel>
        }
        right={
          <CrudPanel
            title={editing ? "Edit Timetable Entry" : "Create Timetable Entry"}
            subtitle={role === "teacher" ? "Timetable is managed by school administration" : "Create or update weekly timetable rows"}
            canManage={canManage}
            editing={editing}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel={editing ? "Save Timetable" : "Create Timetable"}
          >
            <FormGrid>
              <Field label="Class" value={form.className} onChange={(value) => onChange("className", value)} />
              <SelectField label="Day" value={form.day} options={weekDays.slice(0, 5)} onChange={(value) => onChange("day", value)} />
              <Field label="Period" value={form.period} onChange={(value) => onChange("period", value)} />
              <Field label="Subject" value={form.subject} onChange={(value) => onChange("subject", value)} />
              <Field label="Teacher" value={form.teacher} onChange={(value) => onChange("teacher", value)} />
              <Field label="Room" value={form.room} onChange={(value) => onChange("room", value)} />
            </FormGrid>
            <div className="mt-6 grid gap-4">
              {(timetable || []).slice(0, 6).map((item) => (
                <RecordCard
                  key={item.id}
                  title={`${item.className} • ${item.day}`}
                  subtitle={`${item.period} • ${item.subject}`}
                  details={[`Teacher: ${item.teacher}`, `Room: ${item.room || "-"}`]}
                  canManage={canManage}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item.id)}
                  busy={submitting}
                />
              ))}
            </div>
          </CrudPanel>
        }
      />
    </section>
  );
}

function ExamsSection({
  exams,
  results,
  timetable,
  form,
  resultForm,
  timetableForm,
  editingExam,
  editingResult,
  editingTimetable,
  canManage,
  canApproveResults,
  onExamChange,
  onResultChange,
  onTimetableChange,
  onTimetableSubmit,
  onExamFileChange,
  onExamSubmit,
  onResultSubmit,
  onEditExam,
  onDeleteExam,
  onCancelExam,
  onEditTimetable,
  onDeleteTimetable,
  onCancelTimetable,
  onEditResult,
  onDeleteResult,
  onCancelResult,
  submitting,
  role
}) {
  const timetableClasses = [...new Set((timetable || []).map((item) => item.className))];
  return (
    <section className="mt-6 space-y-6">
      <TwoColumn
        left={
          <Panel title="Exam Timetable" subtitle="Uploaded exam schedules with download support">
            <div className="space-y-4">
              {exams.map((exam) => (
                <RecordCard
                  key={exam.id}
                  title={`${exam.name} • ${exam.className}`}
                  subtitle={`${exam.schedule} • Uploaded by ${exam.uploadedBy || "Management"}`}
                  details={[`File: ${exam.fileName || "Not attached"}`, `Hall Tickets: ${exam.hallTickets}`, `Result Status: ${exam.resultStatus}`]}
                  canManage={canManage}
                    onEdit={() => onEditExam(exam)}
                    onDelete={() => onDeleteExam(exam.id)}
                    busy={submitting === "exam"}
                    actions={
                      exam.fileData ? (
                        <AttachmentDownloadLink
                          label="Download File"
                          data={exam.fileData}
                          filename={exam.fileName || `${exam.name}.pdf`}
                        />
                      ) : (
                        <DownloadLink
                          label="Download Timetable"
                          content={`Exam: ${exam.name}\nClass: ${exam.className}\nSchedule: ${exam.schedule}\nExam Date: ${exam.examDate || "-"}\nUploaded By: ${exam.uploadedBy || "Management"}`}
                          filename={exam.fileName || `${exam.name}.txt`}
                        />
                      )
                    }
                  />
                ))}
              </div>
            </Panel>
          }
          right={
            <CrudPanel
              title={editingExam ? "Update Exam Timetable" : "Upload Exam Timetable"}
              subtitle="Management uploads and updates exam schedules"
              canManage={canManage}
              editing={editingExam}
              onSubmit={onExamSubmit}
              onCancel={onCancelExam}
              submitting={submitting === "exam"}
              submitLabel={editingExam ? "Save Exam" : "Upload Timetable"}
            >
              <FormGrid>
                <Field label="Exam Name" value={form.name} onChange={(value) => onExamChange("name", value)} />
                <Field label="Class" value={form.className} onChange={(value) => onExamChange("className", value)} />
                <Field label="Schedule" value={form.schedule} onChange={(value) => onExamChange("schedule", value)} />
                <Field label="Exam Date" type="date" value={form.examDate} onChange={(value) => onExamChange("examDate", value)} />
                <Field label="File Name" value={form.fileName} onChange={(value) => onExamChange("fileName", value)} />
                <FileField label="Upload PDF / Image / DOCX" accept=".pdf,.doc,.docx,image/*" onChange={onExamFileChange} />
                <SelectField label="Hall Tickets" value={form.hallTickets} options={["Draft", "Ready"]} onChange={(value) => onExamChange("hallTickets", value)} />
                <SelectField label="Result Status" value={form.resultStatus} options={["Pending", "Processing", "Published"]} onChange={(value) => onExamChange("resultStatus", value)} />
              </FormGrid>
            </CrudPanel>
          }
        />
      <TwoColumn
        left={
          <Panel title="Weekly Class Timetable" subtitle="Week-wise lecture schedule with downloadable format for each class">
            <div className="space-y-4">
              {timetableClasses.map((className) => {
                const classRows = timetable.filter((item) => item.className === className);
                return (
                  <div key={className} className="rounded-[1.75rem] border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">{className}</p>
                        <p className="mt-1 text-sm text-slate-500">Complete weekly lecture plan with all mapped subjects</p>
                      </div>
                      <DownloadLink
                        label="Download Weekly Timetable"
                        content={buildWeeklyTimetableContent(className, timetable)}
                        filename={`${className.toLowerCase().replaceAll(" ", "-")}-weekly-timetable.txt`}
                      />
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      {weekDays
                        .filter((day) => classRows.some((item) => item.day === day))
                        .map((day) => (
                          <div key={`${className}-${day}`} className="rounded-2xl bg-white p-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{day}</p>
                            <div className="mt-3 space-y-2 text-sm text-slate-600">
                              {classRows
                                .filter((item) => item.day === day)
                                .map((item) => (
                                  <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 px-3 py-3">
                                    <div>
                                      <p className="font-semibold text-brand-slate">{item.subject}</p>
                                      <p>{item.period}</p>
                                    </div>
                                    <div className="text-right">
                                      <p>{item.teacher || "Teacher"}</p>
                                      <p className="text-slate-400">{item.room || "-"}</p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        }
        right={
          <CrudPanel
            title={editingTimetable ? "Edit Weekly Timetable Entry" : "Add Weekly Timetable Entry"}
            subtitle="Management maintains the school timetable used by teachers and students"
            canManage={canManage}
            editing={editingTimetable}
            onSubmit={onTimetableSubmit}
            onCancel={onCancelTimetable}
            submitting={submitting === "timetable"}
            submitLabel={editingTimetable ? "Save Timetable Entry" : "Create Timetable Entry"}
          >
            <FormGrid>
              <Field label="Class" value={timetableForm.className} onChange={(value) => onTimetableChange("className", value)} />
              <SelectField label="Day" value={timetableForm.day} options={weekDays.slice(0, 5)} onChange={(value) => onTimetableChange("day", value)} />
              <Field label="Period" value={timetableForm.period} onChange={(value) => onTimetableChange("period", value)} />
              <Field label="Subject" value={timetableForm.subject} onChange={(value) => onTimetableChange("subject", value)} />
              <Field label="Teacher" value={timetableForm.teacher} onChange={(value) => onTimetableChange("teacher", value)} />
              <Field label="Room" value={timetableForm.room} onChange={(value) => onTimetableChange("room", value)} />
            </FormGrid>
            <div className="mt-5 space-y-3">
              {(timetable || []).map((item) => (
                <RecordCard
                  key={item.id}
                  title={`${item.className} • ${item.day}`}
                  subtitle={`${item.subject} • ${item.period}`}
                  details={[`Teacher: ${item.teacher || "-"}`, `Room: ${item.room || "-"}`]}
                  canManage={canManage}
                  onEdit={() => onEditTimetable(item)}
                  onDelete={() => onDeleteTimetable(item.id)}
                  busy={submitting === "timetable"}
                />
              ))}
            </div>
          </CrudPanel>
        }
      />
      <TwoColumn
        left={
          <Panel title="Results Approval" subtitle="Management approves and publishes exam results">
            <div className="space-y-4">
              {results.map((item) => (
                <RecordCard
                  key={item.id}
                  title={`${item.student} • ${item.exam}`}
                  subtitle={`${item.className} • ${item.approvalStatus}`}
                  details={[`Percentage: ${item.percentage}%`, `Grade: ${item.grade}`, `Rank: #${item.rank}`, `Approved By: ${item.approvedBy || "Pending"}`]}
                  canManage={canApproveResults}
                  onEdit={() => onEditResult(item)}
                  onDelete={() => onDeleteResult(item.id)}
                  busy={submitting === "result"}
                />
              ))}
            </div>
          </Panel>
        }
        right={
          <CrudPanel
            title={editingResult ? "Update Result" : "Create Result"}
            subtitle="Management controls result approval and publishing"
            canManage={canApproveResults}
            editing={editingResult}
            onSubmit={onResultSubmit}
            onCancel={onCancelResult}
            submitting={submitting === "result"}
            submitLabel={editingResult ? "Save Result" : "Create Result"}
          >
            <FormGrid>
              <Field label="Student" value={resultForm.student} onChange={(value) => onResultChange("student", value)} />
              <Field label="Class" value={resultForm.className} onChange={(value) => onResultChange("className", value)} />
              <Field label="Exam" value={resultForm.exam} onChange={(value) => onResultChange("exam", value)} />
              <Field label="Percentage" type="number" value={resultForm.percentage} onChange={(value) => onResultChange("percentage", value)} />
              <Field label="Grade" value={resultForm.grade} onChange={(value) => onResultChange("grade", value)} />
              <Field label="Rank" type="number" value={resultForm.rank} onChange={(value) => onResultChange("rank", value)} />
              <SelectField label="Approval Status" value={resultForm.approvalStatus} options={["Pending", "Approved", "Published"]} onChange={(value) => onResultChange("approvalStatus", value)} />
              <Field label="Approved By" value={resultForm.approvedBy} onChange={(value) => onResultChange("approvedBy", value)} />
            </FormGrid>
          </CrudPanel>
        }
      />
    </section>
  );
}

function FeesSection({ fees, stats, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting, role, onStudentPay }) {
  const teacherMode = role === "teacher";
  const studentMode = role === "student";
  const totalStudents = new Set((fees || []).map((item) => item.studentName).filter(Boolean)).size;
  const totalPaid = (fees || []).reduce((sum, item) => sum + Number(item.paid || 0), 0);
  const totalPending = (fees || []).reduce((sum, item) => sum + Number(item.pending || 0), 0);
  const totalAmount = (fees || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return (
    <section className="mt-6 space-y-6">
      <Panel title={teacherMode ? "Student Fee Status" : studentMode ? "My Fee Management" : "Fee Management"} subtitle={teacherMode ? "Teachers can view payment progress of their class students" : studentMode ? "Track what you have paid, what is pending, and download receipts" : "Revenue, collections, dues, and receipt-ready records"}>
        <div className="grid gap-4 md:grid-cols-3">
          <KpiTile label={teacherMode ? "Students In Ledger" : studentMode ? "Total Fee" : "Collected"} value={teacherMode ? String(totalStudents) : studentMode ? currency(totalAmount) : currency(stats.feesCollected)} hint={teacherMode ? "Students mapped to your class" : studentMode ? "All fee heads assigned to you" : "Online + offline collections"} />
          <KpiTile label={teacherMode ? "Collected" : "Pending"} value={teacherMode ? currency(totalPaid) : studentMode ? currency(totalPending) : currency(stats.feesPending)} hint={teacherMode ? "Paid amount for your class" : studentMode ? "Remaining amount to be paid" : "Includes overdue balances"} />
          <KpiTile label={teacherMode ? "Remaining" : studentMode ? "Paid" : "Coverage"} value={teacherMode ? currency(totalPending) : studentMode ? currency(totalPaid) : stats.feeCollectionCoverage} hint={teacherMode ? "Outstanding fee amount" : studentMode ? "Amount already paid" : "Schools collecting via platform"} />
        </div>
      </Panel>
      {studentMode ? (
        <Panel title="My Fee Ledger" subtitle="Only your fee records are visible here">
          <div className="space-y-4">
            {fees.map((item) => (
              <RecordCard
                key={item.id}
                title={item.category}
                subtitle={`${item.className} • Due ${item.dueDate}`}
                details={[
                  `Amount: ${currency(item.amount)}`,
                  `Paid: ${currency(item.paid)}`,
                  `Remaining: ${currency(item.pending)}`,
                  `Status: ${item.status}`
                ]}
                actions={
                  <div className="flex flex-wrap gap-2">
                    <DownloadLink
                      label="Fee Receipt"
                      content={buildReceiptContent(item)}
                      filename={`${(item.studentName || "student").toLowerCase().replaceAll(" ", "-")}-fee-receipt.html`}
                      mimeType="text/html"
                    />
                    {Number(item.pending || 0) > 0 ? (
                      <button
                        type="button"
                        onClick={() => onStudentPay(item)}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-blue disabled:opacity-60"
                      >
                        <CreditCard size={16} />
                        {submitting ? "Processing..." : "Pay Now"}
                      </button>
                    ) : null}
                  </div>
                }
              />
            ))}
            {!fees.length ? <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No fee records are available for your account.</div> : null}
          </div>
        </Panel>
      ) : teacherMode ? (
        <Panel title="Class Fee Ledger" subtitle="Track paid and pending fees for students in your class">
          <div className="space-y-4">
            {fees.map((item) => (
              <RecordCard
                key={item.id}
                title={`${item.studentName || "Student"} • ${item.category}`}
                subtitle={`${item.className} • Due ${item.dueDate}`}
                details={[`Amount: ${currency(item.amount)}`, `Paid: ${currency(item.paid)}`, `Pending: ${currency(item.pending)}`, `Status: ${item.status}`]}
                actions={
                  <DownloadLink
                    label="Fee Receipt"
                    content={buildReceiptContent(item)}
                    filename={`${(item.studentName || "student").toLowerCase().replaceAll(" ", "-")}-fee-receipt.html`}
                    mimeType="text/html"
                  />
                }
              />
            ))}
          </div>
        </Panel>
      ) : (
        <TwoColumn
          left={
            <Panel title="Fee Ledger" subtitle="Student and class-wise fee status">
              <div className="space-y-4">
                {fees.map((item) => (
                  <RecordCard
                    key={item.id}
                    title={`${item.studentName || "Student"} • ${item.category}`}
                    subtitle={`${item.className} • Due ${item.dueDate}`}
                    details={[`Amount: ${currency(item.amount)}`, `Paid: ${currency(item.paid)}`, `Pending: ${currency(item.pending)}`, `Status: ${item.status}`]}
                    canManage={canManage}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item.id)}
                    busy={submitting}
                    actions={
                      <DownloadLink
                        label="Fee Receipt"
                        content={buildReceiptContent(item)}
                        filename={`${(item.studentName || "student").toLowerCase().replaceAll(" ", "-")}-fee-receipt.html`}
                        mimeType="text/html"
                      />
                    }
                  />
                ))}
              </div>
            </Panel>
          }
          right={
            <CrudPanel
              title={editing ? "Edit Fee Record" : "Create Fee Record"}
              subtitle="Add or update fee structures and collection records"
              canManage={canManage}
              editing={editing}
              onSubmit={onSubmit}
              onCancel={onCancel}
              submitting={submitting}
              submitLabel={editing ? "Save Fee" : "Create Fee"}
            >
              <FormGrid>
                <Field label="Student Name" value={form.studentName} onChange={(value) => onChange("studentName", value)} />
                <Field label="Category" value={form.category} onChange={(value) => onChange("category", value)} />
                <Field label="Class" value={form.className} onChange={(value) => onChange("className", value)} />
                <Field label="Due Date" type="date" value={form.dueDate} onChange={(value) => onChange("dueDate", value)} />
                <Field label="Amount" type="number" value={form.amount} onChange={(value) => onChange("amount", value)} />
                <Field label="Paid" type="number" value={form.paid} onChange={(value) => onChange("paid", value)} />
                <Field label="Pending" type="number" value={form.pending} onChange={(value) => onChange("pending", value)} />
                <SelectField label="Status" value={form.status} options={["Pending", "Partial", "Paid"]} onChange={(value) => onChange("status", value)} />
              </FormGrid>
            </CrudPanel>
          }
        />
      )}
    </section>
  );
}

function HomeworkSection({ homework, form, editing, canManage, onChange, onAttachmentChange, onSubmit, onEdit, onDelete, onCancel, submitting, role, onStudentSubmit }) {
  const studentMode = role === "student";
  return (
    <section className="mt-6 space-y-6">
      <TwoColumn
        left={
          <Panel title={studentMode ? "My Homework" : "Homework Management"} subtitle={studentMode ? "Download homework files and submit online assignments" : "Online and offline homework with completion tracking"}>
            <div className="grid gap-4 lg:grid-cols-2">
              {homework.map((item) => (
                <div key={item.id} className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{item.subject}</p>
                      <p className="mt-2 text-xl font-semibold">{item.title}</p>
                    </div>
                    <ActionButtons canManage={canManage} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} busy={submitting} />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MetricTile label="Class" value={item.className} soft />
                    <MetricTile label="Mode" value={item.mode || "Offline"} soft />
                    <MetricTile label="Due" value={item.dueDate} soft />
                    <MetricTile label="Status" value={item.completionStatus || item.status} soft />
                  </div>
                  {item.attachmentData ? (
                    <div className="mt-4">
                      <AttachmentDownloadLink
                        label={item.attachmentName ? `Download ${item.attachmentName}` : "Download Homework File"}
                        data={item.attachmentData}
                        filename={item.attachmentName || `${item.title.toLowerCase().replaceAll(" ", "-")}.pdf`}
                      />
                    </div>
                  ) : null}
                  {studentMode ? (
                    <StudentHomeworkSubmissionCard item={item} busy={submitting} onSubmit={onStudentSubmit} />
                  ) : item.mode === "Online" ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-slate-500">Student submission: {item.studentSubmission || "Awaiting file upload"}</p>
                      {item.studentSubmissionData ? (
                        <AttachmentDownloadLink
                          label="Download Student Submission"
                          data={item.studentSubmissionData}
                          filename={item.studentSubmission || "student-submission"}
                        />
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">Offline homework can be marked completed by the teacher.</p>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        }
        right={
          studentMode ? (
            <Panel title="Homework Instructions" subtitle="Download offline work or submit online assignments with documents">
              <div className="space-y-4">
                <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm text-slate-600">
                  Students can only see and submit their own homework items. For online mode, upload a PDF, DOC, DOCX, or image after completing the work.
                </div>
              </div>
            </Panel>
          ) : (
            <CrudPanel
              title={editing ? "Edit Homework" : "Create Homework"}
              subtitle="Assign online or offline homework and track completion"
              canManage={canManage}
              editing={editing}
              onSubmit={onSubmit}
              onCancel={onCancel}
              submitting={submitting}
              submitLabel={editing ? "Save Homework" : "Create Homework"}
            >
              <FormGrid>
                <Field label="Subject" value={form.subject} onChange={(value) => onChange("subject", value)} />
                <Field label="Class" value={form.className} onChange={(value) => onChange("className", value)} />
                <Field label="Title" value={form.title} onChange={(value) => onChange("title", value)} />
                <Field label="Due Date" type="date" value={form.dueDate} onChange={(value) => onChange("dueDate", value)} />
                <SelectField label="Mode" value={form.mode} options={["Online", "Offline"]} onChange={(value) => onChange("mode", value)} />
                <Field label="Attachment Name" value={form.attachmentName} onChange={(value) => onChange("attachmentName", value)} />
                <FileField label="Upload Homework File" accept=".pdf,.doc,.docx,image/*" onChange={onAttachmentChange} />
                <Field label="Student Submission" value={form.studentSubmission} onChange={(value) => onChange("studentSubmission", value)} />
                <SelectField label="Completion Status" value={form.completionStatus} options={["Pending", "Pending Review", "Completed"]} onChange={(value) => onChange("completionStatus", value)} />
                <Field label="Submissions" type="number" value={form.submissions} onChange={(value) => onChange("submissions", value)} />
                <Field label="Total Students" type="number" value={form.totalStudents} onChange={(value) => onChange("totalStudents", value)} />
                <SelectField label="Status" value={form.status} options={["Active", "Closed", "Draft"]} onChange={(value) => onChange("status", value)} />
              </FormGrid>
            </CrudPanel>
          )
        }
      />
    </section>
  );
}

function CommunicationSection({ announcements, form, editing, canManage, onChange, onFileChange, onSubmit, onEdit, onDelete, onCancel, submitting, role }) {
  const viewerMode = role === "parent" || role === "student";
  return (
    <section className="mt-6 space-y-6">
      <Panel title="Notification Calendar" subtitle="Date-wise notice and circular schedule">
        <CalendarList
          items={announcements.map((item) => ({
            id: item.id,
            date: item.date,
            title: item.title,
            description: viewerMode ? item.type : item.audience
          }))}
        />
      </Panel>
      {viewerMode ? (
        <Panel title="School Notices" subtitle="Circulars and announcements shared by the school">
              <div className="grid gap-4 lg:grid-cols-2">
                {announcements.map((item) => (
                  <div key={item.id} className="rounded-[1.75rem] bg-slate-50 p-5">
                    <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-white">{item.status}</span>
                    <p className="mt-4 text-xl font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.audience} • {item.date}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">Targets: {(item.targetRoles || []).map(formatRoleLabel).join(", ") || "All"}</p>
                    {item.documentName ? <p className="mt-2 text-sm font-medium text-brand-blue">Document: {item.documentName}</p> : null}
                    <p className="mt-4 text-sm leading-6 text-slate-600">{item.content}</p>
                  </div>
                ))}
              </div>
            </Panel>
      ) : (
        <TwoColumn
          left={
            <Panel title="Notification & Communication" subtitle="Broadcast circulars, announcements, and delivery workflows">
              <div className="grid gap-4 lg:grid-cols-2">
                {announcements.map((item) => (
                  <div key={item.id} className="rounded-[1.75rem] bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-white">{item.status}</span>
                      <ActionButtons canManage={canManage} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} busy={submitting} />
                    </div>
                    <p className="mt-4 text-xl font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.audience} • {item.date}</p>
                    {item.deliveryMode || item.scheduledAt ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                        {item.deliveryMode || "Instant"}{item.scheduledAt ? ` • ${item.scheduledAt}` : ""}
                      </p>
                    ) : null}
                    {item.documentName ? <p className="mt-2 text-sm font-medium text-brand-blue">Document: {item.documentName}</p> : null}
                    <p className="mt-4 text-sm leading-6 text-slate-600">{item.content}</p>
                    <div className="mt-4">
                      {item.documentData ? (
                        <AttachmentDownloadLink
                          label={item.documentName ? "Download Uploaded Document" : "Download Attachment"}
                          data={item.documentData}
                          filename={item.documentName || `${item.title.toLowerCase().replaceAll(" ", "-")}.txt`}
                        />
                      ) : (
                        <DownloadLink
                          label={item.documentName ? "Download Notice Document" : "Download Notice"}
                          content={buildAnnouncementDocument(item)}
                          filename={item.documentName || `${item.title.toLowerCase().replaceAll(" ", "-")}.txt`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          }
          right={
            <CrudPanel
              title={editing ? "Edit Announcement" : "Create Announcement"}
              subtitle="Publish a circular or notice for dashboard and web users"
              canManage={canManage}
              editing={editing}
              onSubmit={onSubmit}
              onCancel={onCancel}
              submitting={submitting}
              submitLabel={editing ? "Save Announcement" : "Publish Announcement"}
            >
              <FormGrid>
                <Field label="Title" value={form.title} onChange={(value) => onChange("title", value)} />
                <Field label="Audience" value={form.audience} onChange={(value) => onChange("audience", value)} />
                <SelectField label="Type" value={form.type} options={["Holiday Circular", "Urgent Closure", "Fee Due Reminder", "General Circular"]} onChange={(value) => onChange("type", value)} />
                <SelectField label="Delivery Mode" value={form.deliveryMode} options={["Instant", "Scheduled"]} onChange={(value) => onChange("deliveryMode", value)} />
                <Field label="Date" type="date" value={form.date} onChange={(value) => onChange("date", value)} />
                <Field label="Schedule Date & Time" type="datetime-local" value={form.scheduledAt} onChange={(value) => onChange("scheduledAt", value)} />
                <Field label="Document Name" value={form.documentName} onChange={(value) => onChange("documentName", value)} />
                <FileField label="Upload PDF / Image / DOCX" accept=".pdf,.doc,.docx,image/*" onChange={onFileChange} />
                <TextAreaField label="Content" value={form.content} onChange={(value) => onChange("content", value)} />
                <SelectField label="Status" value={form.status} options={["Published", "Draft"]} onChange={(value) => onChange("status", value)} />
              </FormGrid>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Role-Based Targeting</p>
                <div className="grid gap-2">
                  {notificationTargetOptions.map((option) => {
                    const active = (form.targetRoles || []).includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          onChange(
                            "targetRoles",
                            active ? (form.targetRoles || []).filter((item) => item !== option.id) : [...(form.targetRoles || []), option.id]
                          )
                        }
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                          active ? "border-brand-blue bg-brand-paper text-brand-blue" : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        <span>{option.label}</span>
                        <span>{active ? "Selected" : "Select"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CrudPanel>
          }
        />
      )}
    </section>
  );
}

function LibrarySection({ library, role }) {
  const viewerMode = role !== "librarian" && role !== "school_admin" && role !== "super_admin";
  return (
    <section className="mt-6">
      <Panel title={viewerMode ? "Library Records" : "Library Management"} subtitle={viewerMode ? "Issued books and due dates" : "Book catalogue, issue-return history, and due dates"}>
        <SimpleTable columns={["Title", "ISBN", "Issued To", "Due Date", "Status"]} rows={library.map((book) => [book.title, book.isbn, book.issuedTo, book.dueDate, book.status])} />
      </Panel>
    </section>
  );
}

function TransportSection({ transport, role }) {
  const parentView = role === "parent";
  const staffView = role === "transport_staff";
  return (
    <section className="mt-6">
      <Panel
        title={parentView ? "Assigned Transport" : staffView ? "Transport Desk" : "Transport Management"}
        subtitle={parentView ? "Your child's route and ETA details" : staffView ? "Route, vehicle, and ETA tracking" : "Route, vehicle, driver, student count, and ETA tracking"}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {transport.map((route) => (
            <div key={route.id} className="rounded-[1.75rem] bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold">{route.route}</p>
                  <p className="text-sm text-slate-500">{route.vehicle}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-blue">{route.status}</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <MetricTile label="Driver" value={route.driver} soft />
                <MetricTile label="Students" value={String(route.students)} soft />
                <MetricTile label="ETA" value={route.eta} soft />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p><span className="font-medium text-brand-slate">Driver Phone:</span> {route.driverPhone || "-"}</p>
                <p className="mt-1"><span className="font-medium text-brand-slate">Conductor:</span> {route.conductor || "-"}</p>
                <p className="mt-1"><span className="font-medium text-brand-slate">Conductor Phone:</span> {route.conductorPhone || "-"}</p>
                <p className="mt-1"><span className="font-medium text-brand-slate">GPS:</span> {route.gpsStatus || "-"}</p>
                <p className="mt-1"><span className="font-medium text-brand-slate">Current Location:</span> {route.currentLocation || "-"}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function ContentSection({ content, role }) {
  return (
    <section className="mt-6">
      <Panel title={role === "student" ? "Study Material" : "Academic Content & Syllabus"} subtitle={role === "student" ? "Chapter progress and learning resources" : "Subject chapters, completion tracking, and learning resources"}>
        <div className="grid gap-4 lg:grid-cols-2">
          {content.map((item) => (
            <div key={item.id} className="rounded-[1.75rem] border border-slate-100 bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{item.subject} • {item.className}</p>
              <p className="mt-2 text-xl font-semibold">{item.chapter}</p>
              <div className="mt-5 rounded-full bg-slate-100 p-1">
                <div className="rounded-full bg-brand-blue px-3 py-2 text-right text-xs font-semibold text-white" style={{ width: `${item.completion}%` }}>
                  {item.completion}%
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-500">{item.resources} study resources available</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function ReportsSection({ reports, stats, role }) {
  return (
    <section className="mt-6 space-y-6">
      <Panel title={role === "accountant" ? "Finance Reports" : "Reports & Analytics"} subtitle={role === "accountant" ? "Collection, dues, and report exports" : "Academic and administrative reporting with exports and schedules"}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiTile label="Announcements" value={String(stats.announcements)} hint="Published notices and circulars" />
          <KpiTile label="Assignments" value={String(stats.activeAssignments)} hint="Currently active homework items" />
          <KpiTile label="Pending Leaves" value={String(stats.pendingLeaves)} hint="Awaiting approvals" />
          <KpiTile label="API P95" value={stats.apiP95} hint="System health benchmark" />
        </div>
      </Panel>
      <Panel title={role === "accountant" ? "Report Exports" : "Scheduled Reports"} subtitle={role === "accountant" ? "Finance-ready export schedule" : "Export-ready reporting for principals, finance teams, and admins"}>
        <SimpleTable columns={["Report", "Schedule", "Format", "Owner"]} rows={reports.map((item) => [item.report, item.schedule, item.format, item.owner])} />
      </Panel>
    </section>
  );
}

function SupportSection({ tickets, currentUser }) {
  const [supportForm, setSupportForm] = useState({
    issue: "",
    description: "",
    priority: "Medium"
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      await createSupportTicket({
        requester: currentUser?.name || "Portal User",
        requesterRole: formatRoleLabel(currentUser?.role),
        issue: supportForm.issue,
        description: supportForm.description,
        priority: supportForm.priority,
        status: "Open"
      });
      window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 space-y-6">
      <Panel title="Help & Support" subtitle="Client handover support desk, issue queue, and product guidance">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiTile label="Open Tickets" value={String((tickets || []).filter((item) => item.status === "Open").length)} hint="Active support items" />
          <KpiTile label="In Progress" value={String((tickets || []).filter((item) => item.status === "In Progress").length)} hint="Current investigations" />
          <KpiTile label="Support Contact" value="Live" hint="Email and WhatsApp handover support" />
          <KpiTile label="Logged In As" value={formatRoleLabel(currentUser?.role)} hint={currentUser?.name || "Portal user"} />
        </div>
      </Panel>
      <TwoColumn
        left={
          <Panel title="Support Queue" subtitle="Current help desk items and implementation notes">
            <div className="space-y-4">
              {(tickets || []).map((ticket) => (
                <RecordCard
                  key={ticket.id}
                  title={ticket.issue}
                  subtitle={`${ticket.school} • ${ticket.priority}`}
                  details={[`Status: ${ticket.status}`]}
                />
              ))}
            </div>
          </Panel>
        }
        right={
          <Panel title="Support Channels" subtitle="Reference channels for launch and client handover">
            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-[1.75rem] bg-slate-50 p-5">
                <p className="font-semibold text-brand-slate">Email Support</p>
                <p className="mt-2">support@educore.app</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-50 p-5">
                <p className="font-semibold text-brand-slate">Launch Checklist</p>
                <p className="mt-2">Validate user creation, fee receipts, homework submissions, timetable downloads, and notifications before client handover.</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-50 p-5">
                <p className="font-semibold text-brand-slate">Deployment Note</p>
                <p className="mt-2">SMS, OTP, and live GPS features are integration-ready and should be connected with production provider credentials during deployment.</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-50 p-5">
                <p className="font-semibold text-brand-slate">Raise Support Request</p>
                <div className="mt-4 space-y-3">
                  <Field label="Issue" value={supportForm.issue} onChange={(value) => setSupportForm((current) => ({ ...current, issue: value }))} />
                  <SelectField
                    label="Priority"
                    value={supportForm.priority}
                    options={["Low", "Medium", "High"]}
                    onChange={(value) => setSupportForm((current) => ({ ...current, priority: value }))}
                  />
                  <TextAreaField label="Description" value={supportForm.description} onChange={(value) => setSupportForm((current) => ({ ...current, description: value }))} />
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving || !supportForm.issue || !supportForm.description}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-blue disabled:opacity-60"
                  >
                    {saving ? "Submitting..." : "Submit Ticket"}
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        }
      />
    </section>
  );
}

function CalendarList({ items }) {
  const monthGrid = buildMonthGrid(items || []);
  const weekBoard = !monthGrid ? buildWeekBoard(items || []) : null;

  return (
    <div className="mb-5 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,35,95,0.08)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-brand-navy px-5 py-4 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Calendar View</p>
          <p className="mt-1 text-lg font-semibold">{monthGrid?.title || "Weekly Schedule"}</p>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-50">
          {items?.length ? `${items.length} entries` : "No entries"}
        </div>
      </div>

      {monthGrid ? (
        <div className="bg-slate-950 p-3 text-white">
          <div className="grid grid-cols-7 gap-px rounded-[1.25rem] bg-slate-800 overflow-hidden">
            {calendarWeekDays.map((day) => (
              <div key={day} className="bg-slate-900 px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {day}
              </div>
            ))}
            {monthGrid.cells.map((cell) => (
              <div key={cell.isoDate} className={`min-h-[126px] px-3 py-3 align-top ${cell.isCurrentMonth ? "bg-slate-950" : "bg-slate-900/70 text-slate-500"}`}>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${cell.items.length ? "bg-brand-blue text-white" : cell.isCurrentMonth ? "text-slate-200" : "text-slate-500"}`}>
                    {cell.dayNumber}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {cell.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="rounded-xl bg-emerald-500/20 px-2 py-1.5 text-xs leading-5 text-emerald-200 ring-1 ring-emerald-400/20">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-[11px] text-emerald-100/80">{item.description}</p>
                    </div>
                  ))}
                  {cell.items.length > 3 ? <p className="text-[11px] text-slate-400">+{cell.items.length - 3} more</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : weekBoard ? (
        <div className="grid gap-px bg-slate-200 md:grid-cols-3 xl:grid-cols-6">
          {weekBoard.map((column) => (
            <div key={column.day} className="bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{column.day}</p>
              <div className="mt-4 space-y-3">
                {column.items.length ? (
                  column.items.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white p-3 text-sm text-slate-600 shadow-sm">
                      <p className="font-semibold text-brand-slate">{item.title}</p>
                      <p className="mt-1 text-slate-500">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-white p-3 text-sm text-slate-400 shadow-sm">No entries</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 p-5 text-sm text-slate-500">No calendar entries are available for this view yet.</div>
      )}
    </div>
  );
}

function LeavesSection({ leaves, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting, currentRole, currentUser }) {
  const applicantMode = !canManage;
  const roleLabel = currentRole ? formatRoleLabel(currentRole) : "User";
  const applicantValue = form.applicant || currentUser?.name || "";
  const leaveRoleValue = form.role || roleLabel;
  const canSetStatus = canManage && !(currentRole === "vice_principal" && leaveRoleValue === "Vice Principal");

  return (
    <section className="mt-6 space-y-6">
      <TwoColumn
        left={
          <Panel title={applicantMode ? "My Leave Requests" : "Leave Application Management"} subtitle={applicantMode ? "Submitted requests and current approval status" : "Student and staff leave workflows with approval status"}>
            <div className="grid gap-4">
              {leaves.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-[1.75rem] bg-slate-50 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{item.applicant}</p>
                    <p className="text-sm text-slate-500">
                      {item.role} • {item.from} to {item.to}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{item.reason}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-blue">{item.status}</span>
                    {!applicantMode ? (
                      <ActionButtons
                        canManage={canManage && !(currentRole === "vice_principal" && item.role === "Vice Principal")}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item.id)}
                        busy={submitting}
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        }
        right={
          <CrudPanel
            title={canManage && editing ? "Edit Leave Request" : "Apply Leave"}
            subtitle={applicantMode ? `Create a leave request as ${roleLabel}` : `Create or update a leave request${currentRole ? ` as ${roleLabel}` : ""}`}
            canManage={canManage || applicantMode}
            editing={canManage && editing}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel={canManage && editing ? "Save Leave" : "Create Leave Request"}
          >
            <FormGrid>
              <Field label="Applicant" value={applicantValue} onChange={(value) => onChange("applicant", value)} />
              <Field label="Role" value={leaveRoleValue} onChange={(value) => onChange("role", value)} />
              <Field label="From" type="date" value={form.from} onChange={(value) => onChange("from", value)} />
              <Field label="To" type="date" value={form.to} onChange={(value) => onChange("to", value)} />
              <Field label="Reason" value={form.reason} onChange={(value) => onChange("reason", value)} />
              {canSetStatus ? <SelectField label="Status" value={form.status} options={["Pending", "Approved", "Rejected"]} onChange={(value) => onChange("status", value)} /> : null}
            </FormGrid>
          </CrudPanel>
        }
      />
    </section>
  );
}

function SettingsSection({ integrations, roles, users, currentUser, onSaveAccess }) {
  const adminRole = ["super_admin", "school_admin"].includes(currentUser.role);
  const principalRole = currentUser.role === "school_admin";
  return (
    <section className="mt-6 space-y-6">
      {adminRole ? (
        <Panel title="System Settings & Integrations" subtitle="Configuration zones for administrative users">
          <div className="grid gap-4 lg:grid-cols-4">
            <SettingsCard title="Payment Gateways" icon={CreditCard} items={integrations?.payments || []} />
            <SettingsCard title="Notifications" icon={Bell} items={integrations?.notifications || []} />
            <SettingsCard title="File Storage" icon={School} items={integrations?.storage || []} />
            <SettingsCard title="Authentication" icon={ShieldCheck} items={integrations?.auth || []} />
          </div>
        </Panel>
      ) : null}
      <TwoColumn
        left={
          <Panel title="Current Session" subtitle="Authenticated portal user details">
            <div className="rounded-[1.75rem] bg-slate-50 p-5">
              <div className="flex items-center gap-4">
                <img src={currentUser.avatar} alt={currentUser.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div>
                  <p className="text-xl font-semibold">{currentUser.name}</p>
                  <p className="text-sm text-slate-500">{currentUser.email}</p>
                  <p className="text-sm capitalize text-slate-500">{String(currentUser.role).replaceAll("_", " ")}</p>
                </div>
              </div>
            </div>
          </Panel>
        }
        right={
          principalRole ? (
            <Panel title="Access & Responsibilities" subtitle="Only the principal can assign module access and responsibilities to teachers and management">
              <div className="space-y-4">
                {users
                  .filter((user) => user.role !== "school_admin")
                  .map((user) => (
                    <UserAccessCard key={user.id} user={user} onSave={onSaveAccess} />
                  ))}
              </div>
            </Panel>
          ) : adminRole ? (
            <Panel title="Access Review" subtitle="High-level role summary for administrative users">
              <div className="grid gap-3 md:grid-cols-2">
                {roles.map((role) => (
                  <div key={role.role} className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-semibold capitalize">{role.role.replaceAll("_", " ")}</p>
                    <p className="mt-2 text-sm text-slate-500">{role.permissions.length} permissions configured</p>
                  </div>
                ))}
              </div>
            </Panel>
          ) : (
            <Panel title="Account Help" subtitle="Simple access information">
              <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                Your menu is limited to the modules allowed for your role. Contact the EduCore administrator if you need access changes or profile updates.
              </div>
            </Panel>
          )
        }
      />
    </section>
  );
}

function UserAccessCard({ user, onSave }) {
  const [permissions, setPermissions] = useState(user.accessPermissions || []);
  const [responsibilities, setResponsibilities] = useState(user.responsibilities || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPermissions(user.accessPermissions || []);
    setResponsibilities(user.responsibilities || "");
  }, [user]);

  const togglePermission = (permission) => {
    setPermissions((current) =>
      current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]
    );
  };

  return (
    <div className="rounded-[1.75rem] bg-slate-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
          <p className="mt-1 text-sm font-medium text-brand-blue">{formatRoleLabel(user.role)}</p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try {
              await onSave(user.id, { accessPermissions: permissions, responsibilities });
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-2xl bg-brand-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Access"}
        </button>
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Module Access</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {moduleAccessOptions.map((option) => {
            const active = permissions.includes(option.id);
            return (
              <button
                key={`${user.id}-${option.id}`}
                type="button"
                onClick={() => togglePermission(option.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-brand-navy text-white" : "bg-white text-slate-600"}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-5">
        <TextAreaField label="Responsibilities" value={responsibilities} onChange={setResponsibilities} />
      </div>
    </div>
  );
}

function AnnouncementTicker({ announcements, compact = false }) {
  const items = announcements.filter((item) => item.status === "Published");
  if (!items.length) {
    return null;
  }

  return (
    <div className={`overflow-hidden border border-amber-200 bg-amber-50 ${compact ? "mb-4 rounded-2xl px-4 py-2" : "rounded-[1.75rem] px-4 py-3"}`}>
      <style>{`
        @keyframes educore-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">Live</span>
        <div className="min-w-0 overflow-hidden">
          <div
            className={`flex w-max items-center gap-10 whitespace-nowrap font-medium text-amber-900 ${compact ? "text-xs" : "text-sm"}`}
            style={{ animation: "educore-marquee 28s linear infinite" }}
          >
            {[...items, ...items].map((item, index) => (
              <span key={`${item.id}-${index}`}>
                {item.type}: {item.title} • {item.content}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getOverviewCards(role, dashboard, platform) {
  if (role === "teacher") {
    return [
      { icon: GraduationCap, label: "Exam Results", value: String((platform.results || []).length), color: "bg-blue-100 text-blue-700" },
      { icon: BookOpen, label: "Homework", value: String((platform.homework || []).length), color: "bg-amber-100 text-amber-700" },
      { icon: Bell, label: "Notifications", value: String((platform.announcements || []).length), color: "bg-emerald-100 text-emerald-700" },
      { icon: ClipboardList, label: "Leave Requests", value: String((platform.leaves || []).length), color: "bg-rose-100 text-rose-700" }
    ];
  }

  if (["super_admin", "school_admin", "vice_principal"].includes(role)) {
    return [
      { icon: Receipt, label: "Fees Collected", value: currency(dashboard.stats.feesCollected), color: "bg-emerald-100 text-emerald-700" },
      { icon: FileBadge, label: "Pending Fees", value: currency(dashboard.stats.feesPending), color: "bg-rose-100 text-rose-700" },
      { icon: BookOpen, label: "Homework", value: String((platform.homework || []).length), color: "bg-blue-100 text-blue-700" },
      { icon: Bell, label: "Notifications", value: String((platform.announcements || []).length), color: "bg-amber-100 text-amber-700" }
    ];
  }

  return [
    { icon: ShieldCheck, label: "Access", value: "Limited", color: "bg-blue-100 text-blue-700" }
  ];
}

function getOverviewHighlights(role, platform) {
  if (role === "teacher") {
    return [
      { label: "Exam Schedule", value: String((platform.exams || []).length), hint: "Configured exam items" },
      { label: "Results", value: String((platform.results || []).length), hint: "Published result records" },
      { label: "Homework", value: String((platform.homework || []).length), hint: "Assigned tasks" },
      { label: "Notifications", value: String((platform.announcements || []).length), hint: "Broadcast notices" }
    ];
  }

  return [
    { label: "Exam Schedule", value: String((platform.exams || []).length), hint: "Upcoming exam cycles" },
    { label: "Homework", value: String((platform.homework || []).length), hint: "Active homework items" },
    { label: "Notifications", value: String((platform.announcements || []).length), hint: "School broadcasts" },
    { label: "Leave Requests", value: String((platform.leaves || []).length), hint: "Approval workflow" }
  ];
}

function ParentDashboard({ platform }) {
  const students = platform.students || [];
  const primaryStudent = students[0];
  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Children" value={String(students.length)} color="bg-blue-100 text-blue-700" />
        <StatCard icon={CheckSquare} label="Attendance" value={primaryStudent ? `${primaryStudent.attendance}%` : "-"} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={CreditCard} label="Fee Due" value={primaryStudent ? currency(primaryStudent.feesDue) : currency(0)} color="bg-rose-100 text-rose-700" />
        <StatCard icon={Bell} label="Notices" value={String((platform.announcements || []).length)} color="bg-amber-100 text-amber-700" />
      </div>
      <TwoColumn
        left={
          <Panel title="Child Overview" subtitle="Attendance, results, and fee summary">
            <div className="space-y-4">
              {students.map((student) => (
                <RecordCard
                  key={student.id}
                  title={student.name}
                  subtitle={`${student.className} • ${student.admissionNo}`}
                  details={[`Attendance: ${student.attendance}%`, `Performance: ${student.performance}`, `Fee Due: ${currency(student.feesDue)}`]}
                />
              ))}
            </div>
          </Panel>
        }
        right={
          <Panel title="Parent Actions" subtitle="Focused tasks for guardians">
            <div className="grid gap-4">
              <KpiTile label="Homework" value={String((platform.homework || []).length)} hint="Review assigned work" />
              <KpiTile label="Exam Results" value={String((platform.results || []).length)} hint="View latest marks" />
              <KpiTile label="Transport" value={String((platform.transport || []).length)} hint="Track assigned route" />
              <KpiTile label="Leave Requests" value={String((platform.leaves || []).length)} hint="Apply on behalf of child" />
            </div>
          </Panel>
        }
      />
    </section>
  );
}

function StudentDashboard({ platform }) {
  const student = (platform.students || [])[0];
  const [selectedYear, setSelectedYear] = useState(student?.academicRecords?.[0]?.academicYear || "");
  const academicRecord =
    (student?.academicRecords || []).find((item) => item.academicYear === selectedYear) ||
    (student?.academicRecords || [])[0] ||
    null;

  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CheckSquare} label="Attendance" value={student ? `${student.attendance}%` : "-"} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={BookOpen} label="Homework" value={String((platform.homework || []).length)} color="bg-blue-100 text-blue-700" />
        <StatCard icon={GraduationCap} label="Results" value={String((platform.results || []).length)} color="bg-amber-100 text-amber-700" />
        <StatCard icon={SquareLibrary} label="Study Material" value={String((platform.content || []).length)} color="bg-rose-100 text-rose-700" />
      </div>
      <TwoColumn
        left={
          <Panel title="My Profile" subtitle="Student dashboard with profile, admission, medical, sibling, and transport details">
            {student ? (
              <div className="space-y-4">
                <RecordCard
                  title={student.name}
                  subtitle={`${student.className} • ${student.admissionNo}`}
                  details={[
                    `Application No: ${student.applicationNo || "-"}`,
                    `Admission Date: ${student.admissionDate || "-"}`,
                    `Performance: ${student.performance}`,
                    `Medical: ${student.medical}`,
                    `Sibling: ${student.siblingName || "Not linked"}`,
                    `Emergency: ${student.emergencyContact || "-"}`
                  ]}
                />
                <RecordCard
                  title="Transport & Bus Tracking"
                  subtitle={`${student.transportRoute || "No route"} • ${student.busStop || "No stop assigned"}`}
                  details={[
                    `Live Status: ${student.busTrackingStatus || "No live bus data"}`,
                    `Promoted To: ${student.promotedTo || "-"}`,
                    `TC Issued: ${student.tcIssued || "No"}`,
                    `Alumni Status: ${student.alumniStatus || "Active"}`
                  ]}
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No student profile available.</div>
            )}
          </Panel>
        }
        right={
          <Panel title="Student Dashboard" subtitle="Everything a student should see in the portal">
            <div className="grid gap-4">
              <KpiTile label="Assignments" value={String((platform.homework || []).length)} hint="Complete before due date" />
              <KpiTile label="Announcements" value={String((platform.announcements || []).length)} hint="Read school notices" />
              <KpiTile label="Results" value={String((platform.results || []).length)} hint="Latest exam records" />
              <KpiTile label="Fee Ledger" value={String((platform.fees || []).length)} hint="Track dues and receipts" />
              <KpiTile label="Weekly Timetable" value={String((platform.timetable || []).length)} hint="See upcoming classes" />
              <KpiTile label="Attendance Records" value={String((platform.attendanceRecords || []).length)} hint="View class attendance history" />
            </div>
          </Panel>
        }
      />
      <TwoColumn
        left={
          <Panel title="Academic History" subtitle="Admission records and year-to-year academic movement">
            <div className="space-y-4">
              {(student?.academicRecords || []).length ? (
                <div className="max-w-xs">
                  <SelectField
                    label="Academic Year"
                    value={selectedYear || academicRecord?.academicYear || ""}
                    options={(student.academicRecords || []).map((item) => item.academicYear)}
                    onChange={setSelectedYear}
                  />
                </div>
              ) : null}
              <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                {academicRecord
                  ? `Year: ${academicRecord.academicYear}\nClass: ${academicRecord.className}\nResult: ${academicRecord.resultStatus}\nAttendance: ${academicRecord.attendance}%\nLeaves Taken: ${academicRecord.leaveCount}\nSchool Holidays: ${academicRecord.holidayCount}`
                  : student?.academicHistory || "Academic history will appear here once maintained by the school administration."}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Promotion & Alumni</p>
                  <p className="mt-3"><span className="font-medium text-brand-slate">Promoted To:</span> {student?.promotedTo || "-"}</p>
                  <p className="mt-2"><span className="font-medium text-brand-slate">Alumni Status:</span> {student?.alumniStatus || "Active"}</p>
                  <p className="mt-2"><span className="font-medium text-brand-slate">TC Issued:</span> {student?.tcIssued || "No"}</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Transport & Bus Tracking</p>
                  <p className="mt-3"><span className="font-medium text-brand-slate">Route:</span> {student?.transportRoute || "-"}</p>
                  <p className="mt-2"><span className="font-medium text-brand-slate">Bus Stop:</span> {student?.busStop || "-"}</p>
                  <p className="mt-2"><span className="font-medium text-brand-slate">Status:</span> {student?.busTrackingStatus || "No live bus data"}</p>
                  <p className="mt-2"><span className="font-medium text-brand-slate">Driver:</span> {(platform.transport || [])[0]?.driver || "-"}</p>
                  <p className="mt-2"><span className="font-medium text-brand-slate">Driver Phone:</span> {(platform.transport || [])[0]?.driverPhone || "-"}</p>
                  <p className="mt-2"><span className="font-medium text-brand-slate">Conductor:</span> {(platform.transport || [])[0]?.conductor || "-"}</p>
                  <p className="mt-2"><span className="font-medium text-brand-slate">Conductor Phone:</span> {(platform.transport || [])[0]?.conductorPhone || "-"}</p>
                </div>
              </div>
              {academicRecord?.resultFileName ? (
                <DownloadLink
                  label="Download Academic Result"
                  content={`Academic Year: ${academicRecord.academicYear}\nClass: ${academicRecord.className}\nResult: ${academicRecord.resultStatus}\nAttendance: ${academicRecord.attendance}%\nLeave Count: ${academicRecord.leaveCount}\nHoliday Count: ${academicRecord.holidayCount}`}
                  filename={academicRecord.resultFileName}
                />
              ) : null}
            </div>
          </Panel>
        }
        right={
          <Panel title="Student Documents" subtitle="Uploaded school and admission documents">
            <div className="space-y-3">
              {(student?.documentUploads || []).map((doc) => (
                <AttachmentDownloadLink key={doc.name} label={doc.name} data={doc.data || "data:text/plain;charset=utf-8,"} filename={doc.name} />
              ))}
              {!(student?.documentUploads || []).length ? <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No uploaded documents available.</div> : null}
            </div>
          </Panel>
        }
      />
    </section>
  );
}

function TeacherDashboard({ platform }) {
  const lectures = (platform.timetable || []).slice(0, 6);
  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={GraduationCap} label="Exam Results" value={String((platform.results || []).length)} color="bg-blue-100 text-blue-700" />
        <StatCard icon={BookOpen} label="Homework" value={String((platform.homework || []).length)} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Megaphone} label="Notifications" value={String((platform.announcements || []).length)} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={ClipboardList} label="Lectures" value={String((platform.timetable || []).length)} color="bg-rose-100 text-rose-700" />
      </div>
      <TwoColumn
        left={
          <Panel title="My Weekly Lectures" subtitle="Scheduled lectures for your assigned class timetable">
            <SimpleTable
              columns={["Day", "Period", "Subject", "Room"]}
              rows={lectures.map((entry) => [entry.day, entry.period, entry.subject, entry.room || "-"])}
            />
          </Panel>
        }
        right={
          <Panel title="Teacher Tasks" subtitle="Current approved module actions">
            <div className="grid gap-4">
              <KpiTile label="Results" value={String((platform.results || []).length)} hint="Marks and grades" />
              <KpiTile label="Homework" value={String((platform.homework || []).length)} hint="Assign and review work" />
              <KpiTile label="Notifications" value={String((platform.announcements || []).length)} hint="Circulars and notices" />
              <KpiTile label="Student Leaves" value={String((platform.leaves || []).filter((item) => item.role === "Student").length)} hint="Applications visible to teachers" />
            </div>
          </Panel>
        }
      />
    </section>
  );
}

function AccountantDashboard({ platform, stats }) {
  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Receipt} label="Collected" value={currency(stats.feesCollected)} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={FileBadge} label="Pending" value={currency(stats.feesPending)} color="bg-rose-100 text-rose-700" />
        <StatCard icon={CreditCard} label="Fee Records" value={String((platform.fees || []).length)} color="bg-blue-100 text-blue-700" />
        <StatCard icon={BarChart3} label="Reports" value={String((platform.reports || []).length)} color="bg-amber-100 text-amber-700" />
      </div>
      <TwoColumn
        left={
          <Panel title="Finance Snapshot" subtitle="Recent fee records">
            <div className="space-y-4">
              {(platform.fees || []).slice(0, 4).map((fee) => (
                <RecordCard
                  key={fee.id}
                  title={fee.category}
                  subtitle={`${fee.className} • ${fee.status}`}
                  details={[`Amount: ${currency(fee.amount)}`, `Pending: ${currency(fee.pending)}`]}
                />
              ))}
            </div>
          </Panel>
        }
        right={
          <Panel title="Accountant Tasks" subtitle="Finance operations">
            <div className="grid gap-4">
              <KpiTile label="Manage Fees" value="Ready" hint="Create and update ledgers" />
              <KpiTile label="Pending Dues" value={currency(stats.feesPending)} hint="Track outstanding balance" />
              <KpiTile label="Reports" value={String((platform.reports || []).length)} hint="Financial report views" />
              <KpiTile label="Leave" value={String((platform.leaves || []).length)} hint="Apply and track leave" />
            </div>
          </Panel>
        }
      />
    </section>
  );
}

function HRDashboard({ platform }) {
  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Briefcase} label="Staff" value={String((platform.staff || []).length)} color="bg-blue-100 text-blue-700" />
        <StatCard icon={ClipboardList} label="Leave Requests" value={String((platform.leaves || []).length)} color="bg-amber-100 text-amber-700" />
        <StatCard icon={CheckSquare} label="Attendance Records" value={String((platform.attendanceRecords || []).length)} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={BarChart3} label="Reports" value={String((platform.reports || []).length)} color="bg-rose-100 text-rose-700" />
      </div>
      <TwoColumn
        left={
          <Panel title="Staff Operations" subtitle="Staff profiles and management workload">
            <SimpleTable
              columns={["Name", "Role", "Department", "Leave Balance"]}
              rows={(platform.staff || []).map((member) => [member.name, formatRoleLabel(member.portalRole), member.department, String(member.leaveBalance)])}
            />
          </Panel>
        }
        right={
          <Panel title="HR Tasks" subtitle="Administrative workflows">
            <div className="grid gap-4">
              <KpiTile label="Staff Management" value="Active" hint="Profiles and assignments" />
              <KpiTile label="Leave Processing" value={String((platform.leaves || []).length)} hint="Staff leave workflow" />
              <KpiTile label="Attendance" value={String((platform.attendanceRecords || []).length)} hint="Staff attendance oversight" />
            </div>
          </Panel>
        }
      />
    </section>
  );
}

function LibrarianDashboard({ platform }) {
  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Library} label="Books" value={String((platform.library || []).length)} color="bg-blue-100 text-blue-700" />
        <StatCard icon={Users} label="Issued" value={String((platform.library || []).filter((item) => item.status === "Issued").length)} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Bell} label="Due Soon" value={String((platform.library || []).length)} color="bg-rose-100 text-rose-700" />
        <StatCard icon={ClipboardList} label="Leave" value={String((platform.leaves || []).length)} color="bg-emerald-100 text-emerald-700" />
      </div>
      <Panel title="Library Desk" subtitle="Catalogue and issue records">
        <SimpleTable
          columns={["Title", "ISBN", "Issued To", "Due Date", "Status"]}
          rows={(platform.library || []).map((book) => [book.title, book.isbn, book.issuedTo, book.dueDate, book.status])}
        />
      </Panel>
    </section>
  );
}

function TransportDashboard({ platform }) {
  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Bus} label="Routes" value={String((platform.transport || []).length)} color="bg-blue-100 text-blue-700" />
        <StatCard icon={Users} label="Students" value={String((platform.transport || []).reduce((sum, route) => sum + (route.students || 0), 0))} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Bell} label="Active Trips" value={String((platform.transport || []).filter((item) => item.status !== "Reached School").length)} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={ClipboardList} label="Leave" value={String((platform.leaves || []).length)} color="bg-rose-100 text-rose-700" />
      </div>
      <Panel title="Transport Control" subtitle="Route and ETA monitoring">
        <div className="grid gap-4 lg:grid-cols-2">
          {(platform.transport || []).map((route) => (
            <RecordCard
              key={route.id}
              title={route.route}
              subtitle={`${route.vehicle} • ${route.status}`}
              details={[
                `Driver: ${route.driver} (${route.driverPhone || "-"})`,
                `Conductor: ${route.conductor || "-"} (${route.conductorPhone || "-"})`,
                `Students: ${route.students}`,
                `ETA: ${route.eta}`,
                `GPS: ${route.gpsStatus || "-"}`,
                `Location: ${route.currentLocation || "-"}`
              ]}
            />
          ))}
        </div>
      </Panel>
    </section>
  );
}

function SupportDashboard({ platform }) {
  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Ticket} label="Tickets" value={String((platform.supportTickets || []).length)} color="bg-blue-100 text-blue-700" />
        <StatCard icon={Bell} label="Announcements" value={String((platform.announcements || []).length)} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Users} label="Users" value={String((platform.students || []).length + (platform.staff || []).length)} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Settings} label="Queue" value="Active" color="bg-rose-100 text-rose-700" />
      </div>
      <Panel title="Support Queue" subtitle="Open tickets and school support requests">
        <SimpleTable
          columns={["Requester", "Issue", "Priority", "Status"]}
          rows={(platform.supportTickets || []).map((ticket) => [ticket.requester || ticket.school || "-", ticket.issue, ticket.priority, ticket.status])}
        />
      </Panel>
    </section>
  );
}

function StudentHomeworkSubmissionCard({ item, busy, onSubmit }) {
  const [file, setFile] = useState(null);

  if (item.mode !== "Online") {
    return <p className="mt-4 text-sm text-slate-500">This is an offline assignment. Complete it in class or notebook as instructed by your teacher.</p>;
  }

  return (
    <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4">
      <p className="text-sm text-slate-600">Submission: {item.studentSubmission || "Not submitted yet"}</p>
      {item.studentSubmissionData ? (
        <AttachmentDownloadLink
          label="Download Submitted Work"
          data={item.studentSubmissionData}
          filename={item.studentSubmission || "submitted-homework"}
        />
      ) : null}
      <FileField label="Upload Completed Work" accept=".pdf,.doc,.docx,image/*" onChange={setFile} />
      <button
        type="button"
        onClick={() => file && onSubmit(item, file)}
        disabled={!file || busy}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-blue disabled:opacity-60"
      >
        <Upload size={16} />
        {busy ? "Submitting..." : "Submit Homework"}
      </button>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-panel lg:p-7">
      <div className="mb-6">
        <h4 className="text-2xl font-bold text-brand-slate">{title}</h4>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function CrudPanel({ title, subtitle, canManage, editing, onSubmit, onCancel, submitting, submitLabel, children }) {
  if (!canManage) {
    return (
      <Panel title={title} subtitle={subtitle}>
        <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">Your role can view this module, but only authorized staff can create or modify records here.</p>
      </Panel>
    );
  }

  return (
    <Panel title={title} subtitle={subtitle}>
      {children}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-navy px-5 py-3 font-semibold text-white transition hover:bg-brand-blue disabled:opacity-60"
        >
          {editing ? <Save size={18} /> : <Plus size={18} />}
          {submitting ? "Saving..." : submitLabel}
        </button>
        {editing ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <X size={18} />
            Cancel Edit
          </button>
        ) : null}
      </div>
    </Panel>
  );
}

function TwoColumn({ left, right }) {
  return <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">{left}{right}</div>;
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-panel">
      <div className={`inline-flex rounded-2xl p-3 ${color}`}>
        <Icon size={22} />
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-brand-slate">{value}</p>
    </div>
  );
}

function KpiTile({ label, value, hint }) {
  return (
    <div className="rounded-[1.5rem] bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand-slate">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">{hint}</p>
    </div>
  );
}

function MetricTile({ label, value, soft = false }) {
  return (
    <div className={`rounded-2xl p-3 ${soft ? "bg-slate-50" : "bg-white/10"}`}>
      <p className={`text-xs uppercase tracking-[0.2em] ${soft ? "text-slate-400" : "text-blue-100"}`}>{label}</p>
      <p className={`mt-2 font-semibold ${soft ? "text-brand-slate" : "text-white"}`}>{value}</p>
    </div>
  );
}

function InfoChip({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="flex items-center gap-2 text-brand-blue">
        <Icon size={16} />
        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</span>
      </div>
      <p className="mt-2 font-semibold text-brand-slate">{value}</p>
    </div>
  );
}

function SettingsCard({ title, icon: Icon, items }) {
  return (
    <div className="rounded-[1.75rem] bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white p-3 text-brand-blue">
          <Icon size={20} />
        </div>
        <p className="text-lg font-semibold">{title}</p>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, title, subtitle, badge }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white p-3 text-brand-blue">
            <Icon size={18} />
          </div>
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-blue">{badge}</span>
      </div>
    </div>
  );
}

function RecordCard({ title, subtitle, details, canManage, onEdit, onDelete, busy, actions }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <ActionButtons canManage={canManage} onEdit={onEdit} onDelete={onDelete} busy={busy} />
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        {details.map((detail) => (
          <p key={detail}>{detail}</p>
        ))}
      </div>
    </div>
  );
}

function ActionButtons({ canManage, onEdit, onDelete, busy }) {
  if (!canManage) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onEdit} className="rounded-xl bg-white p-2 text-brand-blue transition hover:bg-brand-paper" disabled={busy}>
        <Pencil size={16} />
      </button>
      <button type="button" onClick={onDelete} className="rounded-xl bg-white p-2 text-rose-600 transition hover:bg-rose-50" disabled={busy}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function DownloadLink({ label, content, filename, mimeType = "text/plain" }) {
  const href = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
  return (
    <a
      href={href}
      download={filename}
      className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-brand-blue transition hover:bg-brand-paper"
    >
      <Download size={16} />
      {label}
    </a>
  );
}

function AttachmentDownloadLink({ label, data, filename }) {
  return (
    <a
      href={data}
      download={filename}
      className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-brand-blue transition hover:bg-brand-paper"
    >
      <Download size={16} />
      {label}
    </a>
  );
}

function FormGrid({ children }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Field({ label, name, type = "text", value, defaultValue, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FileField({ label, accept, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        type="file"
        accept={accept}
        onChange={(event) => onChange(event.target.files?.[0] || null)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-brand-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-blue focus:border-brand-blue"
      />
    </label>
  );
}

function FileFieldMultiple({ label, accept, onChange }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        type="file"
        multiple
        accept={accept}
        onChange={(event) => onChange(event.target.files || [])}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-brand-paper file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-blue focus:border-brand-blue"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-blue"
      />
    </label>
  );
}

function Banner({ tone, message, onClose }) {
  const toneClasses = tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700";
  return (
    <div className={`mt-6 flex items-center justify-between rounded-[1.5rem] border px-5 py-4 ${toneClasses}`}>
      <p className="font-medium">{message}</p>
      <button type="button" onClick={onClose} className="text-sm font-semibold">
        Dismiss
      </button>
    </div>
  );
}

function CenteredMessage({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-paper px-4">
      <div className="rounded-[2rem] bg-white px-8 py-6 shadow-panel">
        <p className="text-lg font-semibold text-brand-slate">{message}</p>
      </div>
    </div>
  );
}

function CenteredPanel({ message }) {
  return (
    <div className="mt-6 rounded-[2rem] bg-white px-8 py-10 shadow-panel">
      <p className="text-lg font-semibold text-brand-slate">{message}</p>
    </div>
  );
}

function SimpleTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400">
            {columns.map((column) => (
              <th key={column} className="pb-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`} className="border-t border-slate-100">
              {row.map((value, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className={`py-4 ${cellIndex === 0 ? "font-semibold" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span>{value}</span>
                    {cellIndex === row.length - 1 ? <ChevronRight size={14} className="text-slate-300" /> : null}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function mapItemToForm(section, item) {
  switch (section) {
    case "tenant":
      return {
        name: item.name || "",
        subdomain: item.subdomain || "",
        board: item.board || "",
        plan: item.plan || "Growth",
        status: item.status || "Trial",
        students: String(item.students ?? ""),
        activeUsers: String(item.activeUsers ?? ""),
        modules: String(item.modules ?? ""),
        mrr: String(item.mrr ?? "")
      };
    case "student":
      return {
        name: item.name || "",
        admissionNo: item.admissionNo || "",
        applicationNo: item.applicationNo || "",
        className: item.className || "",
        parentName: item.parentName || "",
        admissionDate: item.admissionDate || "",
        academicHistory: item.academicHistory || "",
        feesDue: String(item.feesDue ?? ""),
        transportRoute: item.transportRoute || "",
        busStop: item.busStop || "",
        busTrackingStatus: item.busTrackingStatus || "",
        medical: item.medical || "",
        bloodGroup: item.bloodGroup || "",
        emergencyContact: item.emergencyContact || "",
        siblingName: item.siblingName || "",
        siblingClass: item.siblingClass || "",
        tcIssued: item.tcIssued || "No",
        alumniStatus: item.alumniStatus || "Active",
        promotedTo: item.promotedTo || "",
        portalUsername: item.portalUsername || item.admissionNo || "",
        academicRecords: item.academicRecords || [],
        attendance: String(item.attendance ?? ""),
        performance: item.performance || "Pending",
        documents: String(item.documents ?? ""),
        documentUploads: item.documentUploads || []
      };
    case "staff":
      return {
        employeeId: item.employeeId || "",
        name: item.name || "",
        portalRole: item.portalRole || "teacher",
        designation: item.designation || "",
        department: item.department || "",
        qualification: item.qualification || "",
        workload: item.workload || "",
        leaveBalance: String(item.leaveBalance ?? ""),
        classes: item.classes || "",
        portalUsername: item.portalUsername || item.employeeId || ""
      };
    case "attendance":
      return {
        className: item.className || "",
        date: item.date || "",
        present: String(item.present ?? ""),
        absent: String(item.absent ?? ""),
        late: String(item.late ?? ""),
        markedBy: item.markedBy || ""
      };
    case "timetable":
      return {
        className: item.className || "",
        day: item.day || "Monday",
        period: item.period || "",
        subject: item.subject || "",
        teacher: item.teacher || "",
        room: item.room || ""
      };
    case "exam":
      return {
        name: item.name || "",
        className: item.className || "",
        schedule: item.schedule || "",
        examDate: item.examDate || "",
        uploadedBy: item.uploadedBy || "",
        fileName: item.fileName || "",
        fileType: item.fileType || "",
        fileData: item.fileData || "",
        hallTickets: item.hallTickets || "Draft",
        resultStatus: item.resultStatus || "Pending"
      };
    case "result":
      return {
        student: item.student || "",
        className: item.className || "",
        exam: item.exam || "",
        percentage: String(item.percentage ?? ""),
        grade: item.grade || "",
        rank: String(item.rank ?? ""),
        approvalStatus: item.approvalStatus || "Pending",
        approvedBy: item.approvedBy || ""
      };
    case "fee":
      return {
        studentName: item.studentName || "",
        category: item.category || "",
        className: item.className || "",
        dueDate: item.dueDate || "",
        amount: String(item.amount ?? ""),
        paid: String(item.paid ?? ""),
        pending: String(item.pending ?? ""),
        status: item.status || "Pending"
      };
    case "announcement":
      return {
        title: item.title || "",
        audience: item.audience || "",
        type: item.type || "General Circular",
        targetRoles: item.targetRoles || ["teacher"],
        deliveryMode: item.deliveryMode || "Instant",
        date: item.date || "",
        scheduledAt: item.scheduledAt || "",
        documentName: item.documentName || "",
        documentType: item.documentType || "",
        documentData: item.documentData || "",
        content: item.content || "",
        status: item.status || "Published"
      };
    case "homework":
      return {
        subject: item.subject || "",
        className: item.className || "",
        title: item.title || "",
        dueDate: item.dueDate || "",
        mode: item.mode || "Offline",
        attachmentName: item.attachmentName || "",
        attachmentType: item.attachmentType || "",
        attachmentData: item.attachmentData || "",
        studentSubmission: item.studentSubmission || "",
        studentSubmissionType: item.studentSubmissionType || "",
        studentSubmissionData: item.studentSubmissionData || "",
        completionStatus: item.completionStatus || "Pending",
        submissions: String(item.submissions ?? ""),
        totalStudents: String(item.totalStudents ?? ""),
        status: item.status || "Active"
      };
    case "leave":
      return {
        applicant: item.applicant || "",
        role: item.role || "",
        from: item.from || "",
        to: item.to || "",
        reason: item.reason || "",
        status: item.status || "Pending"
      };
    default:
      return initialForms[section];
  }
}

export default App;
