# EduCore

EduCore is a school web portal focused on teacher, student, and higher-management workflows for a single school deployment.

Current stack:
- React + Tailwind CSS
- Node.js + Express
- MongoDB
- JWT authentication
- In-record file upload storage for local/demo use

## Active Scope

EduCore currently includes these live modules:
- Student Information System
- Attendance
- Exams & Results
- Fee Management
- Homework Management
- Notifications / Circulars
- Leave Applications
- Settings / Access Control

This project is currently designed around one school, not a multi-tenant SaaS release.

## Roles

Supported roles in the current build:
- `super_admin`
- `school_admin`
- `vice_principal`
- `teacher`
- `student`

Role behavior:
- `super_admin`, `school_admin`, and `vice_principal` manage school operations
- `teacher` works with class-level academic and fee visibility
- `student` sees only personal records and student-facing workflows

## Module Details

### 1. Student Information System

Management can:
- add student profiles
- edit student details
- assign class/section
- maintain admission details
- maintain academic history
- upload student documents
- track promotion, TC, alumni status, and bus tracking

Student can:
- see only personal details
- see admission record
- see academic history
- see medical and sibling details
- see transport route, bus stop, and bus tracking
- download uploaded documents

Included student fields:
- student master profile
- admission number
- application number
- parent name
- class/section
- admission date
- academic history
- attendance %
- performance
- fee due
- transport route
- bus stop
- bus tracking status
- medical notes
- blood group
- emergency contact
- sibling linkage
- TC issued
- alumni status
- promoted to
- document uploads

Management-side student operations:
- bulk import template download
- promotion sheet download
- TC register download
- bus tracking list download

### 2. Attendance

`school_admin`, `vice_principal`, and `super_admin` can:
- view all attendance
- create daily attendance entries
- edit attendance entries
- delete attendance entries

`teacher` can:
- view student attendance information for assigned class
- view student details with academic and fee status

`student` can:
- see only personal attendance information
- see attendance percentage
- see attendance-related dates logged for class

### 3. Exams & Results

Management can:
- upload exam timetable
- attach exam timetable file
- edit and delete timetable records
- create results
- approve results
- publish results

Teachers can:
- view exam timetable
- download exam timetable
- view results for assigned class

Students can:
- view class exam timetable
- download uploaded timetable files
- view personal result records

Included features:
- week-wise timetable
- downloadable weekly class timetable
- downloadable exam timetable
- result approval workflow

### 4. Fee Management

Management can:
- create fee records
- edit fee records
- delete fee records
- view collection and pending dashboards
- download fee receipts

Teachers can:
- see fee status of students in their class
- see paid amount
- see pending amount
- download fee receipts

Students can:
- see only personal fee ledger
- see total fee, paid amount, and pending amount
- use `Pay Now` when fee is pending
- download fee receipt

Fee receipt includes:
- receipt number
- student name
- class/section
- fee category
- total amount
- paid amount
- pending amount
- due date
- last payment date
- status
- generated date

### 5. Homework Management

Teachers and management can:
- create homework
- choose `Online` or `Offline`
- upload homework file (`PDF`, `DOC`, `DOCX`, images)
- track submissions
- review completion status

Students can:
- see only class homework
- download homework attachment
- for online homework, upload completed work
- submit completed work as `PDF`, `DOC`, `DOCX`, or image

Teacher-side visibility:
- teachers can see submitted student file
- teachers can download submitted student work

### 6. Notifications / Circulars

EduCore includes a centralized notification broadcaster for announcements like:
- holiday notice
- urgent school closure
- fee due reminder
- general circular

Features:
- broadcast across dashboard and web portal
- running announcement strip on the main page
- instant or scheduled delivery
- role-based targeting
- file upload support for `PDF`, images, `DOC`, `DOCX`
- document download from the notification card

### 7. Leave Applications

Teachers can:
- apply for leave

Students can:
- view own leave-related status items from portal scope

Management can:
- view leave requests
- approve or reject leave based on role hierarchy

## Authentication

Auth is JWT-based.

Current seeded demo accounts:
- `superadmin@sms.com` / `super123`
- `admin@sms.com` / `admin123`
- `vice@sms.com` / `vice123`
- `teacher@sms.com` / `teacher123`
- `student@sms.com` / `student123`

## File Upload Support

Current file-capable areas:
- student documents
- exam timetable file
- notification / circular document
- homework attachment
- student online homework submission

For now, files are stored directly on records so the app works locally without S3 or Cloudinary.

## Project Structure

```text
.
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   └── data
└── web
    ├── src
    └── public
```

Important files:
- `server/src/index.js`
- `server/src/routes/index.js`
- `server/src/controllers/platformController.js`
- `server/src/controllers/authController.js`
- `server/src/models/coreModels.js`
- `server/src/data/mockData.js`
- `web/src/App.jsx`
- `web/src/lib/api.js`

## Local Setup

Install dependencies:

```bash
npm --prefix server install
npm --prefix web install
```

## Environment Setup

Create `server/.env`:

```env
PORT=5001
JWT_SECRET=change-this-secret
MONGODB_URI=your-mongodb-uri
CLIENT_URL=http://127.0.0.1:5174
CLIENT_URLS=http://127.0.0.1:5173,http://127.0.0.1:5174,http://localhost:5173,http://localhost:5174
```

Create `web/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:5001/api
```

## Run Commands

Start backend:

```bash
npm run dev:api
```

Start frontend:

```bash
cd /Users/pankajnebbulalyadav/Documents/LMS/web
npm run dev -- --host 127.0.0.1
```

Frontend URL:
- [http://127.0.0.1:5174/](http://127.0.0.1:5174/)

Backend health URL:
- [http://127.0.0.1:5001/api/health](http://127.0.0.1:5001/api/health)

## Build Commands

Frontend build:

```bash
npm run build
```

Backend syntax check examples:

```bash
node --check server/src/routes/index.js
node --check server/src/controllers/platformController.js
```

## Current Notes

- This is the active EduCore school portal build, not the earlier broad prototype scope.
- The UI is intentionally kept close to the current approved layout.
- Student visibility is scoped to personal records.
- Teacher visibility is class-scoped.
- Management has broader operational access.
- MongoDB-backed data is used when available.
- If collections are empty, seed/mock data supports the initial review workflow.
