# Research: Todo Full-Stack Web Application

**Feature**: Todo Full-Stack Web Application
**Date**: 2026-01-05
**Spec**: @specs/todo-app/spec.md

## Research Findings

### Decision: Technology Stack Selection
**Rationale**: Selected technologies align with the constitution requirements:
- Next.js 16+ with App Router for frontend (as required by constitution)
- TypeScript for type safety (as required by constitution)
- Tailwind CSS for styling (as required by constitution)
- Python FastAPI for backend (as required by constitution)
- SQLModel ORM for database interactions (as required by constitution)
- Neon Serverless PostgreSQL for database (as required by constitution)
- Better Auth for authentication (as required by constitution)

**Alternatives considered**:
- React with Create React App vs Next.js - Next.js chosen for SSR and routing
- Express.js vs FastAPI - FastAPI chosen for built-in docs and type validation
- Prisma vs SQLModel - SQLModel chosen as required by constitution
- Auth0 vs Better Auth - Better Auth chosen as required by constitution

### Decision: API Design Pattern
**Rationale**: All API endpoints will be prefixed with `/api` as required by constitution. Using RESTful patterns with proper HTTP methods and status codes. JWT-based authentication with Better Auth tokens.

**Alternatives considered**:
- GraphQL vs REST - REST chosen for simplicity and alignment with requirements
- OAuth2 vs JWT - JWT with Better Auth chosen as required by constitution

### Decision: Authentication Flow
**Rationale**: Using Better Auth for frontend authentication and JWT tokens for backend verification. Tokens will be validated using the shared secret from `BETTER_AUTH_SECRET` environment variable. User identity derived from JWT claims exclusively.

**Alternatives considered**:
- Session-based vs JWT - JWT chosen as required by constitution
- Multiple auth providers vs Better Auth only - Better Auth only as required by constitution

### Decision: Data Isolation Strategy
**Rationale**: Implementing strict user-level data isolation by validating user ID from JWT claims against all data access operations. Database queries will always filter by user ID. Foreign key constraints will enforce referential integrity.

**Alternatives considered**:
- Row-level security vs application-level filtering - Application-level filtering chosen for explicit control
- Multiple database schemas vs single schema with user_id - Single schema with user_id chosen for simplicity

### Decision: Component Architecture
**Rationale**: Following Next.js App Router patterns with Server Components as default and Client Components only when interactivity is required. This optimizes for performance and SEO while maintaining interactivity where needed.

**Alternatives considered**:
- Client-side rendering only vs Server Components - Server Components chosen as required by constitution
- Custom auth components vs Better Auth integration - Better Auth integration chosen as required

### Decision: AI Assistant Integration Approach
**Rationale**: For the AI assistant feature, implementing a separate endpoint that processes natural language requests and returns task suggestions. The approach will follow the specification in @specs/todo-app/features/ai-assistant.md with proper user data isolation.

**Alternatives considered**:
- Third-party AI services vs custom implementation - Third-party services chosen for initial implementation
- Real-time vs batch processing - Real-time chosen for better user experience