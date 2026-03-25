# EduCore

EduCore is a focused web application for teacher and higher-management workflows using:

- React + Tailwind CSS
- Node.js + Express
- MongoDB-ready backend
- JWT authentication
- Firebase / Cloudinary / AWS S3 ready integration points

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
│   └── Express API with JWT auth, model/repository layer, and mock/DB persistence
└── web
    └── React + Tailwind web portal
```

## Current Scope

- Student detail view for teachers and management
- Daily attendance entry and review
- Exam timetable upload and download
- Result creation and approval
- Fee management dashboard
- Homework management with online and offline modes
- Centralized notification/circular broadcaster for dashboard and web portal updates
- Real-time notification feed, scheduling, and role-based targeting
- PDF / image / DOC / DOCX upload support in circulars and exam timetable records
- Leave application and approval flow
- JWT login with MongoDB-backed users
- CRUD APIs for the active release modules

## Run Locally

Install dependencies:

```bash
npm --prefix server install
npm --prefix web install
```

Start backend:

```bash
npm run dev:api
```

Start frontend:

```bash
cd /Users/pankajnebbulalyadav/Documents/LMS/web
npm run dev -- --host 127.0.0.1
```

## Environment

Create `server/.env`:

```bash
PORT=5001
JWT_SECRET=change-this-secret
MONGODB_URI=mongodb://127.0.0.1:27017/sms
CLIENT_URL=http://127.0.0.1:5173
CLIENT_URLS=http://127.0.0.1:5173,http://127.0.0.1:5174,http://localhost:5173,http://localhost:5174
```

Create `web/.env`:

```bash
VITE_API_BASE_URL=http://127.0.0.1:5001/api
```

## Demo Access

- `superadmin@sms.com` / `super123`
- `admin@sms.com` / `admin123`
- `vice@sms.com` / `vice123`
- `teacher@sms.com` / `teacher123`

## Notes

- This codebase is currently narrowed to teacher and higher-management roles.
- Extra modules from the earlier broad prototype are not part of the active release scope.
- MongoDB is supported; when unavailable, the app falls back to local mock persistence for key collections.
- File uploads for circulars and exam timetable records are currently stored on the record as file data so they work locally without separate S3/Cloudinary setup.
- Notification broadcaster now supports:
  - dashboard + web portal visibility
  - instant and scheduled publishing
  - role-based audience targeting
  - uploaded document attachments
