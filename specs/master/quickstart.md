# Quickstart Guide: Todo Full-Stack Web Application

**Feature**: Todo Full-Stack Web Application
**Date**: 2026-01-05
**Spec**: @specs/todo-app/spec.md

## Development Environment Setup

### Prerequisites
- Node.js 18+ for frontend development
- Python 3.11+ for backend development
- PostgreSQL 14+ (or Neon Serverless PostgreSQL account)
- Git for version control

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Set up environment variables**
   Create `.env` files in both frontend and backend directories with the required configuration:

   **Backend (.env)**:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"
   BETTER_AUTH_SECRET="your-secret-key-here"
   JWT_SECRET="your-jwt-secret-here"
   ```

   **Frontend (.env.local)**:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:8000"
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

### Backend Server
1. Navigate to the backend directory
   ```bash
   cd backend
   ```

2. Run database migrations
   ```bash
   python -m src.database.migrate
   ```

3. Start the backend server
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

### Frontend Server
1. Navigate to the frontend directory
   ```bash
   cd frontend
   ```

2. Start the development server
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

## Key Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout from session

### Task Management
- `GET /api/tasks` - Get current user's tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{task_id}` - Get specific task
- `PUT /api/tasks/{task_id}` - Update specific task
- `DELETE /api/tasks/{task_id}` - Delete specific task

## Development Workflow

### Adding a New Feature
1. Create feature branch: `git checkout -b feature-name`
2. Update specifications in `/specs/todo-app/` if needed
3. Generate tasks using `/sp.tasks` command
4. Implement following the spec-driven approach
5. Test functionality
6. Create pull request

### Running Tests
- Backend tests: `cd backend && pytest`
- Frontend tests: `cd frontend && npm test`
- E2E tests: `npm run test:e2e`

## Architecture Notes

### Frontend Structure
- Server Components used by default for data fetching and rendering
- Client Components only when interactivity is required (use 'use client' directive)
- All API calls go through centralized client in `lib/api.ts`
- JWT tokens automatically attached to requests

### Backend Structure
- FastAPI routes organized under `/routes/`
- Business logic in `/services/`
- Database models in `/models/`
- Request/response schemas in `/schemas/`
- All database operations through SQLModel ORM

## Security Considerations
- All API endpoints prefixed with `/api`
- JWT-based authentication required for protected endpoints
- User data isolation enforced at both API and database levels
- Never trust user IDs from URL parameters - always validate against JWT claims