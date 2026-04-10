# DMS Backend — Direct Mediation Services

> **Live Platform:** [directmediationservices.co.uk](https://directmediationservices.co.uk)

The backend infrastructure powering Direct Mediation Services (DMS) — a UK-based, accredited family mediation company operating across 230+ locations in England and Wales. This API server automates the entire client journey: from the moment a client fills in a legal form on the website, through automated legal PDF generation, Google Drive file management, Google Calendar scheduling, and multi-channel client notifications — all without any manual intervention from staff.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Google Workspace Integration (Service Account)](#google-workspace-integration-service-account)
- [Authentication & Security](#authentication--security)
- [Automated Notifications](#automated-notifications)
- [Legal PDF Generation](#legal-pdf-generation)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Testing](#testing)

---

## Overview

DMS Backend is a Node.js/Express REST API that serves as the backbone for a legal-tech mediation platform. The system handles multi-role users (admin, mediator, company, client), manages case lifecycles, and integrates deeply with Google Workspace APIs using a **service account** for fully automated, server-to-server communication — no OAuth user consent flow required.

The frontend (React.js) is maintained in a separate repository. This repo covers the entire backend infrastructure.

---

## Key Features

### ⚡ Fully Automated Client Onboarding
A client fills in a legal intake form on the website. From that single action, the backend automatically:
1. Creates a new case in MongoDB
2. Generates pre-filled legal PDF documents (MIAM forms, Legal Aid forms, Financial Disclosure Packs)
3. Uploads all documents to the client's dedicated Google Drive case folder
4. Schedules appointments in Google Calendar
5. Sends confirmation emails and SMS to the client

Zero manual work required from DMS staff.

### 📁 Google Drive — Per-Client Case Folders
Each client gets their own automatically provisioned folder in Google Drive. Legal documents are uploaded programmatically the moment they are generated. All access is handled through a **Google Service Account**, enabling secure server-to-server communication with the Google Drive API without user authentication flows.

### 📅 Google Calendar Automation
Appointments and MIAM sessions are automatically created in Google Calendar when a case is created or updated, keeping mediators' schedules in sync in real time.

### 📄 Legal PDF Generation
PDF documents are generated server-side using `pdf-lib`, populated with client data from the intake forms. Supported document types include:
- MIAM (Mediation Information & Assessment Meeting) certificates
- Legal Aid forms (standard and low-income variants)
- Legal Aid Passport-based forms
- Financial Disclosure Packs
- Mediation Session Records

### 🔐 JWT Authentication (Access + Refresh Tokens)
Stateless authentication using dual-token strategy: short-lived access tokens and long-lived refresh tokens stored securely. Supports multiple user roles with role-based access control.

### 📧 Automated Email & SMS Notifications
Clients receive automatic notifications for:
- MIAM appointment confirmations
- Appointment reminders
- Case status updates

Email is handled via **Nodemailer** and SMS via **Twilio**.

---

## System Architecture

```
React Frontend (separate repo)
        │
        ▼ HTTP / REST
┌─────────────────────────────┐
│       Express.js API        │
│  ┌─────────┐ ┌───────────┐  │
│  │  Routes │ │Middleware │  │
│  └────┬────┘ └─────┬─────┘  │
│       │            │        │
│  ┌────▼────────────▼──────┐ │
│  │     Business Logic     │ │
│  └────┬───────────────────┘ │
│       │                     │
│  ┌────▼──────────────────┐  │
│  │      MongoDB           │  │
│  └───────────────────────┘  │
└──────────┬──────────────────┘
           │ Google Service Account (OAuth2)
    ┌──────┴──────────────┐
    │  Google Workspace   │
    │  ┌───────┐ ┌──────┐ │
    │  │ Drive │ │ Cal  │ │
    │  └───────┘ └──────┘ │
    └─────────────────────┘
           │
    ┌──────┴─────┐
    │  Twilio    │  (SMS)
    │  Nodemailer│  (Email)
    └────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18 |
| Framework | Express.js 4 |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken), bcrypt |
| Google APIs | googleapis v118, google-auth-library |
| PDF Generation | pdf-lib |
| Email | Nodemailer |
| SMS | Twilio |
| File Upload | Multer |
| HTTP Client | Axios |
| Testing | Jasmine, Supertest |
| Dev Server | Nodemon |
| API Docs | Swagger (swagger.json) |

---

## Google Workspace Integration (Service Account)

This project uses a **Google Service Account** for all Google API interactions. This approach was chosen intentionally to enable server-to-server automation — no user needs to be logged into a Google account for the system to operate.

**Why a Service Account?**
- Enables fully automated workflows triggered by form submissions
- No OAuth consent screens or user sessions required
- Credentials are scoped to only the necessary APIs (Drive, Calendar)
- Secure and auditable access pattern suitable for production legal workflows

The service account credentials are stored securely (see `credentials-folder/`) and loaded via environment variables. The account is granted access to the relevant shared Google Drive and Calendar resources.

---

## Authentication & Security

- **Multi-role system**: Admin, Mediator, Company, and Client user types
- **JWT access + refresh token** strategy — access tokens are short-lived; refresh tokens allow silent re-authentication
- **Password hashing** with bcrypt
- **Password reset flow** with tokenized reset links sent via email
- **Role-based middleware** protecting sensitive routes
- **CORS** configured for cross-origin requests from the React frontend

---

## Automated Notifications

### Email (Nodemailer)
Triggered automatically on case events:
- `POST /sendMIAM1email` — sends MIAM appointment email to Client 1
- Appointment confirmations and reminders

### SMS (Twilio)
- `POST /sendMIAM1sms` — sends MIAM appointment SMS to Client 1
- Company-specific Twilio credentials can be configured per account via `PATCH /addTwillio`

---

## Legal PDF Generation

Legal documents are generated dynamically from client form data using `pdf-lib`. The following document types are supported:

| Document | Description |
|---|---|
| `legalAidC1.pdf` | Legal Aid form — Client 1 |
| `legalAidC2.pdf` | Legal Aid form — Client 2 |
| `legalAidLowIncomeC1.pdf` | Low income variant — Client 1 |
| `legalAidLowIncomeC2.pdf` | Low income variant — Client 2 |
| `legalAidPassportC1.pdf` | Passport-based Legal Aid — Client 1 |
| `mediation_session_record2.pdf` | Mediation session record |
| `FINANCIAL-DISCLOSURE-PACK.docx` | Financial disclosure document pack |

Generated documents are immediately uploaded to the client's Google Drive case folder.

---

## API Endpoints

Full documentation is available in [`end-points-documentaion.txt`](./end-points-documentaion.txt) and [`swagger.json`](./swagger.json).

### Auth Routes (`/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/company-signup` | Register a new company |
| POST | `/auth/company-login` | Company login |
| POST | `/auth/mediator-login` | Mediator login |
| POST | `/auth/admin-login` | Admin login |
| GET | `/auth/user-info` | Get current user info |
| POST | `/auth/add-mediator` | Add a new mediator |
| POST | `/auth/add-admin` | Add a new admin |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/forgot-password` | Trigger password reset email |
| POST | `/auth/reset-password` | Complete password reset |

### Company Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/get-companies` | List all companies |
| GET | `/company/:id/stats` | Get company statistics |
| PATCH | `/companies/:id` | Update company details |
| DELETE | `/company/:id` | Delete a company |
| PATCH | `/addTwillio` | Configure Twilio credentials for SMS |

### Case Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/creatCase` | Create a new mediation case |
| PATCH | `/addClient1/:id` | Add/update Client 1's full intake form data |
| POST | `/sendMIAM1email` | Send MIAM appointment email to Client 1 |
| POST | `/sendMIAM1sms` | Send MIAM appointment SMS to Client 1 |

### Mediator Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/getMediators` | List all mediators |

---

## Project Structure

```
DMS-Backend/
├── .github/workflows/       # CI/CD GitHub Actions
├── config/                  # DB and app configuration
├── credentials-folder/      # Google Service Account credentials
├── global/                  # Global constants and helpers
├── interface/               # TypeScript-style interfaces / schemas
├── middleware/              # Auth, error handling, role checks
├── models/                  # Mongoose models (User, Case, Company, etc.)
├── routes/                  # Express route definitions
├── tests/                   # Jasmine test suites
├── uploads/                 # Temporary file upload buffer
├── index.js                 # App entry point
├── appError.js              # Custom error class
├── swagger.json             # Swagger API documentation
├── end-points-documentaion.txt  # Endpoint reference
└── package.json
```

---

## Environment Variables

Create a `.env` file in the root directory. Required variables:

```env
# Server
PORT=

# MongoDB
MONGO_URI=

# JWT
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

# Google Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_CALENDAR_ID=

# Nodemailer (Email)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

# Twilio (SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

> **Note:** Never commit real credentials. The `credentials-folder/` contents and `.env` file must be listed in `.gitignore`.

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Google Cloud project with a Service Account and Drive + Calendar APIs enabled

### Installation

```bash
git clone https://github.com/MostafaQabbari/DMS-Backend.git
cd DMS-Backend
npm install
```

### Run in development

```bash
npm run dev
```

### Run in production

```bash
node index.js
```

---

## Testing

Tests are written using **Jasmine** and **Supertest**.

```bash
npm run jasmine
```

Test files are located in the `tests/` directory and `spec/support/`.

---

## Related

- **Frontend Repository:** React.js client application (separate repo)
- **Live Platform:** [directmediationservices.co.uk](https://directmediationservices.co.uk)

---

## Author

**Mostafa Saad** — Backend Infrastructure  
Full Stack Developer | Node.js · Express · MongoDB · Google APIs · JWT

> This project was built as a production system for a real, accredited UK mediation company. The backend was designed and implemented independently, with the frontend maintained by a separate React team.
