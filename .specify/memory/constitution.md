<!-- Sync Impact Report:
Version change: N/A → 1.0.0
List of modified principles: N/A (initial constitution)
Added sections: All principles and sections based on user requirements
Removed sections: N/A
Templates requiring updates:
- .specify/templates/plan-template.md: ⚠ pending
- .specify/templates/spec-template.md: ⚠ pending
- .specify/templates/tasks-template.md: ⚠ pending
- .specify/templates/commands/*.md: ⚠ pending
Follow-up TODOs:
- TODO(RATIFICATION_DATE): Original adoption date unknown - needs to be set
-->
# Todo Full-Stack Web Application (Phase II – Web) Constitution

## Core Principles

### Spec-Driven Development
Specifications are the single source of truth. All features must be specified before implementation. Specs must be explicitly referenced using @specs/... syntax. Changes to requirements must be reflected in specs before code updates.

### Agentic Implementation
Claude Code is the only implementation agent. Determinism over Guessing: Claude Code must not infer requirements outside written specs.

### Security by Design
Authentication, authorization, and data isolation are mandatory. All backend endpoints must be RESTful and prefixed with /api. All API requests must include a valid JWT token. JWT tokens must be issued by Better Auth. Backend must verify JWT signatures using a shared secret. Shared secret must be provided via environment variable: BETTER_AUTH_SECRET. Requests without valid authentication must return 401 Unauthorized.

### Architectural Discipline
Monorepo structure and layered CLAUDE.md rules must be respected. This project must use a monorepo structure. Frontend and backend must live in separate directories. Specifications must reside under /specs, organized by domain. Root, frontend, and backend CLAUDE.md files define binding rules. Claude Code must respect all CLAUDE.md instructions and folder boundaries.

### Technology Constraints (Non-Negotiable)
Frontend: Next.js 16+ using App Router, TypeScript, Tailwind CSS. Backend: Python FastAPI, SQLModel ORM. Database: Neon Serverless PostgreSQL. Authentication: Better Auth on frontend, JWT-based authentication for backend verification. No substitutions, alternatives, or experimental frameworks are allowed.

### User Identity & Data Isolation
Every task must be owned by exactly one authenticated user. Backend must derive user identity exclusively from verified JWT tokens. User IDs provided in request paths must be validated against token claims. Cross-user data access is strictly forbidden. User isolation is a hard invariant.

## Frontend Rules
Server Components are default. Client Components only when interactivity is required. API communication must go through a centralized API client. Authentication tokens must be attached automatically to every request.

## Backend Rules
FastAPI routes must be modular and organized under /routes. SQLModel must be used for all database interactions. Direct SQL queries are not allowed.

## Governance
Workflow MUST follow: Constitution → Specification → Planning → Task Breakdown → Implementation. Development Standards: All features must be specified before implementation. Specs must be explicitly referenced using @specs/... syntax. Changes to requirements must be reflected in specs before code updates. All changes are small, testable, and reference code precisely.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date unknown | **Last Amended**: 2026-01-05