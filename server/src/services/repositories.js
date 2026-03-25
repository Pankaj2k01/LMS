import bcrypt from "bcryptjs";
import {
  mockAnnouncements,
  mockAttendanceRecords,
  mockExams,
  mockFees,
  mockHomework,
  mockLeaves,
  mockResults,
  mockStaff,
  mockStudents,
  mockTenants,
  mockTimetable,
  mockUsers
} from "../data/mockData.js";
import {
  AttendanceRecordModel,
  AnnouncementModel,
  ExamModel,
  FeeModel,
  HomeworkModel,
  LeaveModel,
  ResultModel,
  StaffModel,
  StudentModel,
  TenantModel,
  TimetableModel,
  UserModel
} from "../models/coreModels.js";
import { createRepository } from "./coreRepository.js";

async function prepareUserSeed(users) {
  return Promise.all(
    users.map(async (user) => ({
      ...user,
      password: user.password.startsWith("$2") ? user.password : await bcrypt.hash(user.password, 10)
    }))
  );
}

export const repositories = {
  users: createRepository({ model: UserModel, collection: mockUsers, prepareSeed: prepareUserSeed }),
  tenants: createRepository({ model: TenantModel, collection: mockTenants }),
  students: createRepository({ model: StudentModel, collection: mockStudents }),
  staff: createRepository({ model: StaffModel, collection: mockStaff }),
  attendanceRecords: createRepository({ model: AttendanceRecordModel, collection: mockAttendanceRecords }),
  exams: createRepository({ model: ExamModel, collection: mockExams }),
  results: createRepository({ model: ResultModel, collection: mockResults }),
  timetable: createRepository({ model: TimetableModel, collection: mockTimetable }),
  fees: createRepository({ model: FeeModel, collection: mockFees }),
  announcements: createRepository({ model: AnnouncementModel, collection: mockAnnouncements }),
  homework: createRepository({ model: HomeworkModel, collection: mockHomework }),
  leaves: createRepository({ model: LeaveModel, collection: mockLeaves })
};
