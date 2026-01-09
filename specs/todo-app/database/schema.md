# Database Specification: Todo Full-Stack Web Application

**Created**: 2026-01-05
**Feature**: Todo Full-Stack Web Application
**Input**: Feature specifications and system architecture

## Database Technology

**Database**: Neon Serverless PostgreSQL
- Serverless architecture with automatic scaling
- PostgreSQL 14+ compatibility required
- Connection pooling managed by application
- Environment-based configuration for development/production

## Schema Design

### Users Table

**Table**: `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() | Unique identifier for each user |
| email | VARCHAR(255) | NOT NULL, UNIQUE, NOT NULL | User's email address |
| name | VARCHAR(255) | NOT NULL | User's display name |
| hashed_password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| email_verified | BOOLEAN | DEFAULT FALSE | Whether email has been verified |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| last_login | TIMESTAMP | NULL | Last login timestamp |

**Indexes**:
- `idx_users_email`: UNIQUE INDEX on email for fast lookups
- `idx_users_created_at`: INDEX on created_at for chronological queries

**Constraints**:
- Email format validation through application layer
- Email uniqueness enforced at database level

### Tasks Table

**Table**: `tasks`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() | Unique identifier for each task |
| title | VARCHAR(255) | NOT NULL | Task title (required) |
| description | TEXT | NULL | Detailed task description |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'to-do' | Task status: 'to-do', 'in-progress', 'completed' |
| priority | VARCHAR(50) | NOT NULL, DEFAULT 'medium' | Task priority: 'low', 'medium', 'high' |
| due_date | TIMESTAMP | NULL | Optional due date for the task |
| user_id | UUID | NOT NULL, FOREIGN KEY | Owner of the task (references users.id) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Task creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes**:
- `idx_tasks_user_id`: INDEX on user_id for user-specific queries
- `idx_tasks_status`: INDEX on status for filtering by status
- `idx_tasks_priority`: INDEX on priority for priority-based queries
- `idx_tasks_due_date`: INDEX on due_date for date-based queries
- `idx_tasks_user_status`: COMPOSITE INDEX on (user_id, status) for common queries

**Foreign Keys**:
- `fk_tasks_user_id`: REFERENCES users(id) with CASCADE DELETE (when user is deleted, their tasks are also deleted)

**Constraints**:
- Status values limited to: 'to-do', 'in-progress', 'completed'
- Priority values limited to: 'low', 'medium', 'high'
- Title cannot be empty
- User_id must reference an existing user

### AI Sessions Table (for future AI assistant functionality)

**Table**: `ai_sessions` [NEEDS CLARIFICATION: Required for Phase 1?]

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() | Unique identifier for each AI session |
| user_id | UUID | NOT NULL, FOREIGN KEY | User associated with the session |
| session_data | JSONB | NULL | JSON data for the AI conversation context |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Session creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes**:
- `idx_ai_sessions_user_id`: INDEX on user_id for user-specific queries

**Foreign Keys**:
- `fk_ai_sessions_user_id`: REFERENCES users(id)

## Data Ownership and Isolation Rules

### User Data Isolation
- Every task must belong to exactly one authenticated user
- Database queries must always filter by user_id to prevent cross-user access
- Foreign key constraints ensure referential integrity
- No direct access to another user's data is possible through the database schema

### Security Measures
- User passwords stored only as hashed values (never in plain text)
- No cross-user data access possible through database constraints
- Proper indexing for performance while maintaining security
- Timestamps for audit trail of all operations

### Data Integrity
- NOT NULL constraints on required fields
- Foreign key constraints to maintain referential integrity
- Check constraints for status and priority values
- Default values for fields that have sensible defaults

## Migration Strategy

### Initial Schema Creation
1. Create users table with all required columns and constraints
2. Create tasks table with all required columns, constraints, and foreign keys
3. Create indexes for optimal query performance
4. Set up proper foreign key relationships with cascade rules

### Future Migrations
- All schema changes must maintain data isolation principles
- Migrations must be tested to ensure no cross-user data access is possible
- Backward compatibility must be maintained where possible
- Rollback procedures defined for all migrations

## Performance Considerations

### Indexing Strategy
- Primary indexes on foreign keys for join performance
- Composite indexes for common query patterns (user_id + status)
- Indexes on frequently queried columns (status, priority, due_date)
- Regular monitoring of index usage and performance

### Query Optimization
- All queries must include user_id filter for security
- Use parameterized queries to prevent SQL injection
- Pagination for large result sets
- Connection pooling for efficient database usage

## Backup and Recovery

### Backup Strategy
- Automated daily backups of PostgreSQL database
- Point-in-time recovery capability
- Encrypted backup storage
- Regular backup verification procedures

### Recovery Procedures
- Documented procedures for database recovery
- Test recovery procedures regularly
- Minimal data loss target (RPO: 1 hour)
- Maximum downtime target (RTO: 4 hours)