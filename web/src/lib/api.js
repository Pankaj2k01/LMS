import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  localStorage.setItem("sms_token", data.token);
  localStorage.setItem("sms_user", JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem("sms_token");
  localStorage.removeItem("sms_user");
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  localStorage.setItem("sms_user", JSON.stringify(data));
  return data;
}

export async function fetchDashboard() {
  const { data } = await api.get("/dashboard");
  return data;
}

export async function fetchPlatformData() {
  const { data } = await api.get("/platform-data");
  return data;
}

export async function fetchRoles() {
  const { data } = await api.get("/roles");
  return data;
}

export async function fetchIntegrations() {
  const { data } = await api.get("/settings/integrations");
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get("/users");
  return data;
}

export async function updateUserAccess(id, payload) {
  const { data } = await api.put(`/users/${id}/access`, payload);
  return data;
}

async function createResource(path, payload) {
  const { data } = await api.post(path, payload);
  return data;
}

async function updateResource(path, payload) {
  const { data } = await api.put(path, payload);
  return data;
}

async function deleteResource(path) {
  const { data } = await api.delete(path);
  return data;
}

export const createTenant = (payload) => createResource("/tenants", payload);
export const createStudent = (payload) => createResource("/students", payload);
export const createAttendanceRecord = (payload) => createResource("/attendance-records", payload);
export const createTimetableEntry = (payload) => createResource("/timetable", payload);
export const createExam = (payload) => createResource("/exams", payload);
export const createResult = (payload) => createResource("/results", payload);
export const createFee = (payload) => createResource("/fees", payload);
export const createAnnouncement = (payload) => createResource("/announcements", payload);
export const createHomework = (payload) => createResource("/homework", payload);
export const createLeave = (payload) => createResource("/leaves", payload);
export const updateTenant = (id, payload) => updateResource(`/tenants/${id}`, payload);
export const updateStudent = (id, payload) => updateResource(`/students/${id}`, payload);
export const updateAttendanceRecord = (id, payload) => updateResource(`/attendance-records/${id}`, payload);
export const updateTimetableEntry = (id, payload) => updateResource(`/timetable/${id}`, payload);
export const updateExam = (id, payload) => updateResource(`/exams/${id}`, payload);
export const updateResult = (id, payload) => updateResource(`/results/${id}`, payload);
export const updateFee = (id, payload) => updateResource(`/fees/${id}`, payload);
export const updateAnnouncement = (id, payload) => updateResource(`/announcements/${id}`, payload);
export const updateHomework = (id, payload) => updateResource(`/homework/${id}`, payload);
export const updateLeave = (id, payload) => updateResource(`/leaves/${id}`, payload);
export const deleteTenant = (id) => deleteResource(`/tenants/${id}`);
export const deleteStudent = (id) => deleteResource(`/students/${id}`);
export const deleteAttendanceRecord = (id) => deleteResource(`/attendance-records/${id}`);
export const deleteTimetableEntry = (id) => deleteResource(`/timetable/${id}`);
export const deleteExam = (id) => deleteResource(`/exams/${id}`);
export const deleteResult = (id) => deleteResource(`/results/${id}`);
export const deleteFee = (id) => deleteResource(`/fees/${id}`);
export const deleteAnnouncement = (id) => deleteResource(`/announcements/${id}`);
export const deleteHomework = (id) => deleteResource(`/homework/${id}`);
export const deleteLeave = (id) => deleteResource(`/leaves/${id}`);
