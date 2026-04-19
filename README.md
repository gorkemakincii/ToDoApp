# ToDoApp

A full-stack task management application built with clean architecture principles — designed not just to work, but to demonstrate production-grade engineering practices across every layer of the stack.

## Live Demo

| Service | URL |
|---|---|
| **Frontend** | https://to-do-app-sandy-ten-31.vercel.app |
| **Backend API** | https://todoapp-backend-qjrb.onrender.com/api/todos |

> The backend runs on Render's free tier and may take ~50 seconds to respond after a period of inactivity (cold start).

---

## Tech Stack

**Frontend**
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/) — build tooling & dev server
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling

**Backend**
- [ASP.NET Core Web API](https://learn.microsoft.com/aspnet/core) (.NET 10)
- [Entity Framework Core 10](https://learn.microsoft.com/ef/core) — ORM & migrations
- [Npgsql](https://www.npgsql.org/) — PostgreSQL driver

**Database & Infrastructure**
- [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech) (serverless, production)
- [Render](https://render.com) — containerised backend deployment (Docker)
- [Vercel](https://vercel.com) — frontend deployment

---

## Key Features & Architecture

### Clean Layered Architecture

The backend follows a strict separation of concerns across four layers:

```
Request → Controller → Service → Repository → Database
```

Each layer communicates only with its immediate neighbour through interfaces, making the codebase testable and easy to extend without touching unrelated code.

### DTO Pattern & Mass Assignment Protection

Entity models (`TodoItem`) are **never exposed directly** to the outside world. Every API boundary uses dedicated Data Transfer Objects:

| DTO | Purpose |
|---|---|
| `CreateTodoDto` | Accepts only `title` and `description` on creation — `Id`, `CreatedAt`, `IsCompleted` cannot be injected by a client |
| `UpdateTodoDto` | Accepts `title`, `description`, `isCompleted` — prevents clients from overwriting server-controlled fields |
| `TodoResponseDto` | Controls exactly what fields are serialised into the API response — internal entity fields added in the future will never leak automatically |

The mapping from entity to response DTO lives exclusively in the service layer (`TodoService.ToDto`), keeping the controller thin and the model clean.

### Input Validation

DTOs are annotated with `System.ComponentModel.DataAnnotations`:

```csharp
[Required]
[MaxLength(200)]
public string Title { get; set; }

[MaxLength(2000)]
public string Description { get; set; }
```

Because the controller is decorated with `[ApiController]`, ASP.NET Core validates the model automatically before the action method runs. Invalid requests receive a structured `400 Bad Request` with field-level error details — no manual validation code needed in the controller.

### Global Exception Handler

An `app.UseExceptionHandler` middleware catches every unhandled exception before it reaches the client:

- The full exception (including stack trace, SQL details, and connection strings) is written **only** to the server log via `ILogger`.
- The client always receives a generic `ProblemDetails` JSON response with HTTP 500 — no internal details leak.

### Optimistic UI Updates

The frontend applies state changes immediately on user interaction (toggle, delete) and rolls back silently if the API call fails. This gives the UI a snappy, responsive feel without sacrificing data consistency.

### Security Hardening

| Concern | Mitigation |
|---|---|
| Secrets in source code | `.NET User Secrets` locally; environment variables on Render |
| CORS | `WithOrigins()` whitelist — only the Vercel domain is allowed in production |
| XSS | No `dangerouslySetInnerHTML` anywhere; all user data is rendered as React text nodes |
| SQL Injection | EF Core parameterised queries throughout |
| Information Exposure | Global exception handler; frontend shows only user-friendly error messages |

---

## Local Setup

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) running locally

### 1. Clone the repository

```bash
git clone https://github.com/gorkemakincii/ToDoApp.git
cd ToDoApp
```

### 2. Backend

```bash
cd backend

# Store the database password securely (never committed to Git)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" \
  "Host=localhost;Port=5432;Database=todoapp;Username=postgres;Password=YOUR_PASSWORD"

# Apply database migrations
dotnet ef database update

# Start the API (http://localhost:5214)
dotnet run
```

### 3. Frontend

```bash
cd frontend

npm install

# Create a local environment file
echo "VITE_API_URL=http://localhost:5214" > .env

# Start the dev server (http://localhost:5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
ToDoApp/
├── backend/
│   ├── Controllers/       # HTTP layer — thin, delegates to services
│   ├── DTOs/              # CreateTodoDto, UpdateTodoDto, TodoResponseDto
│   ├── Models/            # TodoItem entity (EF Core)
│   ├── Data/              # AppDbContext
│   ├── Repositories/      # Data access interface + implementation
│   ├── Services/          # Business logic interface + implementation
│   ├── Migrations/        # EF Core auto-generated migrations
│   ├── Dockerfile         # Multi-stage build for Render deployment
│   └── Program.cs         # App bootstrap, DI, middleware pipeline
└── frontend/
    └── src/
        ├── components/    # AddTodoForm, TodoCard, ErrorBanner
        ├── services/      # todoService.ts — typed Fetch API wrapper
        ├── types/         # Shared TypeScript interfaces
        └── App.tsx        # Root component, state management
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/todos` | Returns all todo items, newest first |
| `POST` | `/api/todos` | Creates a new todo item |
| `PUT` | `/api/todos/{id}` | Updates title, description, and completion status |
| `DELETE` | `/api/todos/{id}` | Deletes a todo item |
