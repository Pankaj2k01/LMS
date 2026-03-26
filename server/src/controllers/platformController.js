import { mockAttendance, mockContent, mockIntegrations, mockLibrary, mockReports, mockRoles, mockTransport } from "../data/mockData.js";
import { repositories } from "../services/repositories.js";

export function healthController(getDbStatus) {
  return (_req, res) => {
    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      database: getDbStatus()
    });
  };
}

function buildStats({ students, staff, fees, homework, announcements, leaves, exams, results, attendanceRecords, timetable }) {
  const feesCollected = fees.reduce((sum, item) => sum + Number(item.paid || 0), 0);
  const feesPending = fees.reduce((sum, item) => sum + Number(item.pending || 0), 0);

  return {
    totalStudents: students.length,
    totalTeachers: staff.length,
    feesCollected,
    feesPending,
    announcements: announcements.length,
    activeAssignments: homework.filter((item) => item.status === "Active").length,
    pendingLeaves: leaves.filter((item) => item.status === "Pending").length,
    totalExams: exams.length,
    publishedResults: results.filter((item) => ["Approved", "Published"].includes(item.approvalStatus)).length,
    attendanceEntries: attendanceRecords.length,
    timetableEntries: timetable.length,
    feeCollectionCoverage: feesCollected + feesPending > 0 ? `${Math.round((feesCollected / (feesCollected + feesPending)) * 100)}%` : "0%"
  };
}

function classMatches(assignedClasses, className) {
  if (!assignedClasses.length) {
    return true;
  }

  return assignedClasses.some((assignedClass) => className === assignedClass || className.startsWith(assignedClass));
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

async function resolveUserContext(userId) {
  const [user, staff] = await Promise.all([repositories.users.getById(userId), repositories.staff.list()]);
  const staffProfile = staff.find((item) => item.name === user?.name);
  const assignedClasses = staffProfile?.classes
    ? staffProfile.classes.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  return {
    user,
    assignedClasses
  };
}

function scopePlatformDataByRole(role, data, assignedClasses = [], user = null) {
  const base = {
    stats: data.stats,
    attendance: mockAttendance,
    announcements: data.announcements,
    homework: data.homework,
    leaves: data.leaves,
    library: mockLibrary,
    transport: mockTransport,
    content: mockContent,
    reports: mockReports,
    supportTickets: data.supportTickets,
    roles: mockRoles,
    integrations: mockIntegrations
  };

  switch (role) {
    case "super_admin":
      return {
        ...base,
        students: data.students,
        staff: data.staff,
        attendanceRecords: data.attendanceRecords,
        timetable: data.timetable,
        fees: data.fees,
        exams: data.exams,
        results: data.results
      };
    case "school_admin":
    case "vice_principal":
      return {
        ...base,
        students: data.students,
        staff: data.staff,
        attendanceRecords: data.attendanceRecords,
        timetable: data.timetable,
        fees: data.fees,
        exams: data.exams,
        results: data.results
      };
    case "teacher":
      const teacherClasses = assignedClasses.length > 0 ? assignedClasses : ["Grade 3 - B"];
      return {
        ...base,
        students: data.students.filter((item) => classMatches(teacherClasses, item.className)),
        homework: data.homework.filter((item) => classMatches(teacherClasses, item.className)),
        exams: data.exams.filter((item) => classMatches(teacherClasses, item.className)),
        results: data.results.filter((item) => classMatches(teacherClasses, item.className)),
        timetable: data.timetable.filter((item) => classMatches(teacherClasses, item.className)),
        attendanceRecords: data.attendanceRecords.filter((item) => classMatches(teacherClasses, item.className)),
        fees: data.fees.filter((item) => classMatches(teacherClasses, item.className)),
        leaves: data.leaves.filter((item) => item.role === "Teacher" || item.role === "Student"),
        content: mockContent.filter((item) => classMatches(teacherClasses, item.className)),
        reports: mockReports
      };
    case "student": {
      const currentStudent =
        data.students.find((item) => item.id === user?.linkedStudentId) ||
        data.students.find((item) => item.name === user?.name) ||
        null;
      const className = currentStudent?.className || "";
      const matchedFees = data.fees.filter(
        (item) =>
          item.studentId === currentStudent?.id ||
          normalizeText(item.studentName) === normalizeText(currentStudent?.name)
      );
      const studentFees =
        matchedFees.length > 0
          ? matchedFees
          : currentStudent?.feesDue
            ? [
                {
                  id: `fee-${currentStudent.id}-fallback`,
                  studentId: currentStudent.id,
                  studentName: currentStudent.name,
                  category: "Admission / Tuition Fee",
                  className,
                  dueDate: new Date().toISOString().slice(0, 10),
                  amount: Number(currentStudent.feesDue || 0),
                  paid: 0,
                  pending: Number(currentStudent.feesDue || 0),
                  status: "Pending",
                  receiptNo: `RCPT-${currentStudent.admissionNo || currentStudent.id}`,
                  lastPaymentDate: ""
                }
              ]
            : [];
      return {
        ...base,
        students: currentStudent ? [currentStudent] : [],
        homework: data.homework.filter((item) => item.className === className),
        exams: data.exams.filter((item) => item.className === className),
        results: data.results.filter((item) => item.student === currentStudent?.name),
        timetable: data.timetable.filter((item) => item.className === className),
        attendanceRecords: data.attendanceRecords.filter((item) => item.className === className),
        fees: studentFees,
        leaves: data.leaves.filter((item) => item.applicant === currentStudent?.name || item.role === "Student"),
        transport: mockTransport.filter((item) => item.route === currentStudent?.transportRoute),
        content: mockContent.filter((item) => item.className === className)
      };
    }
    default:
      return base;
  }
}

export async function platformDataController(req, res) {
  const [{ user, assignedClasses }, students, staff, attendanceRecords, timetable, exams, results, fees, homework, announcements, leaves, supportTickets] = await Promise.all([
    resolveUserContext(req.user.id),
    repositories.students.list(),
    repositories.staff.list(),
    repositories.attendanceRecords.list(),
    repositories.timetable.list(),
    repositories.exams.list(),
    repositories.results.list(),
    repositories.fees.list(),
    repositories.homework.list(),
    repositories.announcements.list(),
    repositories.leaves.list(),
    repositories.supportTickets.list()
  ]);

  const fullData = {
    students,
    staff,
    attendanceRecords,
    timetable,
    exams,
    results,
    fees,
    homework,
    announcements,
    leaves,
    supportTickets,
    stats: buildStats({ students, staff, fees, homework, announcements, leaves, exams, results, attendanceRecords, timetable })
  };

  res.json(scopePlatformDataByRole(req.user.role, fullData, assignedClasses, user));
}

export async function dashboardController(req, res) {
  const [{ user, assignedClasses }, students, staff, attendanceRecords, timetable, exams, results, fees, homework, announcements, leaves, supportTickets] = await Promise.all([
    resolveUserContext(req.user.id),
    repositories.students.list(),
    repositories.staff.list(),
    repositories.attendanceRecords.list(),
    repositories.timetable.list(),
    repositories.exams.list(),
    repositories.results.list(),
    repositories.fees.list(),
    repositories.homework.list(),
    repositories.announcements.list(),
    repositories.leaves.list(),
    repositories.supportTickets.list()
  ]);

  const fullData = {
    students,
    staff,
    attendanceRecords,
    timetable,
    exams,
    results,
    fees,
    homework,
    announcements,
    leaves,
    supportTickets,
    stats: buildStats({ students, staff, fees, homework, announcements, leaves, exams, results, attendanceRecords, timetable })
  };

  res.json({
    userRole: req.user.role,
    ...scopePlatformDataByRole(req.user.role, fullData, assignedClasses, user)
  });
}

export const staticCollections = {
  attendance: mockAttendance,
  roles: mockRoles,
  integrations: mockIntegrations
};

export function listStatic(collection) {
  return (_req, res) => res.json(collection);
}
