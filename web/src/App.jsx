import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  CheckSquare,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  FileBadge,
  GraduationCap,
  LayoutDashboard,
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
  createStudent,
  deleteAnnouncement,
  deleteAttendanceRecord,
  deleteExam,
  deleteFee,
  deleteHomework,
  deleteLeave,
  deleteResult,
  deleteStudent,
  fetchCurrentUser,
  fetchDashboard,
  fetchIntegrations,
  fetchPlatformData,
  fetchRoles,
  login,
  logout,
  updateAnnouncement,
  updateAttendanceRecord,
  updateExam,
  updateFee,
  updateHomework,
  updateLeave,
  updateResult,
  updateStudent,
} from "./lib/api";

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "sis", label: "Students", icon: Users },
  { id: "attendance", label: "Attendance", icon: CheckSquare },
  { id: "exams", label: "Exams & Results", icon: GraduationCap },
  { id: "fees", label: "Fee Management", icon: CreditCard },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "communication", label: "Notifications", icon: Megaphone },
  { id: "leave", label: "Leave Applications", icon: ClipboardList },
  { id: "settings", label: "Settings", icon: Settings }
];

const roleTabs = {
  super_admin: navigation.map((item) => item.id),
  school_admin: navigation.map((item) => item.id),
  vice_principal: navigation.map((item) => item.id),
  teacher: navigation.map((item) => item.id),
  support_agent: ["settings"],
  accountant: ["settings"],
  librarian: ["settings"],
  parent: ["settings"],
  student: ["settings"],
  transport_staff: ["settings"]
};

const loginNotes = [
  "This release is limited to management and teacher workflows.",
  "Included modules: Results & Exams, Leave, Fees, Homework, and Notifications.",
  "Secure JWT authentication with MongoDB-backed accounts."
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
  student: { name: "", admissionNo: "", className: "", parentName: "", feesDue: "", transportRoute: "", medical: "", attendance: "", performance: "Pending", documents: "" },
  attendance: { className: "", date: "", present: "", absent: "", late: "", markedBy: "" },
  exam: { name: "", className: "", schedule: "", examDate: "", uploadedBy: "", fileName: "", hallTickets: "Draft", resultStatus: "Pending" },
  result: { student: "", className: "", exam: "", percentage: "", grade: "", rank: "", approvalStatus: "Pending", approvedBy: "" },
  fee: { studentName: "", category: "", className: "", dueDate: "", amount: "", paid: "", pending: "", status: "Pending" },
  announcement: { title: "", audience: "", type: "Circular", date: "", content: "", status: "Published" },
  homework: { subject: "", className: "", title: "", dueDate: "", mode: "Offline", studentSubmission: "", completionStatus: "Pending", submissions: "", totalStudents: "", status: "Active" },
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
  attendance: "Attendance",
  exam: "Exam",
  result: "Result",
  fee: "Fee",
  announcement: "Announcement",
  homework: "Homework",
  leave: "Leave Request"
};

const formatRoleLabel = (role) =>
  String(role || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getPageMeta = (activeTab) => {
  const labels = {
    overview: { title: "Dashboard", subtitle: "Role-based overview of academic and operational activity." },
    sis: { title: "Students", subtitle: "Student profiles, fee status, and class-level details." },
    attendance: { title: "Attendance", subtitle: "Daily attendance entries and class attendance history." },
    exams: { title: "Examinations", subtitle: "Exam schedules, result status, and academic performance." },
    fees: { title: "Fee Management", subtitle: "Collection, dues, receipts, and payment status." },
    homework: { title: "Homework", subtitle: "Assignments, due dates, and submission tracking." },
    communication: { title: "Notifications", subtitle: "Broadcast circulars, announcements, and notices." },
    leave: { title: "Leave", subtitle: "Leave requests, approvals, and status tracking." },
    settings: { title: "Settings", subtitle: "Account access and system configuration." }
  };

  return labels[activeTab] || labels.overview;
};

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [roles, setRoles] = useState([]);
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
    attendance: null,
    exam: null,
    result: null,
    fee: null,
    announcement: null,
    homework: null,
    leave: null
  });
  const [submitting, setSubmitting] = useState("");

  const isAuthenticated = Boolean(currentUser && localStorage.getItem("sms_token"));
  const accessibleTabs = useMemo(() => roleTabs[currentUser?.role] || ["overview", "settings"], [currentUser]);
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
      const [dashboardResult, platformResult, rolesResult, integrationsResult] = await Promise.allSettled([
        fetchDashboard(),
        fetchPlatformData(),
        fetchRoles(),
        fetchIntegrations()
      ]);

      if (dashboardResult.status !== "fulfilled" || platformResult.status !== "fulfilled") {
        throw new Error("Unable to load application data.");
      }

      setDashboard(dashboardResult.value);
      setPlatform(platformResult.value);
      setRoles(rolesResult.status === "fulfilled" ? rolesResult.value : []);
      setIntegrations(integrationsResult.status === "fulfilled" ? integrationsResult.value : null);
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
        await createAction(payload);
        setSuccessMessage(`${sectionTitles[section]} created successfully.`);
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
    setIntegrations(null);
    setForms(initialForms);
    setEditing({
      student: null,
      attendance: null,
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
      case "sis":
        return (
          <StudentsSection
            students={platform.students}
            form={forms.student}
            editing={Boolean(editing.student)}
            canManage={["super_admin", "school_admin", "vice_principal"].includes(currentUser?.role)}
            onChange={(field, value) => updateForm("student", field, value)}
            onSubmit={() =>
              saveSection("student", createStudent, updateStudent, (payload) => ({
                ...payload,
                feesDue: Number(payload.feesDue || 0),
                attendance: Number(payload.attendance || 0),
                documents: Number(payload.documents || 0)
              }))
            }
            onEdit={(item) => startEdit("student", item)}
            onDelete={(id) => handleDelete("student", deleteStudent, id)}
            onCancel={() => resetForm("student")}
            submitting={submitting === "student"}
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
            canManage={["super_admin", "school_admin", "vice_principal", "teacher"].includes(currentUser?.role)}
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
      case "exams":
        return (
          <ExamsSection
            exams={platform.exams || []}
            results={platform.results || []}
            form={forms.exam}
            resultForm={forms.result}
            editingExam={Boolean(editing.exam)}
            editingResult={Boolean(editing.result)}
            canManage={["super_admin", "school_admin", "vice_principal"].includes(currentUser?.role)}
            canApproveResults={["super_admin", "school_admin", "vice_principal"].includes(currentUser?.role)}
            onExamChange={(field, value) => updateForm("exam", field, value)}
            onResultChange={(field, value) => updateForm("result", field, value)}
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
            canManage={["super_admin", "school_admin", "vice_principal"].includes(currentUser?.role)}
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
          />
        );
      case "homework":
        return (
          <HomeworkSection
            homework={platform.homework}
            form={forms.homework}
            editing={Boolean(editing.homework)}
            canManage={["super_admin", "school_admin", "vice_principal", "teacher"].includes(currentUser?.role)}
            onChange={(field, value) => updateForm("homework", field, value)}
            onSubmit={() =>
              saveSection("homework", createHomework, updateHomework, (payload) => ({
                ...payload,
                submissions: Number(payload.submissions || 0),
                totalStudents: Number(payload.totalStudents || 0)
              }))
            }
            onEdit={(item) => startEdit("homework", item)}
            onDelete={(id) => handleDelete("homework", deleteHomework, id)}
            onCancel={() => resetForm("homework")}
            submitting={submitting === "homework"}
            role={currentUser?.role}
          />
        );
      case "communication":
        return (
          <CommunicationSection
            announcements={platform.announcements}
            form={forms.announcement}
            editing={Boolean(editing.announcement)}
            canManage={["super_admin", "school_admin", "vice_principal", "teacher"].includes(currentUser?.role)}
            onChange={(field, value) => updateForm("announcement", field, value)}
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
            canManage={["super_admin", "vice_principal"].includes(currentUser?.role)}
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
      case "settings":
        return <SettingsSection integrations={integrations} roles={roles} currentUser={welcomeUser} />;
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
          className={`fixed inset-y-0 left-0 z-30 w-80 transform overflow-y-auto bg-brand-navy px-5 py-6 text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-gold/95 p-3 text-brand-navy">
              <School size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200">EduCore</p>
              <h1 className="text-xl font-bold">Teacher & Management Portal</h1>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-white/10 p-4 backdrop-blur">
            <img src={welcomeUser.avatar} alt={welcomeUser.name} className="h-16 w-16 rounded-2xl object-cover" />
            <p className="mt-4 text-lg font-semibold">{welcomeUser.name}</p>
            <p className="text-sm capitalize text-blue-100">{String(welcomeUser.role).replaceAll("_", " ")}</p>
            <p className="mt-2 text-xs text-blue-200">{welcomeUser.campus}</p>
          </div>

          <nav className="mt-8 space-y-2">
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
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
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

        <div className="flex-1">
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
                <button type="button" className="rounded-2xl bg-brand-navy p-3 text-white shadow-panel">
                  <Bell size={18} />
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
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
              <h1 className="text-3xl font-bold text-brand-slate">Teacher & Management Portal</h1>
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
            <Field label="Email" name="email" type="email" />
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
          <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
            Test access can be used during review. Production accounts should be managed inside EduCore user administration.
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
  if (role === "teacher") {
    return <TeacherDashboard platform={platform} />;
  }
  if (role === "accountant") {
    return <AccountantDashboard platform={platform} stats={dashboard.stats} />;
  }
  if (role === "librarian") {
    return <LibrarianDashboard platform={platform} />;
  }
  if (role === "transport_staff") {
    return <TransportDashboard platform={platform} />;
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
      <Panel title="Super Admin Dashboard" subtitle="Platform-wide control for onboarding, subscriptions, billing, support, and health">
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

function OnboardingSection({ items }) {
  return (
    <section className="mt-6">
      <Panel title="School Onboarding & Configuration" subtitle="Progress through profile, academics, branding, modules, and go-live">
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-[1.75rem] bg-slate-50 p-5">
              <p className="text-lg font-semibold">{item.institution}</p>
              <p className="mt-2 text-sm text-slate-500">Current step: {item.step}</p>
              <p className="mt-1 text-sm text-slate-500">Owner: {item.owner}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-brand-blue">{item.status}</span>
                <span className="text-sm font-medium text-slate-500">ETA {item.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function StudentsSection({ students, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting }) {
  return (
    <section className="mt-6 space-y-6">
      <TwoColumn
        left={
          <Panel title="Student Information System" subtitle="Master profiles, guardian links, documents, medical information, and transport data">
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
                    <InfoChip icon={UserSquare2} label="Admission No." value={student.admissionNo} />
                    <InfoChip icon={Briefcase} label="Route" value={student.transportRoute} />
                    <InfoChip icon={FileBadge} label="Performance" value={student.performance} />
                    <InfoChip icon={Receipt} label="Fee Due" value={currency(student.feesDue)} />
                    <InfoChip icon={FolderKanban} label="Documents" value={`${student.documents} files`} />
                    <InfoChip icon={Bell} label="Medical" value={student.medical} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        }
        right={
          <CrudPanel
            title={editing ? "Edit Student" : "Add Student"}
            subtitle="Create or update a student record in the SIS"
            canManage={canManage}
            editing={editing}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitting={submitting}
            submitLabel={editing ? "Save Student" : "Create Student"}
          >
            <FormGrid>
              <Field label="Student Name" value={form.name} onChange={(value) => onChange("name", value)} />
              <Field label="Admission No." value={form.admissionNo} onChange={(value) => onChange("admissionNo", value)} />
              <Field label="Class / Section" value={form.className} onChange={(value) => onChange("className", value)} />
              <Field label="Parent Name" value={form.parentName} onChange={(value) => onChange("parentName", value)} />
              <Field label="Attendance" type="number" value={form.attendance} onChange={(value) => onChange("attendance", value)} />
              <Field label="Performance" value={form.performance} onChange={(value) => onChange("performance", value)} />
              <Field label="Fee Due" type="number" value={form.feesDue} onChange={(value) => onChange("feesDue", value)} />
              <Field label="Transport Route" value={form.transportRoute} onChange={(value) => onChange("transportRoute", value)} />
              <Field label="Medical Notes" value={form.medical} onChange={(value) => onChange("medical", value)} />
              <Field label="Documents Count" type="number" value={form.documents} onChange={(value) => onChange("documents", value)} />
            </FormGrid>
          </CrudPanel>
        }
      />
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
              <Field label="Name" value={form.name} onChange={(value) => onChange("name", value)} />
              <Field label="Designation" value={form.designation} onChange={(value) => onChange("designation", value)} />
              <Field label="Department" value={form.department} onChange={(value) => onChange("department", value)} />
              <Field label="Qualification" value={form.qualification} onChange={(value) => onChange("qualification", value)} />
              <Field label="Workload" value={form.workload} onChange={(value) => onChange("workload", value)} />
              <Field label="Leave Balance" type="number" value={form.leaveBalance} onChange={(value) => onChange("leaveBalance", value)} />
              <Field label="Class Assignment" value={form.classes} onChange={(value) => onChange("classes", value)} />
            </FormGrid>
          </CrudPanel>
        }
      />
      <Panel title="Role Matrix" subtitle="Platform and institution access configuration">
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
  const primaryClass = attendance.studentSummary?.[0];
  return (
    <section className="mt-6 space-y-6">
      <Panel title="Attendance Snapshot" subtitle="Daily attendance summary and class status">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiTile label={teacherMode ? "My Class" : "Students Present"} value={teacherMode ? primaryClass?.className || "-" : String(attendance.todayPresent)} hint={teacherMode ? "Assigned class section" : "Live daily count"} />
          <KpiTile label={teacherMode ? "Present" : "Students Absent"} value={teacherMode ? String(primaryClass?.present || 0) : String(attendance.todayAbsent)} hint={teacherMode ? "Today's recorded present count" : "Current absent count"} />
          <KpiTile label={teacherMode ? "Absent" : "Staff Present"} value={teacherMode ? String(primaryClass?.absent || 0) : String(attendance.staffPresent)} hint={teacherMode ? "Today's absences" : "Staff attendance summary"} />
          <KpiTile label={teacherMode ? "Late" : "Shortage Alerts"} value={teacherMode ? String(primaryClass?.late || 0) : String(attendance.shortageAlerts)} hint={teacherMode ? "Late arrivals" : "Below minimum threshold"} />
        </div>
      </Panel>
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
    </section>
  );
}

function ExamsSection({
  exams,
  results,
  form,
  resultForm,
  editingExam,
  editingResult,
  canManage,
  canApproveResults,
  onExamChange,
  onResultChange,
  onExamSubmit,
  onResultSubmit,
  onEditExam,
  onDeleteExam,
  onCancelExam,
  onEditResult,
  onDeleteResult,
  onCancelResult,
  submitting,
  role
}) {
  const viewerMode = role === "parent" || role === "student";
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
                    <DownloadLink label="Download Timetable" content={`${exam.name}\n${exam.className}\n${exam.schedule}\n${exam.fileName || "No file name"}`} filename={exam.fileName || `${exam.name}.txt`} />
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
              <SelectField label="Hall Tickets" value={form.hallTickets} options={["Draft", "Ready"]} onChange={(value) => onExamChange("hallTickets", value)} />
              <SelectField label="Result Status" value={form.resultStatus} options={["Pending", "Processing", "Published"]} onChange={(value) => onExamChange("resultStatus", value)} />
            </FormGrid>
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

function FeesSection({ fees, stats, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting, role }) {
  const teacherMode = role === "teacher";
  return (
    <section className="mt-6 space-y-6">
      <Panel title={teacherMode ? "Student Fee Status" : "Fee Management"} subtitle={teacherMode ? "Teachers can view payment progress of their class students" : "Revenue, collections, dues, and receipt-ready records"}>
        <div className="grid gap-4 md:grid-cols-3">
          <KpiTile label="Collected" value={currency(stats.feesCollected)} hint="Online + offline collections" />
          <KpiTile label="Pending" value={currency(stats.feesPending)} hint="Includes overdue balances" />
          <KpiTile label="Coverage" value={stats.feeCollectionCoverage} hint="Schools collecting via platform" />
        </div>
      </Panel>
      {teacherMode ? (
        <Panel title="Class Fee Ledger" subtitle="Track paid and pending fees for students in your class">
          <div className="space-y-4">
            {fees.map((item) => (
              <RecordCard
                key={item.id}
                title={`${item.studentName || "Student"} • ${item.category}`}
                subtitle={`${item.className} • Due ${item.dueDate}`}
                details={[`Amount: ${currency(item.amount)}`, `Paid: ${currency(item.paid)}`, `Pending: ${currency(item.pending)}`, `Status: ${item.status}`]}
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

function HomeworkSection({ homework, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting, role }) {
  return (
    <section className="mt-6 space-y-6">
      <TwoColumn
        left={
          <Panel title="Homework Management" subtitle="Online and offline homework with completion tracking">
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
                  {item.mode === "Online" ? (
                    <p className="mt-4 text-sm text-slate-500">Student submission: {item.studentSubmission || "Awaiting file upload"}</p>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">Offline homework can be marked completed by the teacher.</p>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        }
        right={
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
              <Field label="Student Submission" value={form.studentSubmission} onChange={(value) => onChange("studentSubmission", value)} />
              <SelectField label="Completion Status" value={form.completionStatus} options={["Pending", "Pending Review", "Completed"]} onChange={(value) => onChange("completionStatus", value)} />
              <Field label="Submissions" type="number" value={form.submissions} onChange={(value) => onChange("submissions", value)} />
              <Field label="Total Students" type="number" value={form.totalStudents} onChange={(value) => onChange("totalStudents", value)} />
              <SelectField label="Status" value={form.status} options={["Active", "Closed", "Draft"]} onChange={(value) => onChange("status", value)} />
            </FormGrid>
          </CrudPanel>
        }
      />
    </section>
  );
}

function CommunicationSection({ announcements, form, editing, canManage, onChange, onSubmit, onEdit, onDelete, onCancel, submitting, role }) {
  const viewerMode = role === "parent" || role === "student";
  return (
    <section className="mt-6 space-y-6">
      {viewerMode ? (
        <Panel title="School Notices" subtitle="Circulars and announcements shared by the school">
          <div className="grid gap-4 lg:grid-cols-2">
            {announcements.map((item) => (
              <div key={item.id} className="rounded-[1.75rem] bg-slate-50 p-5">
                <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-white">{item.status}</span>
                <p className="mt-4 text-xl font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500">{item.audience} • {item.date}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{item.content}</p>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <TwoColumn
          left={
            <Panel title="Notification & Communication" subtitle="Circulars, announcements, and delivery workflows">
              <div className="grid gap-4 lg:grid-cols-2">
                {announcements.map((item) => (
                  <div key={item.id} className="rounded-[1.75rem] bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-white">{item.status}</span>
                      <ActionButtons canManage={canManage} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} busy={submitting} />
                    </div>
                    <p className="mt-4 text-xl font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.audience} • {item.date}</p>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{item.content}</p>
                  </div>
                ))}
              </div>
            </Panel>
          }
          right={
            <CrudPanel
              title={editing ? "Edit Announcement" : "Create Announcement"}
              subtitle="Publish a circular or notice for web and app users"
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
                <SelectField label="Type" value={form.type} options={["Circular", "Announcement", "Reminder"]} onChange={(value) => onChange("type", value)} />
                <Field label="Date" type="date" value={form.date} onChange={(value) => onChange("date", value)} />
                <Field label="Content" value={form.content} onChange={(value) => onChange("content", value)} />
                <SelectField label="Status" value={form.status} options={["Published", "Draft"]} onChange={(value) => onChange("status", value)} />
              </FormGrid>
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
          <KpiTile label="API P95" value={stats.apiP95} hint="Platform health benchmark" />
        </div>
      </Panel>
      <Panel title={role === "accountant" ? "Report Exports" : "Scheduled Reports"} subtitle={role === "accountant" ? "Finance-ready export schedule" : "Export-ready reporting for principals, finance teams, and admins"}>
        <SimpleTable columns={["Report", "Schedule", "Format", "Owner"]} rows={reports.map((item) => [item.report, item.schedule, item.format, item.owner])} />
      </Panel>
    </section>
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

function SettingsSection({ integrations, roles, currentUser }) {
  const adminRole = ["super_admin", "school_admin"].includes(currentUser.role);
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
          adminRole ? (
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
          <Panel title="My Profile" subtitle="Student profile and academic snapshot">
            {student ? (
              <RecordCard
                title={student.name}
                subtitle={`${student.className} • ${student.admissionNo}`}
                details={[`Performance: ${student.performance}`, `Transport: ${student.transportRoute}`, `Medical: ${student.medical}`]}
              />
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No student profile available.</div>
            )}
          </Panel>
        }
        right={
          <Panel title="Student Focus" subtitle="Important learning items">
            <div className="grid gap-4">
              <KpiTile label="Assignments" value={String((platform.homework || []).length)} hint="Complete before due date" />
              <KpiTile label="Announcements" value={String((platform.announcements || []).length)} hint="Read school notices" />
              <KpiTile label="Results" value={String((platform.results || []).length)} hint="Latest exam records" />
              <KpiTile label="Content Library" value={String((platform.content || []).length)} hint="Study resources" />
            </div>
          </Panel>
        }
      />
    </section>
  );
}

function TeacherDashboard({ platform }) {
  return (
    <section className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={GraduationCap} label="Exam Results" value={String((platform.results || []).length)} color="bg-blue-100 text-blue-700" />
        <StatCard icon={BookOpen} label="Homework" value={String((platform.homework || []).length)} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Megaphone} label="Notifications" value={String((platform.announcements || []).length)} color="bg-emerald-100 text-emerald-700" />
        <StatCard icon={ClipboardList} label="Leave Requests" value={String((platform.leaves || []).length)} color="bg-rose-100 text-rose-700" />
      </div>
      <TwoColumn
        left={
          <Panel title="Exam Snapshot" subtitle="Current exam and result summary">
            <SimpleTable
              columns={["Exam", "Class", "Schedule", "Status"]}
              rows={(platform.exams || []).slice(0, 5).map((exam) => [exam.name, exam.className, exam.schedule, exam.resultStatus])}
            />
          </Panel>
        }
        right={
          <Panel title="Teacher Tasks" subtitle="Current approved module actions">
            <div className="grid gap-4">
              <KpiTile label="Results" value={String((platform.results || []).length)} hint="Marks and grades" />
              <KpiTile label="Homework" value={String((platform.homework || []).length)} hint="Assign and review work" />
              <KpiTile label="Notifications" value={String((platform.announcements || []).length)} hint="Circulars and notices" />
              <KpiTile label="Leave" value={String((platform.leaves || []).length)} hint="Apply and track status" />
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
              details={[`Driver: ${route.driver}`, `Students: ${route.students}`, `ETA: ${route.eta}`]}
            />
          ))}
        </div>
      </Panel>
    </section>
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

function DownloadLink({ label, content, filename }) {
  const href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
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
        className: item.className || "",
        parentName: item.parentName || "",
        feesDue: String(item.feesDue ?? ""),
        transportRoute: item.transportRoute || "",
        medical: item.medical || "",
        attendance: String(item.attendance ?? ""),
        performance: item.performance || "Pending",
        documents: String(item.documents ?? "")
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
    case "exam":
      return {
        name: item.name || "",
        className: item.className || "",
        schedule: item.schedule || "",
        examDate: item.examDate || "",
        uploadedBy: item.uploadedBy || "",
        fileName: item.fileName || "",
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
        type: item.type || "Circular",
        date: item.date || "",
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
        studentSubmission: item.studentSubmission || "",
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
