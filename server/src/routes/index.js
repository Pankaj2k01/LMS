import { Router } from "express";
import authRoutes from "./authRoutes.js";
import { createPlatformRoutes } from "./platformRoutes.js";
import { createCrudRouter } from "./crudRoutes.js";
import { repositories } from "../services/repositories.js";

function numberValue(value, fallback = 0) {
  return Number(value ?? fallback);
}

export function createApiRouter(getDbStatus) {
  const router = Router();

  router.use("/auth", authRoutes);
  router.use("/", createPlatformRoutes(getDbStatus));

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
        name: body.name,
        className: body.className,
        parentName: body.parentName,
        attendance: numberValue(body.attendance),
        feesDue: numberValue(body.feesDue),
        performance: body.performance || "Pending",
        transportRoute: body.transportRoute || "Not assigned",
        medical: body.medical || "Not updated",
        documents: numberValue(body.documents),
        avatar:
          body.avatar ||
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80"
      }),
      buildUpdates: (body) => ({
        admissionNo: body.admissionNo,
        name: body.name,
        className: body.className,
        parentName: body.parentName,
        attendance: numberValue(body.attendance),
        feesDue: numberValue(body.feesDue),
        performance: body.performance || "Pending",
        transportRoute: body.transportRoute || "Not assigned",
        medical: body.medical || "Not updated",
        documents: numberValue(body.documents),
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
      createRoles: ["super_admin", "school_admin", "vice_principal", "teacher"],
      updateRoles: ["super_admin", "school_admin", "vice_principal", "teacher"],
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
      listRoles: ["super_admin", "school_admin", "vice_principal", "teacher"],
      createRoles: ["super_admin", "school_admin", "vice_principal"],
      updateRoles: ["super_admin", "school_admin", "vice_principal"],
      deleteRoles: ["super_admin", "school_admin"],
      requiredFields: ["category", "className", "dueDate"],
      buildRecord: (body) => ({
        id: `fee-${Date.now()}`,
        studentName: body.studentName || "",
        category: body.category,
        className: body.className,
        dueDate: body.dueDate,
        amount: numberValue(body.amount),
        paid: numberValue(body.paid),
        pending: numberValue(body.pending ?? body.amount),
        status: body.status || "Pending"
      }),
      buildUpdates: (body) => ({
        studentName: body.studentName || "",
        category: body.category,
        className: body.className,
        dueDate: body.dueDate,
        amount: numberValue(body.amount),
        paid: numberValue(body.paid),
        pending: numberValue(body.pending ?? body.amount),
        status: body.status || "Pending"
      })
    })
  );

  router.use(
    "/announcements",
    createCrudRouter({
      repository: repositories.announcements,
      roles: ["school_admin", "vice_principal", "teacher", "super_admin"],
      requiredFields: ["title", "audience", "date", "content"],
      buildRecord: (body) => ({
        id: `ann-${Date.now()}`,
        title: body.title,
        audience: body.audience,
        type: body.type || "Circular",
        date: body.date,
        content: body.content,
        status: body.status || "Draft"
      }),
      buildUpdates: (body) => ({
        title: body.title,
        audience: body.audience,
        type: body.type || "Circular",
        date: body.date,
        content: body.content,
        status: body.status || "Draft"
      })
    })
  );

  router.use(
    "/homework",
    createCrudRouter({
      repository: repositories.homework,
      roles: ["school_admin", "vice_principal", "teacher", "super_admin"],
      requiredFields: ["subject", "className", "title", "dueDate"],
      buildRecord: (body) => ({
        id: `hw-${Date.now()}`,
        subject: body.subject,
        className: body.className,
        title: body.title,
        dueDate: body.dueDate,
        mode: body.mode || "Offline",
        studentSubmission: body.studentSubmission || "",
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
        studentSubmission: body.studentSubmission || "",
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
