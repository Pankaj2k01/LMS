import { access, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
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
  mockTenants
} from "./mockData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "persisted-data.json");

const mutableCollections = {
  tenants: mockTenants,
  students: mockStudents,
  staff: mockStaff,
  attendanceRecords: mockAttendanceRecords,
  exams: mockExams,
  results: mockResults,
  fees: mockFees,
  homework: mockHomework,
  announcements: mockAnnouncements,
  leaves: mockLeaves
};

function snapshot() {
  return Object.fromEntries(
    Object.entries(mutableCollections).map(([key, value]) => [key, value])
  );
}

export async function initializePersistence() {
  try {
    await access(dataFilePath);
    const raw = await readFile(dataFilePath, "utf8");
    const parsed = JSON.parse(raw);

    Object.entries(mutableCollections).forEach(([key, target]) => {
      if (Array.isArray(parsed[key])) {
        target.splice(0, target.length, ...parsed[key]);
      }
    });
  } catch (error) {
    await persistData();
  }
}

export async function persistData() {
  await writeFile(dataFilePath, JSON.stringify(snapshot(), null, 2), "utf8");
}
