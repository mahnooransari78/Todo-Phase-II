# Claude Code Rules - Todo App Backend

This file is generated for the backend component of the Todo Full-Stack Web Application.

## Task Context

**Your Surface:** You operate specifically on the backend of the Todo application, implementing FastAPI routes, SQLModel database models, and business logic that enforces authentication and data isolation.

**Your Success is Measured By:**
- All backend code strictly follows the API specifications in `/specs/todo-app/api/`
- All endpoints properly implement JWT authentication and user data isolation
- Database models follow the schema specifications in `/specs/todo-app/database/`
- All code is written in Python with proper type hints using Pydantic

## Backend Architecture Guidelines

### FastAPI Implementation
- Use FastAPI for all API route definitions
- Implement proper request/response validation using Pydantic schemas
- Follow RESTful conventions as specified in API documentation
- Include comprehensive API documentation with automatic OpenAPI generation

### SQLModel Usage
- Use SQLModel as the ORM for all database interactions
- Define all database models in `/backend/src/models/`
- Use proper relationships and constraints as specified in schema documentation
- Implement proper database session management

### Route Organization
- Organize routes in `/backend/src/routes/` by feature area
- Implement authentication routes in `/backend/src/routes/auth.py`
- Task management routes in `/backend/src/routes/tasks.py`
- AI assistant routes in `/backend/src/routes/ai.py`
- Include proper middleware and error handling for all routes

### Service Layer Pattern
- Implement business logic in `/backend/src/services/`
- Separate concerns between routes (API interface) and services (business logic)
- Include proper transaction management for data operations
- Implement proper error handling and logging in service layer

## Security Guidelines

### Authentication & Authorization
- All API endpoints must be prefixed with `/api` as required
- Implement JWT token validation on all protected endpoints
- Extract user identity exclusively from validated JWT claims
- Never trust user IDs from URL parameters - always validate against JWT
- Return 401 Unauthorized for invalid/missing tokens
- Return 403 Forbidden for cross-user data access attempts

### Data Isolation
- Every task must belong to exactly one authenticated user
- Implement database queries that always filter by user_id from JWT claims
- Enforce user-level data isolation at both API and database levels
- Prevent any possibility of cross-user data access

### Input Validation
- Validate all request data using Pydantic schemas
- Implement proper sanitization of user inputs
- Prevent SQL injection through proper use of SQLModel/SQLAlchemy
- Implement rate limiting on authentication endpoints

## Implementation Standards

### Python & Type Hints
- Use Python 3.10+ with proper type hints
- Implement Pydantic schemas for all request/response models
- Use proper exception handling with custom exception classes
- Follow PEP 8 style guidelines

### Database Operations
- Use SQLModel for all database interactions
- Implement proper database session management
- Use transactions for operations that require atomicity
- Include proper indexing as specified in schema documentation

### Error Handling
- Implement proper HTTP status codes as specified in API documentation
- Create consistent error response format
- Log errors appropriately for debugging while protecting sensitive data
- Implement validation error handling with detailed error messages

## Project Structure References

- `/backend/src/main.py` - FastAPI application entry point
- `/backend/src/models/` - SQLModel database models
- `/backend/src/schemas/` - Pydantic schemas for request/response
- `/backend/src/routes/` - API route definitions
- `/backend/src/services/` - Business logic layer
- `/backend/src/database/` - Database connection and session management
- `/backend/src/utils/` - Utility functions

## Specification Compliance

- Always reference API specifications in `/specs/todo-app/api/endpoints.md`
- Follow database schema specifications in `/specs/todo-app/database/schema.md`
- Implement all authentication requirements as specified
- Ensure all security requirements are properly implemented
- Maintain data isolation requirements as specified

## Integration Points

- Frontend API consumption as specified in `/specs/todo-app/ui/ui-specification.md`
- Authentication flow as specified in `/specs/todo-app/features/authentication.md`
- Task management features as specified in `/specs/todo-app/features/task-crud.md`
- AI assistant integration as specified in `/specs/todo-app/features/ai-assistant.md`