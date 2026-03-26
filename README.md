# EduCore

EduCore is a school LMS and management portal built for a single-school deployment with linked academic, operational, and support workflows.

## Stack

- React + Tailwind CSS
- Node.js + Express
- MongoDB
- JWT authentication
- File attachments stored on records for local deployment and review

## Current Product Scope

EduCore currently includes these working modules:
- Overview Dashboard
- School Onboarding & Configuration
- Student Information System
- Staff Management
- Attendance
- Timetable Management
- Exams & Results
- Fee Management
- Homework & Assignment Management
- Library
- Transport
- Academic Content
- Reports
- Notifications / Circulars
- Leave Applications
- Help & Support
- Settings / Access Control

## Roles

Supported roles:
- `super_admin`
- `school_admin`
- `principal`
- `vice_principal`
- `academic_coordinator`
- `teacher`
- `class_teacher`
- `subject_teacher`
- `accountant`
- `hr_admin`
- `librarian`
- `transport_manager`
- `driver`
- `support_helpdesk`
- `student`

Role intent:
- `super_admin`: system oversight and admin access
- `school_admin`: principal-level institutional control
- `principal`: academic and management authority with report monitoring
- `vice_principal`: academic and operational supervision
- `academic_coordinator`: timetable, syllabus, and assignment supervision
- `teacher`: class-scoped academic workflows
- `class_teacher`: attendance, student leave, homework, class fee visibility
- `subject_teacher`: marks entry, homework, assigned classes
- `accountant`: fee, dues, and finance reporting workflows
- `hr_admin`: staff, leave, and staff attendance management
- `librarian`: library desk and issue-return visibility
- `transport_manager`: route, ETA, and student transport operations
- `driver`: assigned route and student transport visibility
- `support_helpdesk`: ticket handling and support response workflows
- `student`: self-scoped portal with linked fee, attendance, result, homework, transport, and notices

Parent-facing behavior is handled through the student account for the current release.

## Working Features

### Student Information System

Management can:
- add students
- edit students
- assign class and section
- upload student documents
- maintain medical info
- maintain sibling linkage
- manage admission details
- track promotion
- track TC status
- track alumni status
- maintain academic history

Students can:
- view only personal details
- view admission record
- view sibling and medical details
- view transport and bus tracking details
- download uploaded documents
- view academic-year-wise history

Included student fields:
- admission number
- application number
- class
- parent name
- admission date
- academic history
- academic-year records
- attendance
- performance
- fee due
- transport route
- bus stop
- bus tracking status
- medical notes
- blood group
- emergency contact
- sibling info
- TC issued
- alumni status
- promoted to
- uploaded documents

Management-side student operations:
- bulk import template download
- promotion sheet download
- TC register download
- bus tracking list download

### Staff Management

Higher roles can:
- add staff
- edit staff
- assign portal role
- assign class responsibility
- manage leave balance
- manage workload

When a new staff member is created:
- a linked login account is created automatically
- first login username defaults to `employeeId` or assigned username
- first login password is the same as the username

### Student Login Creation

When a new student is created:
- a linked login account is created automatically
- first login username defaults to `admissionNo` or assigned username
- first login password is the same as the username

### Attendance

Management can:
- create attendance entries
- edit attendance entries
- view all attendance records

Teachers can:
- view student attendance for assigned class

Students can:
- view only personal attendance-related information
- view attendance dates in calendar-style view

Calendar visibility:
- open `Attendance`
- the `Attendance Calendar` panel is shown near the top of the attendance page

### Timetable Management

Management can:
- create timetable entries
- update timetable rows
- publish weekly schedules by class
- download weekly timetable by class

Teachers can:
- view their weekly lecture timetable

Students can:
- view their class timetable
- download timetable from the timetable and exams views

Calendar visibility:
- open `Timetable`
- the `Weekly Timetable Calendar` panel is shown at the top of the timetable page

### Exams & Results

Management can:
- upload exam timetable
- attach timetable documents
- create results
- approve results
- publish results

Teachers can:
- view class timetable
- view assigned class results

Students can:
- view timetable
- download timetable files
- view personal results
- download academic-year result summaries

### Fee Management

Management can:
- create fee records
- update fee records
- see collection and pending summaries
- download receipts

Teachers can:
- see fee status of students in their class
- see paid and pending amount

Students can:
- see only personal fee ledger
- see paid and pending amount
- use `Pay Now` when amount is pending
- download fee receipt

Fee receipt includes:
- receipt number
- student name
- class
- category
- total amount
- paid amount
- pending amount
- due date
- last payment date
- status
- generated date

### Homework & Assignments

Teachers and management can:
- create homework
- choose `Online` or `Offline`
- upload homework attachments
- track submission counts
- review student submissions

Students can:
- download homework attachments
- upload completed work for online assignments
- submit PDF, DOC, DOCX, or image files

### Notifications / Circulars

Features:
- dashboard announcement ticker
- notifications page
- role-based targeting
- scheduled or instant publishing
- uploaded notice document
- notice download
- calendar-style announcement view

Calendar visibility:
- open `Notifications`
- the `Notification Calendar` panel is shown near the top of the notifications page

Examples:
- holiday circular
- urgent closure notice
- fee due reminder
- general school circular

### Transport

Transport module includes:
- route list
- assigned route visibility
- vehicle number
- driver name
- ETA
- trip status

Student transport visibility is separate from the student profile and available in the dedicated module too.

### Library

Includes:
- library dashboard for librarian
- book catalogue view
- issue-return status
- due-date visibility
- student/library record visibility based on role

### Academic Content

Includes:
- chapter-wise subject progress
- completion percentage
- resource counts
- student content visibility

### Reports

Includes:
- fee summaries
- attendance-related reports
- academic reporting views
- export-ready tables

### Leave Applications

Teachers can:
- apply for leave

Management can:
- review leave requests
- approve or reject based on role hierarchy

Students can:
- view personal leave-related records from scoped portal data

### Help & Support

Includes:
- support queue view
- support contact section
- support request form
- ticket submission into the support list

## Authentication

Auth is JWT-based.

Login supports:
- email
- username

Forgot password:
- available directly on the login screen
- accepts email or username
- uses backend route `POST /api/auth/forgot-password`
- delivery depends on OTP/SMS configuration in `server/.env`

Current seeded access:
- `superadmin@sms.com` / `super123`
- `admin@sms.com` / `admin123`
- `principal@sms.com` / `principal123`
- `vice@sms.com` / `vice123`
- `coordinator@sms.com` / `coordinator123`
- `teacher@sms.com` / `teacher123`
- `classteacher@sms.com` / `classteacher123`
- `subjectteacher@sms.com` / `subjectteacher123`
- `accountant@sms.com` / `accountant123`
- `hr@sms.com` / `hr123`
- `librarian@sms.com` / `librarian123`
- `transport@sms.com` / `transport123`
- `driver@sms.com` / `driver123`
- `helpdesk@sms.com` / `helpdesk123`
- `student@sms.com` / `student123`

## File Upload Support

Current file-capable areas:
- student documents
- exam timetable files
- notification / circular documents
- homework attachments
- student homework submission files

## Project Structure

```text
.
├── server
│   ├── config
│   ├── controllers
│   ├── data
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   └── utils
└── web
    ├── src
    └── public
```

Important files:
- `server/src/index.js`
- `server/src/routes/index.js`
- `server/src/controllers/authController.js`
- `server/src/controllers/platformController.js`
- `server/src/models/coreModels.js`
- `server/src/data/mockData.js`
- `server/src/data/persistence.js`
- `web/src/App.jsx`
- `web/src/lib/api.js`

## Environment

Create `server/.env`:

```env
PORT=5001
JWT_SECRET=change-this-secret
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://127.0.0.1:5175
CLIENT_URLS=http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://localhost:5173,http://localhost:5174,http://localhost:5175
```

Create `web/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:5001/api
```

## Run Locally

Install:

```bash
npm --prefix server install
npm --prefix web install
```

Start backend:

```bash
npm run start:api
```

Start frontend:

```bash
cd /Users/pankajnebbulalyadav/Documents/LMS/web
npm run dev -- --host 127.0.0.1 --port 5174
```

Open:
- Frontend: [http://127.0.0.1:5175/](http://127.0.0.1:5175/)
- Backend health: [http://127.0.0.1:5001/api/health](http://127.0.0.1:5001/api/health)

## Deployment Files

Deployment-ready config files added:
- [render.yaml](/Users/pankajnebbulalyadav/Documents/LMS/render.yaml)
- [vercel.json](/Users/pankajnebbulalyadav/Documents/LMS/vercel.json)

Recommended deployment:
- use `Render` for backend API
- use `Render Static Site` or `Vercel` for frontend

After backend deployment, your future mobile/web apps should use:
- `VITE_API_BASE_URL=https://your-api-domain/api`

Examples:
- `https://educore-api.onrender.com/api`
- `https://api.yourschooldomain.com/api`

## Build Check

Frontend:

```bash
cd /Users/pankajnebbulalyadav/Documents/LMS/web
npm run build
```

Backend syntax checks:

```bash
node --check server/src/routes/index.js
node --check server/src/controllers/platformController.js
node --check server/src/controllers/authController.js
```

## Deployment Notes

The current project is ready for local deployment and client demo / handover of the active web LMS scope.

Provider-backed features still require production credentials and deployment configuration:
- SMS gateway
- forgot-password OTP or email reset
- live GPS bus tracking
- payment gateway processing
- cloud file storage and signed delivery

These areas are integration-ready in product structure, but need provider setup before they can be treated as full production services.

Public deployment note:
- I can prepare deployment files in the repo
- but I cannot generate the final public Render/Vercel URL from here unless you deploy it from your own Render/Vercel account

## Where To Change Credentials

Paste production credentials in:
- [server/.env.example](/Users/pankajnebbulalyadav/Documents/LMS/server/.env.example)
  After copying it to `server/.env`

Main config readers:
- [server/src/config/env.js](/Users/pankajnebbulalyadav/Documents/LMS/server/src/config/env.js)
- [server/src/config/providers.js](/Users/pankajnebbulalyadav/Documents/LMS/server/src/config/providers.js)

If another developer needs to wire a provider, these are the first files to open.

### Payment Gateway

Edit in:
- `server/.env`

Keys:
- `PAYMENT_GATEWAY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYU_MERCHANT_KEY`
- `PAYU_SALT`

Where to get them:
- Razorpay Dashboard
- Stripe Dashboard
- PayU Merchant Dashboard

### SMS / Notification Gateway

Edit in:
- `server/.env`

Keys:
- `SMS_PROVIDER`
- `SMS_API_KEY`
- `SMS_SENDER_ID`
- `SMS_BASE_URL`

Where to get them:
- MSG91
- Textlocal
- Twilio
- Exotel

### OTP / Forgot Password

Edit in:
- `server/.env`

Keys:
- `OTP_PROVIDER`
- `OTP_API_KEY`
- `OTP_TEMPLATE_ID`

Where to get them:
- your OTP provider dashboard
- your SMS provider dashboard if OTP is delivered through SMS
- Firebase Auth or third-party OTP service dashboard

### GPS / Bus Tracking

Edit in:
- `server/.env`

Keys:
- `GPS_PROVIDER`
- `GPS_API_KEY`
- `GPS_BASE_URL`
- `GPS_DEVICE_TOKEN`

Where to get them:
- GPS vendor admin portal
- bus GPS device vendor dashboard

### File Storage

Edit in:
- `server/.env`

Keys:
- `STORAGE_PROVIDER`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_BUCKET_NAME`

Where to get them:
- Cloudinary Console
- AWS IAM and S3 Console

### Firebase / Push Notifications

Edit in:
- `server/.env`

Keys:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Where to get them:
- Firebase Console
- Google Cloud service account credentials

### School Branding / Deployment

Edit in:
- `server/.env`
- `web/.env`

Keys:
- `SCHOOL_NAME`
- `SCHOOL_ADDRESS`
- `APP_BASE_URL`
- `SUPPORT_EMAIL`
- `SUPPORT_PHONE`
- `VITE_API_BASE_URL`
- `VITE_APP_NAME`
