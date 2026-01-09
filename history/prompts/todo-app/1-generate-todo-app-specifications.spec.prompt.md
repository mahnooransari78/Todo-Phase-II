---
id: 1
title: Generate Todo App Specifications
stage: spec
date: 2026-01-05
surface: agent
model: Claude Sonnet 4.5
feature: todo-app
branch: master
user: AK
command: /sp.specify
labels: [specification, todo-app, full-stack, web-app]
links:
  spec: /specs/todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/todo-app/spec.md
 - specs/todo-app/architecture/system-architecture.md
 - specs/todo-app/features/task-crud.md
 - specs/todo-app/features/authentication.md
 - specs/todo-app/features/ai-assistant.md
 - specs/todo-app/api/endpoints.md
 - specs/todo-app/database/schema.md
 - specs/todo-app/ui/ui-specification.md
 - CLAUDE.md
 - frontend/CLAUDE.md
 - backend/CLAUDE.md
tests:
 - none
---

## Prompt

```
You are Spec-Kit Plus operating under a binding project constitution.

Read and strictly follow all rules defined in `sp.constitution`.
If any requirement is unclear, choose the safest interpretation that favors
security, explicitness, and spec-driven development.

Project:
A full-stack, multi-user Todo web application evolving from an existing
console-based Todo console app into a modern web system.

Objective:
Generate a complete, production-grade specification set that will act as the
single source of truth for all future planning and implementation.

Global Instructions:
1. Automatically create a `/specs` directory with a clean, professional structure.
2. Automatically generate all required folders and markdown files.
3. Do NOT ask the user to manually create any folders or files.
4. Do NOT include any implementation code — specifications only.
5. Ensure all specs are internally consistent and cross-referenced where relevant.
6. Write specs at a level where Claude Code can implement without guessing.

Required Specification Areas (you must generate files for all):
- Project overview and scope
- System architecture (frontend, backend, database, authentication flow)
- Feature specifications:
  - Task CRUD
  - Authentication
  - AI assistant / chatbot (future phase)
- API specifications:
  - RESTful endpoint definitions
  - Request/response contracts
  - Authentication and authorization rules
- Database specifications:
  - Schema definitions
  - Data ownership and isolation rules
- UI specifications:
  - Pages
  - Components
  - User flows and states

API Design Rules:
- All backend routes must be prefixed with `/api`.
- Authentication must be JWT-based using Better Auth.
- User identity must be derived exclusively from validated JWT claims.
- User identifiers must NOT be trusted from URL parameters.
- RESTful conventions must be followed.
- All endpoints must enforce user-level data isolation.

Security and Ownership Invariants:
- Every task must belong to exactly one authenticated user.
- No user may read or modify another user's data.
- Requests without a valid JWT must return 401 Unauthorized.
- Authorization checks must occur on every API operation.

Frontend Architecture Rules:
- Frontend uses Next.js (App Router).
- Server Components are the default.
- Client Components are allowed only when required for interactivity.
- All API calls must include JWT tokens in the Authorization header.

Backend Architecture Rules:
- Backend uses Python FastAPI.
- SQLModel is used as the ORM.
- Neon Serverless PostgreSQL is the database.
- JWT verification uses a shared secret provided via `BETTER_AUTH_SECRET`.

Documentation Layer:
- Generate `CLAUDE.md` files at:
  - Repository root
  - `/frontend`
  - `/backend`
- These files must explain how Claude Code should interpret and use the generated specs.
- Do not embed implementation details inside specs.

Output Expectations:
- Clear, professional Markdown.
- Explicit acceptance criteria where applicable.
- Defined edge cases, error conditions, and invariants.
- Specs must be suitable for evaluation by technical judges.

Authority Order:
1. `sp.constitution`
2. Generated specifications
3. Future plans or iterations

Begin by generating the complete `/specs` directory and its contents.
```

## Response snapshot

Generated a complete specification set for the Todo Full-Stack Web Application, including:

1. Project overview and scope specification in `specs/todo-app/spec.md`
2. System architecture specification in `specs/todo-app/architecture/system-architecture.md`
3. Feature specifications:
   - Task CRUD operations in `specs/todo-app/features/task-crud.md`
   - Authentication system in `specs/todo-app/features/authentication.md`
   - AI assistant integration in `specs/todo-app/features/ai-assistant.md`
4. API specifications with endpoint definitions in `specs/todo-app/api/endpoints.md`
5. Database schema and isolation rules in `specs/todo-app/database/schema.md`
6. UI specifications for pages, components, and user flows in `specs/todo-app/ui/ui-specification.md`
7. CLAUDE.md documentation files for root, frontend, and backend directories

All specifications follow the project constitution requirements including security, data isolation, and technology stack constraints. The specifications are designed to be the single source of truth for future planning and implementation.

## Outcome

- ✅ Impact: Created comprehensive specification set for Todo Full-Stack Web Application
- 🧪 Tests: No tests required for specification generation
- 📁 Files: Created 11 specification files and 3 CLAUDE.md files across the project structure
- 🔁 Next prompts: Ready for planning phase with `/sp.plan`
- 🧠 Reflection: Specifications provide clear guidance for implementation following security and architecture principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin planning phase with generated specifications