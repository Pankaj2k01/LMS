import {
  mockAttendance,
  mockContent,
  mockExams,
  mockFeatureFlags,
  mockIntegrations,
  mockLibrary,
  mockOnboarding,
  mockPlatformData,
  mockReports,
  mockResults,
  mockRoles,
  mockSupportTickets,
  mockTimetable,
  mockTransport
} from "../data/mockData.js";
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

export function dashboardController(req, res) {
  res.json({
    userRole: req.user.role,
    ...mockPlatformData
  });
}

function scopePlatformDataByRole(role, data) {
  const base = {
    stats: data.stats,
    announcements: data.announcements,
    homework: data.homework,
    leaves: data.leaves,
    roles: mockRoles,
    integrations: mockIntegrations
  };

  switch (role) {
    case "super_admin":
    case "support_agent":
      return data;
    case "school_admin":
    case "vice_principal":
      return {
        ...base,
        students: data.students,
        attendanceRecords: data.attendanceRecords,
        fees: data.fees,
        exams: data.exams,
        results: data.results
      };
    case "teacher":
      return {
        ...base,
        students: data.students,
        homework: data.homework,
        exams: data.exams.filter((item) => item.className.includes("Grade 3")),
        results: data.results.filter((item) => item.className.includes("Grade 3")),
        attendance: mockAttendance,
        attendanceRecords: data.attendanceRecords.filter((item) => item.className.includes("Grade 3")),
        fees: data.fees.filter((item) => item.className.includes("Grade 3")),
        leaves: data.leaves.filter((item) => item.role === "Teacher" || item.role === "Student")
      };
    default:
      return base;
  }
}

export async function platformDataController(req, res) {
  const [tenants, students, staff, attendanceRecords, exams, results, fees, homework, announcements, leaves] = await Promise.all([
    repositories.tenants.list(),
    repositories.students.list(),
    repositories.staff.list(),
    repositories.attendanceRecords.list(),
    repositories.exams.list(),
    repositories.results.list(),
    repositories.fees.list(),
    repositories.homework.list(),
    repositories.announcements.list(),
    repositories.leaves.list()
  ]);

  const fullData = {
    ...mockPlatformData,
    tenants,
    students,
    staff,
    attendanceRecords,
    exams,
    results,
    fees,
    homework,
    announcements,
    leaves
  };

  res.json(scopePlatformDataByRole(req.user.role, fullData));
}

export const staticCollections = {
  attendance: mockAttendance,
  roles: mockRoles,
  integrations: mockIntegrations
};

export function listStatic(collection) {
  return (_req, res) => res.json(collection);
}
