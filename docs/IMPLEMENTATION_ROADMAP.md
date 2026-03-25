# Implementation Roadmap

## Goal

Move the current SMS starter toward the full `learning` multi-tenant platform without overbuilding too early.

## Reality Check

The current codebase is a useful foundation, but the complete scope now includes:

- Multi-tenancy
- Super admin controls
- White-label school portals
- 16 major modules
- Mobile apps
- Service boundaries, analytics, and platform operations

That is a product roadmap, not a single code drop.

## Recommended Delivery Phases

### Phase 0. Foundation Already Started

Current repo status:

- React portal starter
- Express API starter
- JWT auth starter
- Demo module screens

Next hardening steps:

- Convert backend to TypeScript
- Add shared validation and error middleware
- Add role guards and permission matrix
- Add proper route modules and service layers
- Add Docker and local compose setup

### Phase 1. Multi-Tenant Core

Deliver first:

- Tenant model and subdomain resolution
- School onboarding flow
- Super admin dashboard
- School admin dashboard
- User management and role provisioning
- Tenant branding configuration
- Feature flag and module enablement

Suggested backend choices:

- PostgreSQL for transactional platform data
- Redis for session and cache
- S3 or R2 for asset storage

### Phase 2. Academic Operations

Deliver:

- SIS
- Staff management
- Attendance
- Timetable
- Homework
- Announcements
- Leave management

Frontend priorities:

- Dedicated layouts for super admin and school portal
- Permission-based navigation
- White-label theme loader per tenant

### Phase 3. Finance and Results

Deliver:

- Fee management
- Payment gateway integration
- Receipt generation
- Exam management
- Marks entry
- Report cards
- Analytics exports

### Phase 4. Extended Operations

Deliver:

- Library
- Transport
- Parent-teacher messaging
- WhatsApp/SMS automation
- Scheduled reports

### Phase 5. Scale and Mobile

Deliver:

- React Native apps
- Realtime channels
- Queue workers
- Multi-region asset delivery
- SLA monitoring and alerting

## Suggested Monorepo Structure

```text
.
├── apps
│   ├── super-admin-web
│   ├── school-portal-web
│   └── mobile
├── services
│   ├── identity-service
│   ├── tenant-service
│   ├── sis-service
│   ├── academic-service
│   ├── finance-service
│   ├── communication-service
│   ├── operations-service
│   └── reporting-service
├── packages
│   ├── ui
│   ├── auth
│   ├── config
│   ├── types
│   └── utils
└── infra
    ├── docker
    ├── terraform
    └── monitoring
```

## What To Build Next In This Repo

If we continue directly in this codebase, the best next implementation order is:

1. Add TypeScript backend structure with modules for auth, tenants, users, students, fees, and announcements.
2. Split the current frontend into `super admin` and `school admin` experiences.
3. Add persistent database models instead of mock data.
4. Add tenant-aware login and branding.
5. Add CRUD for onboarding, students, staff, fees, homework, and announcements.
6. Add audit logs and activity history.

## Immediate Backlog

### Backend

- `auth`: login, refresh, forgot password, OTP flow
- `tenants`: onboarding, branding, plans, feature flags
- `users`: role assignment, invitations, support view
- `students`: admission, documents, parent links
- `fees`: structures, invoices, payments, reminders
- `communication`: notices, templates, scheduling

### Frontend

- Login page and auth flow
- Super admin tenant list
- Tenant onboarding wizard
- School admin dashboard
- CRUD forms with validation
- Analytics page and activity logs

## Delivery Advice

- Use the current project as a validated UX and architecture starter.
- Do not claim all 16 modules are complete yet.
- Freeze a Phase 1 MVP scope before production estimates.
- Build tenanting and auth correctly early, because they affect every other module.
