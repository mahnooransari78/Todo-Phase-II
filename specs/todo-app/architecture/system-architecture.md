# System Architecture Specification: Todo Full-Stack Web Application

**Created**: 2026-01-05
**Feature**: Todo Full-Stack Web Application
**Input**: Feature specification from `/specs/todo-app/spec.md`

## Architecture Overview

The Todo Full-Stack Web Application follows a modern web architecture with clear separation between frontend and backend components. The system implements a monorepo structure with distinct frontend and backend directories to maintain clear boundaries while enabling efficient development.

## Technology Stack

### Frontend
- **Framework**: Next.js 16+ using App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth client-side integration

### Backend
- **Framework**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL

### Infrastructure
- **Authentication**: JWT-based using Better Auth
- **Deployment**: Serverless architecture with Neon PostgreSQL

## System Components

### Frontend Architecture

The frontend follows Next.js App Router conventions with a clear component hierarchy:

```
frontend/
├── app/
│   ├── (auth)/          # Authentication-related pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── dashboard/       # Main application pages
│   │   ├── tasks/       # Task management pages
│   │   └── profile/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # Reusable UI components
│   ├── Task/
│   ├── Auth/
│   └── UI/
├── lib/                 # Shared utilities and API client
│   └── api.ts           # Centralized API client with JWT handling
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

**Component Patterns**:
- Server Components are default for data fetching and rendering
- Client Components used only when interactivity is required (forms, modals, real-time updates)
- All API calls go through a centralized API client that automatically attaches JWT tokens

### Backend Architecture

The backend implements a modular API structure with clear separation of concerns:

```
backend/
├── src/
│   ├── main.py          # FastAPI application entry point
│   ├── models/          # SQLModel database models
│   │   ├── user.py
│   │   ├── task.py
│   │   └── base.py
│   ├── schemas/         # Pydantic schemas for request/response
│   │   ├── user.py
│   │   ├── task.py
│   │   └── auth.py
│   ├── routes/          # API route definitions
│   │   ├── auth.py
│   │   ├── tasks.py
│   │   └── ai.py
│   ├── services/        # Business logic layer
│   │   ├── auth.py
│   │   ├── tasks.py
│   │   └── ai.py
│   ├── database/        # Database connection and session management
│   │   └── session.py
│   └── utils/           # Utility functions
│       ├── auth.py      # JWT verification utilities
│       └── security.py  # Security-related utilities
├── tests/               # Backend tests
└── requirements.txt     # Python dependencies
```

**API Structure**:
- All routes prefixed with `/api` as required by constitution
- JWT-based authentication on all protected endpoints
- User identity derived exclusively from validated JWT claims
- Strict user-level data isolation enforced at the service layer

### Database Architecture

The database implements proper schema design with user data isolation:

```
Database: Neon Serverless PostgreSQL

Tables:
- users: user accounts with authentication data
- tasks: user tasks with foreign key to users
- sessions: authentication session data (if needed)

Relationships:
- Each task belongs to exactly one user
- User ID is validated against JWT claims for all operations
- No cross-user data access is possible through database constraints
```

## Authentication Flow

1. **User Registration/Login**: Handled through Better Auth client-side
2. **JWT Token Generation**: Better Auth generates JWT tokens upon successful authentication
3. **Token Storage**: Tokens stored securely in browser (HTTP-only cookies or secure local storage)
4. **API Requests**: All API requests include JWT in Authorization header
5. **Token Verification**: Backend verifies JWT signatures using shared secret from `BETTER_AUTH_SECRET` environment variable
6. **User Identification**: Backend extracts user ID from validated JWT claims
7. **Authorization**: All data access operations validated against user's identity

## Security Architecture

### Data Isolation
- Every task must belong to exactly one authenticated user
- Database queries always filter by user ID derived from JWT claims
- User identifiers from URL parameters are never trusted
- Cross-user data access is prevented at both API and database levels

### Authentication & Authorization
- All backend routes prefixed with `/api`
- JWT-based authentication using Better Auth
- User identity derived exclusively from validated JWT claims
- 401 Unauthorized responses for invalid/missing tokens
- Authorization checks performed on every API operation

## Deployment Architecture

The system is designed for serverless deployment with Neon PostgreSQL:

- Frontend: Static hosting (Vercel, Netlify, or similar)
- Backend: Serverless functions or containerized deployment
- Database: Neon Serverless PostgreSQL with automatic scaling
- Authentication: Better Auth with JWT tokens

## Data Flow

1. **Client Request**: User interacts with frontend components
2. **Authentication Check**: Client verifies JWT token exists and is valid
3. **API Call**: Request sent to backend with JWT in Authorization header
4. **Token Verification**: Backend validates JWT signature and extracts user ID
5. **Authorization**: Backend verifies user has permission to access requested data
6. **Database Operation**: Query executed with user-specific filters
7. **Response**: Data returned to client, filtered to user's data only
8. **UI Update**: Frontend updates based on API response

## Error Handling Architecture

- Client-side: Network error handling with user-friendly messages
- API-level: Proper HTTP status codes (401 for auth, 403 for authz, 404 for not found, etc.)
- Database-level: Transaction management and constraint validation
- Global: Centralized error logging and monitoring