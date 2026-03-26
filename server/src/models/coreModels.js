import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const tenantSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    subdomain: { type: String, required: true },
    board: { type: String, required: true },
    status: { type: String, default: "Trial" },
    plan: { type: String, default: "Growth" },
    students: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    modules: { type: Number, default: 0 },
    mrr: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const studentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    admissionNo: { type: String, required: true },
    rollNumber: { type: String, default: "" },
    applicationNo: { type: String, default: "" },
    name: { type: String, required: true },
    className: { type: String, required: true },
    parentName: { type: String, required: true },
    mobileNumber: { type: String, default: "" },
    admissionDate: { type: String, default: "" },
    academicHistory: { type: String, default: "" },
    attendance: { type: Number, default: 0 },
    feesDue: { type: Number, default: 0 },
    performance: { type: String, default: "Pending" },
    transportRoute: { type: String, default: "Not assigned" },
    busStop: { type: String, default: "" },
    busTrackingStatus: { type: String, default: "" },
    medical: { type: String, default: "Not updated" },
    bloodGroup: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    siblingName: { type: String, default: "" },
    siblingClass: { type: String, default: "" },
    tcIssued: { type: String, default: "No" },
    alumniStatus: { type: String, default: "Active" },
    promotedTo: { type: String, default: "" },
    academicRecords: {
      type: [
        new Schema(
          {
            academicYear: { type: String, default: "" },
            className: { type: String, default: "" },
            resultStatus: { type: String, default: "" },
            attendance: { type: Number, default: 0 },
            leaveCount: { type: Number, default: 0 },
            holidayCount: { type: Number, default: 0 },
            resultFileName: { type: String, default: "" },
            resultFileData: { type: String, default: "" }
          },
          { _id: false }
        )
      ],
      default: []
    },
    documentUploads: {
      type: [
        new Schema(
          {
            name: { type: String, default: "" },
            type: { type: String, default: "" },
            data: { type: String, default: "" }
          },
          { _id: false }
        )
      ],
      default: []
    },
    documents: { type: Number, default: 0 },
    avatar: { type: String }
  },
  { timestamps: true }
);

const staffSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, default: "" },
    name: { type: String, required: true },
    portalRole: { type: String, default: "teacher" },
    phone: { type: String, default: "" },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    qualification: { type: String, default: "Not specified" },
    workload: { type: String, default: "To be assigned" },
    leaveBalance: { type: Number, default: 0 },
    classes: { type: String, default: "Institution-wide" }
  },
  { timestamps: true }
);

const feeSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, default: "" },
    studentName: { type: String, default: "" },
    category: { type: String, required: true },
    className: { type: String, required: true },
    dueDate: { type: String, required: true },
    amount: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    status: { type: String, default: "Pending" },
    receiptNo: { type: String, default: "" },
    lastPaymentDate: { type: String, default: "" }
  },
  { timestamps: true }
);

const announcementSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    audience: { type: String, required: true },
    type: { type: String, default: "Circular" },
    targetRoles: { type: [String], default: [] },
    deliveryMode: { type: String, default: "Instant" },
    date: { type: String, required: true },
    scheduledAt: { type: String, default: "" },
    documentName: { type: String, default: "" },
    documentType: { type: String, default: "" },
    documentData: { type: String, default: "" },
    content: { type: String, required: true },
    status: { type: String, default: "Draft" }
  },
  { timestamps: true }
);

const homeworkSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    title: { type: String, required: true },
    dueDate: { type: String, required: true },
    mode: { type: String, default: "Offline" },
    attachmentName: { type: String, default: "" },
    attachmentType: { type: String, default: "" },
    attachmentData: { type: String, default: "" },
    studentSubmission: { type: String, default: "" },
    studentSubmissionType: { type: String, default: "" },
    studentSubmissionData: { type: String, default: "" },
    completionStatus: { type: String, default: "Pending" },
    submissions: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    status: { type: String, default: "Active" }
  },
  { timestamps: true }
);

const leaveSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    applicant: { type: String, required: true },
    role: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

const examSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    className: { type: String, required: true },
    schedule: { type: String, required: true },
    examDate: { type: String, default: "" },
    uploadedBy: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileType: { type: String, default: "" },
    fileData: { type: String, default: "" },
    hallTickets: { type: String, default: "Draft" },
    resultStatus: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

const resultSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    student: { type: String, required: true },
    className: { type: String, required: true },
    exam: { type: String, required: true },
    percentage: { type: Number, default: 0 },
    grade: { type: String, default: "" },
    rank: { type: Number, default: 0 },
    approvalStatus: { type: String, default: "Pending" },
    approvedBy: { type: String, default: "" }
  },
  { timestamps: true }
);

const attendanceRecordSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    className: { type: String, required: true },
    date: { type: String, required: true },
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    late: { type: Number, default: 0 },
    markedBy: { type: String, default: "" }
  },
  { timestamps: true }
);

const timetableSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    className: { type: String, required: true },
    day: { type: String, required: true },
    period: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String, default: "" },
    room: { type: String, default: "" }
  },
  { timestamps: true }
);

const supportTicketSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    requester: { type: String, required: true },
    requesterRole: { type: String, default: "" },
    issue: { type: String, required: true },
    description: { type: String, default: "" },
    priority: { type: String, default: "Medium" },
    status: { type: String, default: "Open" },
    assignedTo: { type: String, default: "Support Team" }
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    username: { type: String, default: "", index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    linkedStudentId: { type: String, default: "" },
    linkedStaffId: { type: String, default: "" },
    accessPermissions: { type: [String], default: [] },
    responsibilities: { type: String, default: "" },
    phone: { type: String, default: "" },
    campus: { type: String, default: "" },
    avatar: { type: String, default: "" }
  },
  { timestamps: true }
);

export const TenantModel = models.Tenant || model("Tenant", tenantSchema);
export const StudentModel = models.Student || model("Student", studentSchema);
export const StaffModel = models.Staff || model("Staff", staffSchema);
export const FeeModel = models.Fee || model("Fee", feeSchema);
export const AnnouncementModel = models.Announcement || model("Announcement", announcementSchema);
export const HomeworkModel = models.Homework || model("Homework", homeworkSchema);
export const LeaveModel = models.Leave || model("Leave", leaveSchema);
export const ExamModel = models.Exam || model("Exam", examSchema);
export const ResultModel = models.Result || model("Result", resultSchema);
export const AttendanceRecordModel = models.AttendanceRecord || model("AttendanceRecord", attendanceRecordSchema);
export const TimetableModel = models.Timetable || model("Timetable", timetableSchema);
export const SupportTicketModel = models.SupportTicket || model("SupportTicket", supportTicketSchema);
export const UserModel = models.User || model("User", userSchema);
