import { Router } from "express";
import bcrypt from "bcryptjs";
import authRoutes from "./authRoutes.js";
import { createPlatformRoutes } from "./platformRoutes.js";
import { createCrudRouter } from "./crudRoutes.js";
import { repositories } from "../services/repositories.js";
import { authMiddleware, requireRoles } from "../middleware/auth.js";
import { validateRequiredFields, withAsync } from "../utils/validation.js";

function numberValue(value, fallback = 0) {
  return Number(value ?? fallback);
}

function slugifyUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
}

async function createLinkedUserAccount({
  username,
  name,
  role,
  linkedStudentId = "",
  linkedStaffId = "",
  campus = "Rahul Education Campus",
  avatar = ""
}) {
  const existing =
    (await repositories.users.findOne({ username })) ||
    (await repositories.users.findOne({ email: `${username}@educore.local` }));

  if (existing) {
    return existing;
  }

  return repositories.users.create({
    id: `user-${Date.now()}`,
    name,
    username,
    email: `${username}@educore.local`,
    password: await bcrypt.hash(username, 10),
    role,
    linkedStudentId,
    linkedStaffId,
    accessPermissions: [],
    responsibilities: "",
    phone: "",
    campus,
    avatar
  });
}

export function createApiRouter(getDbStatus) {
  const router = Router();

  router.use("/auth", authRoutes);
  router.use("/", createPlatformRoutes(getDbStatus));

  router.post(
    "/students",
    authMiddleware,
    requireRoles("super_admin", "school_admin", "vice_principal"),
    validateRequiredFields(["admissionNo", "name", "className", "parentName"]),
    withAsync(async (req, res) => {
      const record = {
        id: `stu-${Date.now()}`,
        admissionNo: req.body.admissionNo,
        applicationNo: req.body.applicationNo || "",
        name: req.body.name,
        className: req.body.className,
        parentName: req.body.parentName,
        admissionDate: req.body.admissionDate || "",
        academicHistory: req.body.academicHistory || "",
        attendance: numberValue(req.body.attendance),
        feesDue: numberValue(req.body.feesDue),
        performance: req.body.performance || "Pending",
        transportRoute: req.body.transportRoute || "Not assigned",
        busStop: req.body.busStop || "",
        busTrackingStatus: req.body.busTrackingStatus || "",
        medical: req.body.medical || "Not updated",
        bloodGroup: req.body.bloodGroup || "",
        emergencyContact: req.body.emergencyContact || "",
        siblingName: req.body.siblingName || "",
        siblingClass: req.body.siblingClass || "",
        tcIssued: req.body.tcIssued || "No",
        alumniStatus: req.body.alumniStatus || "Active",
        promotedTo: req.body.promotedTo || "",
        documentUploads: Array.isArray(req.body.documentUploads) ? req.body.documentUploads : [],
        documents: numberValue(req.body.documents ?? (Array.isArray(req.body.documentUploads) ? req.body.documentUploads.length : 0)),
        avatar:
          req.body.avatar ||
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80"
      };

      const created = await repositories.students.create(record);
      const username = String(req.body.portalUsername || req.body.admissionNo || "").trim();
      await createLinkedUserAccount({
        username,
        name: record.name,
        role: "student",
        linkedStudentId: record.id,
        campus: "Rahul Education Campus",
        avatar: record.avatar
      });

      res.status(201).json({
        ...created,
        portalUsername: username,
        initialPassword: username
      });
    })
  );

  router.post(
    "/staff",
    authMiddleware,
    requireRoles("super_admin", "school_admin", "vice_principal"),
    validateRequiredFields(["employeeId", "name", "designation", "department", "portalRole"]),
    withAsync(async (req, res) => {
      const record = {
        id: `staff-${Date.now()}`,
        employeeId: req.body.employeeId,
        name: req.body.name,
        portalRole: req.body.portalRole,
        designation: req.body.designation,
        department: req.body.department,
        qualification: req.body.qualification || "Not specified",
        workload: req.body.workload || "To be assigned",
        leaveBalance: numberValue(req.body.leaveBalance),
        classes: req.body.classes || "Institution-wide"
      };

      const created = await repositories.staff.create(record);
      const username = String(req.body.portalUsername || req.body.employeeId || slugifyUsername(req.body.name)).trim();
      await createLinkedUserAccount({
        username,
        name: record.name,
        role: req.body.portalRole,
        linkedStaffId: record.id,
        campus: "Rahul Education Campus"
      });

      res.status(201).json({
        ...created,
        portalUsername: username,
        initialPassword: username
      });
    })
  );

  router.use(
    "/support-tickets",
    createCrudRouter({
      repository: repositories.supportTickets,
      listRoles: ["super_admin", "school_admin", "vice_principal", "teacher", "student"],
      createRoles: ["super_admin", "school_admin", "vice_principal", "teacher", "student"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin"],
      requiredFields: ["requester", "requesterRole", "issue", "description"],
      buildRecord: (body) => ({
        id: `sup-${Date.now()}`,
        requester: body.requester,
        requesterRole: body.requesterRole,
        issue: body.issue,
        description: body.description || "",
        priority: body.priority || "Medium",
        status: body.status || "Open",
        assignedTo: body.assignedTo || "Support Team"
      }),
      buildUpdates: (body) => ({
        requester: body.requester,
        requesterRole: body.requesterRole,
        issue: body.issue,
        description: body.description || "",
        priority: body.priority || "Medium",
        status: body.status || "Open",
        assignedTo: body.assignedTo || "Support Team"
      })
    })
  );

  router.put(
    "/fees/:id/pay",
    authMiddleware,
    requireRoles("student"),
    withAsync(async (req, res) => {
      const fee = await repositories.fees.getById(req.params.id);
      if (!fee) {
        return res.status(404).json({ message: "Fee record not found" });
      }

      const paymentAmount = Number(req.body.amount ?? fee.pending ?? 0);
      if (paymentAmount <= 0) {
        return res.status(400).json({ message: "No pending fee amount to pay." });
      }

      const nextPaid = Number(fee.paid || 0) + paymentAmount;
      const nextPending = Math.max(Number(fee.amount || 0) - nextPaid, 0);
      const updated = await repositories.fees.update(req.params.id, {
        paid: nextPaid,
        pending: nextPending,
        status: nextPending === 0 ? "Paid" : "Partial",
        lastPaymentDate: new Date().toISOString().slice(0, 10),
        receiptNo: fee.receiptNo || `RCPT-${Date.now()}`
      });

      return res.json(updated);
    })
  );

  router.put(
    "/homework/:id/submit",
    authMiddleware,
    requireRoles("student"),
    withAsync(async (req, res) => {
      const homework = await repositories.homework.getById(req.params.id);
      if (!homework) {
        return res.status(404).json({ message: "Homework not found" });
      }

      if (homework.mode !== "Online") {
        return res.status(400).json({ message: "Only online homework can be submitted from the student portal." });
      }

      if (!req.body.studentSubmission || !req.body.studentSubmissionData) {
        return res.status(400).json({ message: "Please upload a homework file before submitting." });
      }

      const updated = await repositories.homework.update(req.params.id, {
        studentSubmission: req.body.studentSubmission,
        studentSubmissionType: req.body.studentSubmissionType || "",
        studentSubmissionData: req.body.studentSubmissionData,
        completionStatus: "Pending Review",
        submissions: Number(homework.submissions || 0) + 1
      });

      return res.json(updated);
    })
  );

  router.use(
    "/tenants",
    createCrudRouter({
      repository: repositories.tenants,
      roles: ["super_admin"],
      requiredFields: ["name", "subdomain", "board"],
      buildRecord: (body) => ({
        id: `tenant-${Date.now()}`,
        name: body.name,
        subdomain: body.subdomain,
        board: body.board,
        status: body.status || "Trial",
        plan: body.plan || "Growth",
        students: numberValue(body.students),
        activeUsers: numberValue(body.activeUsers),
        modules: numberValue(body.modules),
        mrr: numberValue(body.mrr)
      }),
      buildUpdates: (body) => ({
        name: body.name,
        subdomain: body.subdomain,
        board: body.board,
        status: body.status || "Trial",
        plan: body.plan || "Growth",
        students: numberValue(body.students),
        activeUsers: numberValue(body.activeUsers),
        modules: numberValue(body.modules),
        mrr: numberValue(body.mrr)
      })
    })
  );

  router.use(
    "/staff",
    createCrudRouter({
      repository: repositories.staff,
      listRoles: ["super_admin", "school_admin", "vice_principal"],
      createRoles: ["super_admin", "school_admin", "vice_principal"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin"],
      requiredFields: ["employeeId", "name", "designation", "department", "portalRole"],
      buildRecord: (body) => ({
        id: `staff-${Date.now()}`,
        employeeId: body.employeeId,
        name: body.name,
        portalRole: body.portalRole || "teacher",
        designation: body.designation,
        department: body.department,
        qualification: body.qualification || "Not specified",
        workload: body.workload || "To be assigned",
        leaveBalance: numberValue(body.leaveBalance),
        classes: body.classes || "Institution-wide"
      }),
      buildUpdates: (body) => ({
        employeeId: body.employeeId,
        name: body.name,
        portalRole: body.portalRole || "teacher",
        designation: body.designation,
        department: body.department,
        qualification: body.qualification || "Not specified",
        workload: body.workload || "To be assigned",
        leaveBalance: numberValue(body.leaveBalance),
        classes: body.classes || "Institution-wide"
      })
    })
  );

  router.use(
    "/students",
    createCrudRouter({
      repository: repositories.students,
      listRoles: ["super_admin", "school_admin", "vice_principal", "teacher"],
      createRoles: ["super_admin", "school_admin", "vice_principal"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin"],
      requiredFields: ["admissionNo", "name", "className", "parentName"],
      buildRecord: (body) => ({
        id: `stu-${Date.now()}`,
        admissionNo: body.admissionNo,
        applicationNo: body.applicationNo || "",
        name: body.name,
        className: body.className,
        parentName: body.parentName,
        admissionDate: body.admissionDate || "",
        academicHistory: body.academicHistory || "",
        attendance: numberValue(body.attendance),
        feesDue: numberValue(body.feesDue),
        performance: body.performance || "Pending",
        transportRoute: body.transportRoute || "Not assigned",
        busStop: body.busStop || "",
        busTrackingStatus: body.busTrackingStatus || "",
        medical: body.medical || "Not updated",
        bloodGroup: body.bloodGroup || "",
        emergencyContact: body.emergencyContact || "",
        siblingName: body.siblingName || "",
        siblingClass: body.siblingClass || "",
        tcIssued: body.tcIssued || "No",
        alumniStatus: body.alumniStatus || "Active",
        promotedTo: body.promotedTo || "",
        academicRecords: Array.isArray(body.academicRecords) ? body.academicRecords : [],
        documentUploads: Array.isArray(body.documentUploads) ? body.documentUploads : [],
        documents: numberValue(body.documents ?? (Array.isArray(body.documentUploads) ? body.documentUploads.length : 0)),
        avatar:
          body.avatar ||
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80"
      }),
      buildUpdates: (body) => ({
        admissionNo: body.admissionNo,
        applicationNo: body.applicationNo || "",
        name: body.name,
        className: body.className,
        parentName: body.parentName,
        admissionDate: body.admissionDate || "",
        academicHistory: body.academicHistory || "",
        attendance: numberValue(body.attendance),
        feesDue: numberValue(body.feesDue),
        performance: body.performance || "Pending",
        transportRoute: body.transportRoute || "Not assigned",
        busStop: body.busStop || "",
        busTrackingStatus: body.busTrackingStatus || "",
        medical: body.medical || "Not updated",
        bloodGroup: body.bloodGroup || "",
        emergencyContact: body.emergencyContact || "",
        siblingName: body.siblingName || "",
        siblingClass: body.siblingClass || "",
        tcIssued: body.tcIssued || "No",
        alumniStatus: body.alumniStatus || "Active",
        promotedTo: body.promotedTo || "",
        academicRecords: Array.isArray(body.academicRecords) ? body.academicRecords : [],
        documentUploads: Array.isArray(body.documentUploads) ? body.documentUploads : [],
        documents: numberValue(body.documents ?? (Array.isArray(body.documentUploads) ? body.documentUploads.length : 0)),
        avatar:
          body.avatar ||
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80"
      })
    })
  );

  router.use(
    "/attendance-records",
    createCrudRouter({
      repository: repositories.attendanceRecords,
      listRoles: ["super_admin", "school_admin", "vice_principal", "teacher"],
      createRoles: ["super_admin", "school_admin", "vice_principal"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin", "vice_principal"],
      requiredFields: ["className", "date", "present", "absent"],
      buildRecord: (body) => ({
        id: `att-${Date.now()}`,
        className: body.className,
        date: body.date,
        present: numberValue(body.present),
        absent: numberValue(body.absent),
        late: numberValue(body.late),
        markedBy: body.markedBy || ""
      }),
      buildUpdates: (body) => ({
        className: body.className,
        date: body.date,
        present: numberValue(body.present),
        absent: numberValue(body.absent),
        late: numberValue(body.late),
        markedBy: body.markedBy || ""
      })
    })
  );

  router.get(
    "/users",
    authMiddleware,
    requireRoles("school_admin"),
    withAsync(async (_req, res) => {
      const users = await repositories.users.list();
      res.json(
        users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessPermissions: user.accessPermissions || [],
          responsibilities: user.responsibilities || "",
          phone: user.phone,
          campus: user.campus,
          avatar: user.avatar
        }))
      );
    })
  );

  router.put(
    "/users/:id/access",
    authMiddleware,
    requireRoles("school_admin"),
    withAsync(async (req, res) => {
      const updated = await repositories.users.update(req.params.id, {
        accessPermissions: Array.isArray(req.body.accessPermissions) ? req.body.accessPermissions : [],
        responsibilities: req.body.responsibilities || ""
      });

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        accessPermissions: updated.accessPermissions || [],
        responsibilities: updated.responsibilities || "",
        phone: updated.phone,
        campus: updated.campus,
        avatar: updated.avatar
      });
    })
  );

  router.use(
    "/timetable",
    createCrudRouter({
      repository: repositories.timetable,
      listRoles: ["super_admin", "school_admin", "vice_principal", "teacher"],
      createRoles: ["super_admin", "school_admin", "vice_principal"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin"],
      requiredFields: ["className", "day", "period", "subject"],
      buildRecord: (body) => ({
        id: `tt-${Date.now()}`,
        className: body.className,
        day: body.day,
        period: body.period,
        subject: body.subject,
        teacher: body.teacher || "",
        room: body.room || ""
      }),
      buildUpdates: (body) => ({
        className: body.className,
        day: body.day,
        period: body.period,
        subject: body.subject,
        teacher: body.teacher || "",
        room: body.room || ""
      })
    })
  );

  router.use(
    "/exams",
    createCrudRouter({
      repository: repositories.exams,
      listRoles: ["super_admin", "school_admin", "vice_principal", "teacher"],
      createRoles: ["super_admin", "school_admin", "vice_principal"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin"],
      requiredFields: ["name", "className", "schedule"],
      buildRecord: (body) => ({
        id: `exam-${Date.now()}`,
        name: body.name,
        className: body.className,
        schedule: body.schedule,
        examDate: body.examDate || "",
        uploadedBy: body.uploadedBy || "",
        fileName: body.fileName || "",
        fileType: body.fileType || "",
        fileData: body.fileData || "",
        hallTickets: body.hallTickets || "Draft",
        resultStatus: body.resultStatus || "Pending"
      }),
      buildUpdates: (body) => ({
        name: body.name,
        className: body.className,
        schedule: body.schedule,
        examDate: body.examDate || "",
        uploadedBy: body.uploadedBy || "",
        fileName: body.fileName || "",
        fileType: body.fileType || "",
        fileData: body.fileData || "",
        hallTickets: body.hallTickets || "Draft",
        resultStatus: body.resultStatus || "Pending"
      })
    })
  );

  router.use(
    "/results",
    createCrudRouter({
      repository: repositories.results,
      listRoles: ["super_admin", "school_admin", "vice_principal", "teacher"],
      createRoles: ["super_admin", "school_admin", "vice_principal"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin"],
      requiredFields: ["student", "className", "exam", "percentage", "grade"],
      buildRecord: (body) => ({
        id: `res-${Date.now()}`,
        student: body.student,
        className: body.className,
        exam: body.exam,
        percentage: numberValue(body.percentage),
        grade: body.grade,
        rank: numberValue(body.rank),
        approvalStatus: body.approvalStatus || "Pending",
        approvedBy: body.approvedBy || ""
      }),
      buildUpdates: (body) => ({
        student: body.student,
        className: body.className,
        exam: body.exam,
        percentage: numberValue(body.percentage),
        grade: body.grade,
        rank: numberValue(body.rank),
        approvalStatus: body.approvalStatus || "Pending",
        approvedBy: body.approvedBy || ""
      })
    })
  );

  router.use(
    "/fees",
    createCrudRouter({
      repository: repositories.fees,
      listRoles: ["super_admin", "school_admin", "vice_principal", "teacher", "student"],
      createRoles: ["super_admin", "school_admin", "vice_principal"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin"],
      requiredFields: ["studentName", "category", "className", "dueDate"],
      buildRecord: (body) => ({
        id: `fee-${Date.now()}`,
        studentId: body.studentId || "",
        studentName: body.studentName || "",
        category: body.category,
        className: body.className,
        dueDate: body.dueDate,
        amount: numberValue(body.amount),
        paid: numberValue(body.paid),
        pending: numberValue(body.pending ?? body.amount),
        status: body.status || "Pending",
        receiptNo: body.receiptNo || `RCPT-${Date.now()}`,
        lastPaymentDate: body.lastPaymentDate || ""
      }),
      buildUpdates: (body) => ({
        studentId: body.studentId || "",
        studentName: body.studentName || "",
        category: body.category,
        className: body.className,
        dueDate: body.dueDate,
        amount: numberValue(body.amount),
        paid: numberValue(body.paid),
        pending: numberValue(body.pending ?? body.amount),
        status: body.status || "Pending",
        receiptNo: body.receiptNo || "",
        lastPaymentDate: body.lastPaymentDate || ""
      })
    })
  );

  router.use(
    "/announcements",
    createCrudRouter({
      repository: repositories.announcements,
      listRoles: ["school_admin", "vice_principal", "teacher", "super_admin"],
      createRoles: ["school_admin", "vice_principal", "super_admin"],
      updateRoles: ["school_admin", "vice_principal", "super_admin"],
      deleteRoles: ["school_admin", "super_admin"],
      requiredFields: ["title", "audience", "date", "content"],
      buildRecord: (body) => ({
        id: `ann-${Date.now()}`,
        title: body.title,
        audience: body.audience,
        type: body.type || "Circular",
        targetRoles: Array.isArray(body.targetRoles) ? body.targetRoles : [],
        deliveryMode: body.deliveryMode || "Instant",
        date: body.date,
        scheduledAt: body.scheduledAt || "",
        documentName: body.documentName || "",
        documentType: body.documentType || "",
        documentData: body.documentData || "",
        content: body.content,
        status: body.status || "Draft"
      }),
      buildUpdates: (body) => ({
        title: body.title,
        audience: body.audience,
        type: body.type || "Circular",
        targetRoles: Array.isArray(body.targetRoles) ? body.targetRoles : [],
        deliveryMode: body.deliveryMode || "Instant",
        date: body.date,
        scheduledAt: body.scheduledAt || "",
        documentName: body.documentName || "",
        documentType: body.documentType || "",
        documentData: body.documentData || "",
        content: body.content,
        status: body.status || "Draft"
      })
    })
  );

  router.use(
    "/homework",
    createCrudRouter({
      repository: repositories.homework,
      listRoles: ["school_admin", "vice_principal", "teacher", "super_admin", "student"],
      createRoles: ["school_admin", "vice_principal", "teacher", "super_admin"],
      updateRoles: ["school_admin", "vice_principal", "teacher", "super_admin"],
      deleteRoles: ["school_admin", "vice_principal", "teacher", "super_admin"],
      requiredFields: ["subject", "className", "title", "dueDate"],
      buildRecord: (body) => ({
        id: `hw-${Date.now()}`,
        subject: body.subject,
        className: body.className,
        title: body.title,
        dueDate: body.dueDate,
        mode: body.mode || "Offline",
        attachmentName: body.attachmentName || "",
        attachmentType: body.attachmentType || "",
        attachmentData: body.attachmentData || "",
        studentSubmission: body.studentSubmission || "",
        studentSubmissionType: body.studentSubmissionType || "",
        studentSubmissionData: body.studentSubmissionData || "",
        completionStatus: body.completionStatus || "Pending",
        submissions: numberValue(body.submissions),
        totalStudents: numberValue(body.totalStudents),
        status: body.status || "Active"
      }),
      buildUpdates: (body) => ({
        subject: body.subject,
        className: body.className,
        title: body.title,
        dueDate: body.dueDate,
        mode: body.mode || "Offline",
        attachmentName: body.attachmentName || "",
        attachmentType: body.attachmentType || "",
        attachmentData: body.attachmentData || "",
        studentSubmission: body.studentSubmission || "",
        studentSubmissionType: body.studentSubmissionType || "",
        studentSubmissionData: body.studentSubmissionData || "",
        completionStatus: body.completionStatus || "Pending",
        submissions: numberValue(body.submissions),
        totalStudents: numberValue(body.totalStudents),
        status: body.status || "Active"
      })
    })
  );

  router.use(
    "/leaves",
    createCrudRouter({
      repository: repositories.leaves,
      listRoles: ["super_admin", "school_admin", "teacher", "vice_principal"],
      createRoles: ["super_admin", "school_admin", "teacher", "vice_principal"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin", "vice_principal"],
      requiredFields: ["applicant", "role", "from", "to", "reason"],
      buildRecord: (body) => ({
        id: `leave-${Date.now()}`,
        applicant: body.applicant,
        role: body.role,
        from: body.from,
        to: body.to,
        reason: body.reason,
        status: body.status || "Pending"
      }),
      buildUpdates: (body) => ({
        applicant: body.applicant,
        role: body.role,
        from: body.from,
        to: body.to,
        reason: body.reason,
        status: body.status || "Pending"
      })
    })
  );

  return router;
}
