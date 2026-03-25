# learning Platform Blueprint

## 1. Vision

`learning` is a multi-tenant school and college operating system that serves platform admins, institution admins, teachers, accountants, students, parents, librarians, and transport staff through a unified web and mobile ecosystem.

This repository currently contains the first web starter for that product. The target platform described below is the larger production direction.

## 2. Success Metrics

| KPI | Target |
| --- | --- |
| Schools/Colleges Onboarded | 100+ |
| Monthly Active Users (MAU) | 50,000+ |
| Mobile App Downloads | 25,000+ |
| System Uptime | 99.9% SLA |
| API Response Time (P95) | < 300ms |
| Customer NPS Score | > 55 |
| Fee Collection via Platform | 80% of enrolled schools |

## 3. Platform Architecture Overview

The long-term platform should use a service-oriented architecture with clear tenant isolation and independent deployment units where needed.

| Layer | Technology | Purpose |
| --- | --- | --- |
| Super Admin Dashboard | React.js + admin API consumer | Platform-wide management, school onboarding, analytics |
| School Portal (White-label) | React.js | Institution-specific branded web experience |
| Backend Services | Node.js + TypeScript + Express.js | Core business logic, orchestration, multi-tenant APIs |
| Mobile Applications | React Native | Student, Parent, Teacher mobile experience |
| Database Layer | PostgreSQL + Redis + MongoDB | Transactional data, caching, documents |
| Real-time Layer | Socket.io / WebSockets | Live notifications, chat, attendance updates |
| Storage | AWS S3 / Cloudflare R2 | Documents, images, homework files, report cards |
| Authentication | JWT + OAuth2 + OTP | Multi-role authentication and session security |

## 4. Recommended Backend Service Boundaries

For production scale, split the backend into these logical services:

1. `identity-service`
   Handles login, OTP, JWT, refresh tokens, role claims, password resets, and audit events.
2. `tenant-service`
   Handles school onboarding, subscription plans, white-label branding, module flags, and tenant config.
3. `sis-service`
   Handles student records, parent links, admissions, staff profiles, class setup, and documents.
4. `academic-service`
   Handles timetable, attendance, homework, syllabus, exams, marks, report cards, and analytics inputs.
5. `finance-service`
   Handles fee structures, invoices, payment reconciliation, discounts, day books, receipts, and reminders.
6. `communication-service`
   Handles announcements, templates, SMS/email/push/WhatsApp delivery, in-app messaging, and read receipts.
7. `operations-service`
   Handles leave, transport, library, support tickets, and workflow approvals.
8. `reporting-service`
   Handles exports, scheduled reports, dashboards, and KPI aggregation.

## 5. Multi-Tenancy Model

Each school or college must operate as an isolated tenant with:

- Unique subdomain such as `schoolname.learning.in`
- Custom branding including logo, colors, and communication templates
- Row-level tenant isolation in transactional databases
- Tenant-scoped file storage paths
- Module enablement based on plan and contract
- Independent academic calendars, grading schemes, fee plans, and notification rules

### 5.1 Tenant Isolation Rules

- Every transactional record must carry `tenant_id`
- Every authenticated request must include tenant context from subdomain or token claims
- Reports, exports, caches, and queues must be tenant-aware
- Support users may access tenant data only through controlled, audited impersonation or read-only support tools

## 6. Roles and Access

### 6.1 Platform-Level Roles

| Role | Access Scope | Description |
| --- | --- | --- |
| Super Admin | All tenants | Platform team managing onboarding, plans, billing, platform health |
| Support Agent | All tenants (read) | Support staff for issue resolution and tenant visibility |

### 6.2 Institution-Level Roles

| Role | Module Access | Description |
| --- | --- | --- |
| School Admin | Full institution | Principal or admin staff controlling all modules |
| Vice Principal | Partial admin | Academic, staff, communication supervision |
| Teacher / Faculty | Class and subject scoped | Attendance, homework, marks, timetable |
| Class Teacher | Homeroom scoped | Additional class-level communication and oversight |
| Accountant | Fee module | Fee collection, dues, receipts, financial reports |
| Librarian | Library module | Book issue, return, inventory |
| Student | Self scoped | Dashboard, results, timetable, homework, attendance |
| Parent / Guardian | Child scoped | Child data, fees, communication, leave |
| Transport Staff | Transport module | Routes, boarding, GPS operations |

## 7. Phase 1 Module Scope

### Module 01. Super Admin Dashboard

Core capabilities:

- School onboarding and tenant creation
- Subscriptions, trials, activation, deactivation
- Platform analytics including schools, students, MAU, MRR
- Broadcast announcements and feature flags
- Support tickets, invoices, audit logs, global settings

Primary widgets:

- Total schools by status
- Total platform students
- MRR chart
- New onboarded schools
- Uptime and API health
- Top 10 active schools

### Module 02. School Onboarding and Configuration

Wizard steps:

- School profile
- Academic setup
- Classes and sections
- Subjects and curriculum
- Staff setup
- Student import
- Fee structure
- Branding
- Module configuration
- Go-live review

Configuration coverage:

- Academic calendar
- Holidays and exam schedules
- Grading scheme
- Attendance rules
- Notification preferences
- Multi-language support

### Module 03. Student Information System

Core capabilities:

- Student master profile
- Parent and guardian logins
- Admission records and academic history
- Document uploads
- Medical info and sibling linkage
- Bulk imports, promotions, TC generation, alumni tracking

### Module 04. Staff and Teacher Management

Core capabilities:

- Staff profile, qualification, documents, leave balances
- Class and subject assignments
- Workload views
- Substitute allocation

### Module 05. Attendance Management

Core capabilities:

- Daily and period-wise attendance
- Biometric and QR support
- Parent absence notifications
- Attendance shortage alerts
- Student and staff leave linkage

### Module 06. Timetable Management

Core capabilities:

- Drag-and-drop builder
- Conflict detection
- Auto-generation by constraints
- Lab scheduling
- Substitute timetable handling
- PDF publishing

### Module 07. Examination and Result Management

Core capabilities:

- Exam configuration and scheduling
- Hall tickets and seating plans
- Marks entry and validation
- Grade rules and co-scholastic scoring
- Report cards, rank, comparisons, consolidated results

### Module 08. Fee Management

Core capabilities:

- Class-wise and student-wise fee structure
- Installments, discounts, waivers, late fees
- Online and offline collection
- PDF receipt generation
- Student ledgers, day book, dues aging, reminders, financial summary

### Module 09. Homework and Assignment Management

Core capabilities:

- Teacher homework creation
- Attachments up to defined size limits
- Calendar views
- Student submissions
- Teacher review and grading
- Parent reminders and analytics

### Module 10. Leave Application Management

Core capabilities:

- Student leave workflows
- Staff leave workflows
- Multi-level approvals
- Certificate uploads
- Leave history and balances

### Module 11. Notification and Communication

Core capabilities:

- SMS, email, push, WhatsApp delivery
- Audience targeting and scheduling
- Templates with variables
- Triggered automation
- Parent-teacher messaging
- Circular board and read receipts

### Module 12. Library Management

Core capabilities:

- Catalogue and inventory
- Barcode or QR issue-return flows
- Fines, reservations, low-stock alerts
- Student book history
- Digital resources

### Module 13. Transport Management

Core capabilities:

- Routes, stops, timings
- Driver and conductor assignment
- Student pickup and drop mapping
- GPS live tracking
- Parent ETA alerts
- Fleet maintenance records

### Module 14. Academic Content and Syllabus

Core capabilities:

- Chapter-wise syllabus upload
- Completion tracking
- Notes, PDFs, videos
- External links and resources
- Student content library
- Question bank

### Module 15. Reports and Analytics

Core capabilities:

- Academic performance reports
- Administrative reports
- Fee summaries and dues
- Staff attendance and leave analytics
- Admission and withdrawal trends
- Interactive charts and exports

### Module 16. Mobile Application

Channels:

- Student App
- Parent App
- Teacher App

Core capabilities:

- Attendance, homework, exams, results, fees, notifications
- Teacher quick actions such as attendance and marks entry
- Parent payment, leave, communication, and transport tracking

## 8. Data Model Foundations

Core entities expected in Phase 1:

- Tenant
- SubscriptionPlan
- TenantModule
- User
- UserRole
- Student
- Parent
- Staff
- Class
- Section
- Subject
- Enrollment
- AttendanceRecord
- LeaveRequest
- TimetableSlot
- Exam
- ExamSchedule
- MarkEntry
- ReportCard
- FeePlan
- FeeInvoice
- FeePayment
- Announcement
- Conversation
- Homework
- HomeworkSubmission
- LibraryBook
- LibraryTransaction
- TransportRoute
- Vehicle
- SupportTicket
- AuditLog

## 9. Non-Functional Requirements

### 9.1 Performance

- P95 read APIs under 300ms for common dashboard and list views
- Redis caching for dashboard counters, tenant config, and frequently-read lists
- Async processing for notifications, exports, and report generation

### 9.2 Reliability

- 99.9% SLA target
- Health checks for every service
- Centralized error tracking
- Retry queues for external provider calls

### 9.3 Security

- JWT access tokens with refresh rotation
- OTP-based verification for sensitive flows
- Audit logs for admin actions
- Tenant-aware authorization policies
- Encrypted secrets and provider credentials
- Signed URLs for document access

### 9.4 Observability

- Request tracing
- Tenant-aware logs
- Platform-level metrics dashboards
- SLA and latency alerting

## 10. Current Repository Position

This repository currently provides:

- A React + Tailwind web starter
- An Express API starter with JWT auth
- Demo dashboards for school operations

It does not yet provide:

- True multi-tenant subdomain routing
- TypeScript microservices
- PostgreSQL and Redis production schema
- Full Phase 1 module implementation
- White-label tenant theming engine
- Event-driven notification pipelines

## 11. Recommended Product Strategy

Build this in release waves:

1. Foundation
   Deliver identity, tenancy, SIS basics, dashboards, and fee plus communication core.
2. Academic Core
   Deliver attendance, timetable, homework, exams, results, and report cards.
3. Operations
   Deliver leave, library, transport, and messaging refinements.
4. Platform Expansion
   Deliver advanced analytics, automation, marketplace-style integrations, and scale tuning.
