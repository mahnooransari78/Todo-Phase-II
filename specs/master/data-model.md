# Data Model: Todo Full-Stack Web Application

**Feature**: Todo Full-Stack Web Application
**Date**: 2026-01-05
**Spec**: @specs/todo-app/spec.md, @specs/todo-app/database/schema.md

## Entity Definitions

### User Entity
**Purpose**: Represents an authenticated user in the system

**Fields**:
- `id` (UUID, Primary Key, Required): Unique identifier for the user
- `email` (String, Required, Unique): User's email address for authentication
- `name` (String, Required): User's display name
- `hashed_password` (String, Required): BCrypt hashed password
- `email_verified` (Boolean, Default: false): Whether email has been verified
- `created_at` (Timestamp, Required, Default: now): Account creation timestamp
- `updated_at` (Timestamp, Required, Default: now): Last update timestamp
- `last_login` (Timestamp, Optional): Last login timestamp

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all users
- Name must not be empty
- Password must meet security requirements (handled during authentication)

**Relationships**:
- One-to-Many: User has many Tasks (user.tasks)

### Task Entity
**Purpose**: Represents a user's individual task

**Fields**:
- `id` (UUID, Primary Key, Required): Unique identifier for the task
- `title` (String, Required): Task title (cannot be empty)
- `description` (Text, Optional): Detailed task description
- `status` (String, Required, Default: "to-do"): Task status (values: "to-do", "in-progress", "completed")
- `priority` (String, Required, Default: "medium"): Task priority (values: "low", "medium", "high")
- `due_date` (Timestamp, Optional): Optional due date for the task
- `user_id` (UUID, Required, Foreign Key): Owner of the task (references users.id)
- `created_at` (Timestamp, Required, Default: now): Task creation timestamp
- `updated_at` (Timestamp, Required, Default: now): Last update timestamp

**Validation Rules**:
- Title cannot be empty
- Status must be one of: "to-do", "in-progress", "completed"
- Priority must be one of: "low", "medium", "high"
- User_id must reference an existing user
- Due date (if provided) must be a valid future date

**Relationships**:
- Many-to-One: Task belongs to one User (task.user)

### Session Entity (AI Assistant)
**Purpose**: Represents AI assistant session data (for future AI functionality)

**Fields**:
- `id` (UUID, Primary Key, Required): Unique identifier for the session
- `user_id` (UUID, Required, Foreign Key): User associated with the session
- `session_data` (JSONB, Optional): JSON data for the AI conversation context
- `created_at` (Timestamp, Required, Default: now): Session creation timestamp
- `updated_at` (Timestamp, Required, Default: now): Last update timestamp

**Validation Rules**:
- User_id must reference an existing user
- Session data must be valid JSON

**Relationships**:
- Many-to-One: Session belongs to one User (session.user)

## State Transitions

### Task Status Transitions
- **to-do** → **in-progress**: When user starts working on the task
- **in-progress** → **completed**: When user finishes the task
- **completed** → **to-do**: When user needs to reopen the task
- **in-progress** → **to-do**: When user needs to return task to to-do state

### Task Priority Changes
- Priority can be updated at any time to: "low", "medium", or "high"
- Changes take effect immediately in the database

## Data Integrity Constraints

### Referential Integrity
- All tasks must have a valid user_id that references an existing user
- When a user is deleted, all their tasks are also deleted (CASCADE DELETE)

### Domain Constraints
- Status values restricted to: "to-do", "in-progress", "completed"
- Priority values restricted to: "low", "medium", "high"
- Email format validated at application level
- Title cannot be empty for tasks

### Security Constraints
- User passwords stored only as hashed values
- No direct access to another user's data is possible through the data model
- All queries must filter by user_id to maintain data isolation

## Indexing Strategy

### Required Indexes
- `idx_users_email`: Unique index on email for fast authentication lookups
- `idx_tasks_user_id`: Index on user_id for user-specific queries
- `idx_tasks_status`: Index on status for filtering by task status
- `idx_tasks_priority`: Index on priority for priority-based queries
- `idx_tasks_due_date`: Index on due_date for date-based queries
- `idx_tasks_user_status`: Composite index on (user_id, status) for common queries

## API Contract Implications

### User API Endpoints
- GET /api/users/profile - Retrieve current user's profile
- PUT /api/users/profile - Update user's profile information

### Task API Endpoints
- GET /api/tasks - Retrieve user's tasks with filtering options
- POST /api/tasks - Create a new task for the user
- GET /api/tasks/{task_id} - Retrieve a specific task
- PUT /api/tasks/{task_id} - Update a specific task
- DELETE /api/tasks/{task_id} - Delete a specific task

### Validation Requirements
- All API requests must validate user identity from JWT claims
- All task operations must verify the task belongs to the authenticated user
- Input validation must match the data model constraints