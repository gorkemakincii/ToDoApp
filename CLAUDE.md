# ToDoApp — Project Guide for Claude Code

## Project Overview

Full-stack To-Do (Task Management) application built with clean architecture principles. The goal is not just working code, but a maintainable, well-structured codebase following modern development practices.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | C# 12+, ASP.NET Core Web API (.NET 8+), Entity Framework Core |
| Database | PostgreSQL (via Npgsql EF Core Provider) |
| Frontend | React (Vite), TypeScript, Tailwind CSS |
| Communication | RESTful API (JSON) |

## Project Structure

```
ToDoApp/
├── backend/    # ASP.NET Core Web API project
└── frontend/   # React + Vite + TypeScript project
```

## Development Steps

Work through these steps **in order**. Complete and verify each step before moving to the next. After each major step, summarize the current state and wait for user confirmation.

### Step 1: Database & Backend Foundations

- Create ASP.NET Core Web API project (`dotnet new webapi`)
- Configure PostgreSQL connection string in `appsettings.json`
- Install required NuGet packages: `Microsoft.EntityFrameworkCore`, `Npgsql.EntityFrameworkCore.PostgreSQL`, `Microsoft.EntityFrameworkCore.Tools`
- Create `TodoItem` entity model with fields:
  - `Id` (Guid or int)
  - `Title` (string)
  - `Description` (string)
  - `IsCompleted` (bool)
  - `CreatedAt` (DateTime)
- Create `AppDbContext` with `DbSet<TodoItem>`
- Run EF Core migrations:
  ```bash
  dotnet ef migrations add InitialCreate
  dotnet ef database update
  ```

### Step 2: Business Logic & API Layer

- Set up clean data access layer (Repository and/or Service pattern)
- Create `TodoController` inheriting from `ControllerBase` with:
  - `GET /api/todos` — list all items
  - `POST /api/todos` — create new item
  - `PUT /api/todos/{id}` — update existing item
  - `DELETE /api/todos/{id}` — delete item
- Configure CORS in `Program.cs` to allow `http://localhost:5173`

### Step 3: Frontend Setup & UI

- Scaffold project: `npm create vite@latest frontend -- --template react-ts`
- Install and configure Tailwind CSS
- Build a clean, minimalist UI that supports:
  - Viewing all tasks
  - Adding a new task
  - Marking a task as completed
  - Deleting a task

### Step 4: Integration (API Connection)

- Write a service/API layer in the frontend using Fetch API or Axios
- Wire all UI buttons and forms to the corresponding backend endpoints
- Display backend errors to the user in a friendly way

## Rules & Constraints

- **Naming:** All class and method names must be in English, following C# conventions (`PascalCase` for types/methods, `camelCase` for locals/parameters)
- **Error Handling:**
  - Backend must return correct HTTP status codes (`404 Not Found`, `400 Bad Request`, etc.)
  - Frontend must catch errors and display them to the user
- **Autonomy:** Run terminal commands as needed (`dotnet run`, `npm install`, `npm run dev`, etc.) and create files without asking for each one
- **Gate-checking:** After completing each numbered step, summarize what was done and what was verified, then wait for user approval before proceeding to the next step
