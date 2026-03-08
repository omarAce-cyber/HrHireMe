# SmartHire — Full-Stack Hiring Platform

> A production-ready, full-stack HR platform with dual portals for HR managers and job candidates — featuring AI-assisted assessments, candidate ranking, and an analytics dashboard.

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    SmartHire Platform                   │
├─────────────────┬───────────────────────────────────────┤
│   Frontend      │            Backend                    │
│   Next.js 14    │        ASP.NET Core 8                 │
│   React 18      │        Clean Architecture             │
│   Material UI   │                                       │
│   Redux Toolkit │  ┌──────────┬────────────────────┐   │
│   React Query   │  │ API Layer│  Controllers (REST) │   │
│   Chart.js      │  ├──────────┴────────────────────┤   │
│                 │  │ Application Layer (MediatR)    │   │
│                 │  │ CQRS: Commands + Queries       │   │
│                 │  ├────────────────────────────────┤   │
│                 │  │ Domain Layer                   │   │
│                 │  │ Entities, Enums, Business Rules│   │
│                 │  ├────────────────────────────────┤   │
│                 │  │ Infrastructure Layer           │   │
│                 │  │ EF Core + PostgreSQL + JWT     │   │
│                 │  └────────────────────────────────┘   │
└─────────────────┴───────────────────────────────────────┘
                          │
                 ┌────────┴────────┐
                 │   PostgreSQL 16  │
                 └─────────────────┘
```

### Clean Architecture Layers

| Layer | Project | Responsibility |
|-------|---------|----------------|
| **Domain** | `SmartHire.Domain` | Entities, Enums, Business rules |
| **Application** | `SmartHire.Application` | CQRS handlers, DTOs, Interfaces |
| **Infrastructure** | `SmartHire.Infrastructure` | EF Core, JWT, BCrypt, DB seeder |
| **API** | `SmartHire.API` | REST controllers, Swagger, Auth |

---

## �� Features

### HR Portal
- ✅ **Job Management** — Create, edit, delete, and track job postings
- ✅ **Assessment Builder** — Build MCQ assessments with timer, linked to job postings
- ✅ **Application Tracking** — View all applicants, update status (Pending → Reviewing → Accepted/Rejected)
- ✅ **Analytics Dashboard** — Applications per job, score distribution charts, KPI summary

### Candidate Portal
- ✅ **Job Browser** — Search and filter open positions
- ✅ **One-click Apply** — Apply with optional cover letter; prevents duplicate applications
- ✅ **Assessment Engine** — Take MCQ assessments with countdown timer
- ✅ **Anti-cheating** — Focus/tab-switch detection, warnings, cheating flag in results
- ✅ **Readiness Score** — Auto-calculated from assessment performance, shown to HR

### Authentication & Authorization
- ✅ **JWT Auth** — Stateless, role-based (Admin / HR / Candidate)
- ✅ **BCrypt** — Password hashing
- ✅ **Role guards** — Frontend layout guards + backend `[Authorize(Roles)]`

---

## 📁 Folder Structure

```
HrHireMe/
├── backend/                        # ASP.NET Core solution
│   ├── SmartHire.sln
│   ├── Dockerfile
│   └── src/
│       ├── SmartHire.Domain/       # Entities, Enums
│       ├── SmartHire.Application/  # CQRS, DTOs, Interfaces
│       ├── SmartHire.Infrastructure/ # EF Core, JWT, Seeder
│       └── SmartHire.API/          # Controllers, Program.cs
├── frontend/                       # Next.js 14 App Router
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── hr/                 # HR dashboard, jobs, assessments, analytics
│   │   │   └── candidate/          # Candidate dashboard, jobs, applications, assessments
│   │   ├── components/layout/      # AppLayout with sidebar navigation
│   │   ├── services/               # API service clients (axios)
│   │   ├── store/                  # Redux Toolkit store + slices
│   │   ├── types/                  # TypeScript type definitions
│   │   └── theme/                  # Material UI theme
├── .github/workflows/
│   └── ci.yml                      # GitHub Actions: build + Docker
├── docker-compose.yml              # Full-stack containerization
└── README.md
```

---

## 🛠 Tech Stack

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| Next.js | 14 | React framework, App Router |
| Material UI | 5 | Component library |
| Redux Toolkit | 2 | Global auth state |
| TanStack React Query | 5 | Server state, caching |
| Chart.js + react-chartjs-2 | 4/5 | Analytics charts |
| Axios | 1.6 | HTTP client |

### Backend
| Library | Version | Purpose |
|---------|---------|---------|
| ASP.NET Core | 8.0 | Web API framework |
| MediatR | 12 | CQRS pattern |
| FluentValidation | 11 | Input validation |
| Entity Framework Core | 8.0 | ORM |
| Npgsql EF Provider | 8.0 | PostgreSQL driver |
| BCrypt.Net-Next | 4.0 | Password hashing |
| JWT Bearer | 8.0 | Authentication |

### DevOps
| Tool | Purpose |
|------|---------|
| Docker | Containerization |
| Docker Compose | Local full-stack orchestration |
| GitHub Actions | CI: build, lint, test, Docker build |

---

## ⚡ Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

### Run with Docker Compose

```bash
git clone https://github.com/omarAce-cyber/HrHireMe.git
cd HrHireMe
docker-compose up --build
```

Services will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger
- **PostgreSQL**: localhost:5432

### Demo Accounts (auto-seeded)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smarthire.com | Admin@123 |
| HR Manager | hr@smarthire.com | HR@123456 |
| Candidate | candidate@smarthire.com | Candidate@123 |

---

## 🔧 Local Development

### Backend

Requirements: [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0), PostgreSQL 16

```bash
# Start PostgreSQL (or use Docker)
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16-alpine

cd backend
dotnet restore SmartHire.sln
dotnet run --project src/SmartHire.API/SmartHire.API.csproj
# API available at http://localhost:8080
```

### Frontend

Requirements: [Node.js 20+](https://nodejs.org/)

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:3000
```

### Environment Variables

**Backend** (`backend/src/SmartHire.API/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=smarthire;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Key": "your-secret-key-min-32-chars",
    "Issuer": "SmartHireAPI",
    "Audience": "SmartHireClient"
  }
}
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 📊 Database Schema

```
Users           Jobs               JobApplications
─────────       ────────────       ───────────────
Id (PK)         Id (PK)            Id (PK)
FirstName       Title              JobId (FK)
LastName        Description        CandidateId (FK)
Email (unique)  Department         Status
PasswordHash    Location           CoverLetter
Role            SalaryRange        ReadinessScore
Phone           Status             CreatedAt
Bio             Deadline
ResumeUrl       PostedByUserId(FK)
                CreatedAt

Assessments     Questions          AssessmentResults
───────────     ─────────          ─────────────────
Id (PK)         Id (PK)            Id (PK)
Title           Text               AssessmentId (FK)
Description     OptionA/B/C/D      CandidateId (FK)
TimeLimitMins   CorrectAnswer      Score / MaxScore
IsRandomized    Points             TimeTakenSeconds
JobId (FK)      AssessmentId(FK)   FocusLostCount
                                   CheatingFlag
                                   AnswersJson
```

---

## 🔒 Security

- Passwords hashed with BCrypt (work factor 11)
- JWT tokens expire after 7 days
- Role-based authorization enforced at controller level
- CORS restricted to frontend origin
- Assessment answers not exposed to candidates (server filters `CorrectAnswer`)
- Anti-cheating: `focusLostCount > 3` sets `CompletedWithCheatingFlag = true`

> **Production note**: Move `Jwt:Key` and DB credentials to environment variables / a secrets manager. Never commit secrets to source control.

---

## 🧪 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login, get JWT |
| GET | `/api/jobs` | Public | List/search jobs |
| POST | `/api/jobs` | HR/Admin | Create job |
| PUT | `/api/jobs/{id}` | HR/Admin | Update job |
| DELETE | `/api/jobs/{id}` | HR/Admin | Delete job |
| GET | `/api/applications` | Auth | List applications |
| POST | `/api/applications` | Candidate | Apply to job |
| PATCH | `/api/applications/{id}/status` | HR/Admin | Update status |
| GET | `/api/assessments/{id}` | Auth | Get assessment |
| POST | `/api/assessments` | HR/Admin | Create assessment |
| POST | `/api/assessments/{id}/submit` | Candidate | Submit answers |
| GET | `/api/analytics` | HR/Admin | Get analytics data |

Full interactive docs: **http://localhost:8080/swagger**

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License
