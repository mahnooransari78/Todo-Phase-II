---
id: 1
title: Update Todo Full Stack Constitution
stage: constitution
date: 2026-01-05
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: AK
command: /sp.constitution
labels: [constitution, todo-app, web-app, security]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```
Project: Todo Full-Stack Web Application (Phase II – Web)

Objective:
Transform an existing console-based Todo application into a modern, secure, multi-user full-stack web application with persistent storage, using a strictly spec-driven and agentic development workflow.

This project is evaluated on process quality, specification clarity, prompt design, architectural correctness, and disciplined use of AI tooling. Manual coding is not permitted.

---

Core Principles:
- Spec-Driven Development: Specifications are the single source of truth.
- Agentic Implementation: Claude Code is the only implementation agent.
- Security by Design: Authentication, authorization, and data isolation are mandatory.
- Determinism over Guessing: Claude Code must not infer requirements outside written specs.
- Architectural Discipline: Monorepo structure and layered CLAUDE.md rules must be respected.

---

Development Standards:
- Workflow MUST follow:
  Constitution → Specification → Planning → Task Breakdown → Implementation
- All features must be specified before implementation.
- Specs must be explicitly referenced using @specs/... syntax.
- Changes to requirements must be reflected in specs before code updates.

---

Technology Constraints (Non-Negotiable):
Frontend:
- Next.js 16+ using App Router
- TypeScript
- Tailwind CSS

Backend:
- Python FastAPI
- SQLModel ORM

Database:
- Neon Serverless PostgreSQL

Authentication:
- Better Auth on frontend
- JWT-based authentication for backend verification

No substitutions, alternatives, or experimental frameworks are allowed.

---

API & Security Constitution:
- All backend endpoints must be RESTful and prefixed with `/api`.
- All API requests must include a valid JWT token.
- JWT tokens must be issued by Better Auth.
- Backend must verify JWT signatures using a shared secret.
- Shared secret must be provided via environment variable:
  `BETTER_AUTH_SECRET`
- Requests without valid authentication must return `401 Unauthorized`.

---

User Identity & Data Isolation:
- Every task must be owned by exactly one authenticated user.
- Backend must derive user identity exclusively from verified JWT tokens.
- User IDs provided in request paths must be validated against token claims.
- Cross-user data access is strictly forbidden.

User isolation is a hard invariant.

---

Repository & Structure Rules:
- This project must use a monorepo structure.
- Frontend and backend must live in separate directories.
- Specifications must reside under `/specs`, organized by domain.
- Root, frontend, and backend CLAUDE.md files define binding rules.
- Claude Code must respect all CLAUDE.md instructions and folder boundaries.

---

Frontend Rules:
- Server Components are default.
- Client Components only when interactivity is required.
- API communication must go through a centralized API client.
- Authentication tokens must be attached automatically to every request.

---

Backend Rules:
- FastAPI routes must be modular and organized under `/routes`.
- SQLModel must be used for all database interactions.
- Direct SQL queries are not allowed.
```

## Response snapshot

Updated the constitution file at `.specify/memory/constitution.md` with the specific principles and requirements for the Todo Full-Stack Web Application project. The updated constitution includes:

1. Core Principles:
   - Spec-Driven Development
   - Agentic Implementation
   - Security by Design
   - Architectural Discipline
   - Technology Constraints (Non-Negotiable)
   - User Identity & Data Isolation

2. Additional Sections:
   - Frontend Rules
   - Backend Rules
   - Governance

The version has been set to 1.0.0 as this is the initial constitution for this project. The ratification date is marked as TODO since it's unknown, and the last amended date is set to today (2026-01-05).

## Outcome

- ✅ Impact: Created initial project constitution with all specified principles
- 🧪 Tests: No tests required for constitution update
- 📁 Files: Updated .specify/memory/constitution.md with new constitution
- 🔁 Next prompts: Create feature specifications based on the new constitution
- 🧠 Reflection: Constitution now properly defines all project constraints and principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin feature specification process