# API Specification: Todo Full-Stack Web Application

**Created**: 2026-01-05
**Feature**: Todo Full-Stack Web Application
**Input**: Feature specifications and system architecture

## API Design Principles

### General Rules
- All backend routes must be prefixed with `/api` as required by project constitution
- Authentication must be JWT-based using Better Auth
- User identity must be derived exclusively from validated JWT claims
- User identifiers must NOT be trusted from URL parameters
- RESTful conventions must be followed
- All endpoints must enforce user-level data isolation

### Authentication & Authorization
- All protected endpoints require valid JWT token in Authorization header
- Invalid/missing tokens return 401 Unauthorized
- Cross-user data access attempts return 403 Forbidden
- JWT tokens verified using shared secret from `BETTER_AUTH_SECRET` environment variable

### Request/Response Format
- Content-Type: application/json for all requests
- Response format: JSON with consistent structure
- Error responses follow standard format with error codes and messages

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
**Description**: Register a new user account

**Request**:
```
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created)**:
```
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-string"
}
```

**Error Response (400 Bad Request)**:
```
{
  "error": "Validation failed",
  "details": ["email must be valid", "password must meet complexity requirements"]
}
```

#### POST /api/auth/login
**Description**: Authenticate user and return JWT token

**Request**:
```
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**:
```
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-string"
}
```

#### POST /api/auth/logout
**Description**: Terminate user session

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Response (200 OK)**:
```
{
  "success": true,
  "message": "Successfully logged out"
}
```

### Task Management Endpoints

#### GET /api/tasks
**Description**: Retrieve current user's tasks with optional filtering

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Query Parameters (optional)**:
- `status`: Filter by task status (to-do, in-progress, completed)
- `priority`: Filter by priority (low, medium, high)
- `limit`: Number of tasks to return (default: 20, max: 100)
- `offset`: Number of tasks to skip (for pagination)

**Response (200 OK)**:
```
{
  "tasks": [
    {
      "id": "uuid-string",
      "title": "Task title",
      "description": "Task description",
      "status": "to-do",
      "priority": "high",
      "due_date": "2023-12-31T10:00:00Z",
      "created_at": "2023-12-01T10:00:00Z",
      "updated_at": "2023-12-01T10:00:00Z",
      "user_id": "user-uuid-string"
    }
  ],
  "total": 15,
  "limit": 20,
  "offset": 0
}
```

#### POST /api/tasks
**Description**: Create a new task for the current user

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Request**:
```
{
  "title": "New task title",
  "description": "Task description (optional)",
  "status": "to-do", // Default if not provided
  "priority": "medium", // Default if not provided
  "due_date": "2023-12-31T10:00:00Z" // Optional
}
```

**Response (201 Created)**:
```
{
  "task": {
    "id": "uuid-string",
    "title": "New task title",
    "description": "Task description (optional)",
    "status": "to-do",
    "priority": "medium",
    "due_date": "2023-12-31T10:00:00Z",
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z",
    "user_id": "user-uuid-string"
  }
}
```

#### GET /api/tasks/{task_id}
**Description**: Retrieve a specific task for the current user

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Path Parameters**:
- `task_id`: UUID of the task to retrieve

**Response (200 OK)**:
```
{
  "task": {
    "id": "uuid-string",
    "title": "Task title",
    "description": "Task description",
    "status": "to-do",
    "priority": "high",
    "due_date": "2023-12-31T10:00:00Z",
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z",
    "user_id": "user-uuid-string"
  }
}
```

#### PUT /api/tasks/{task_id}
**Description**: Update a specific task for the current user

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Path Parameters**:
- `task_id`: UUID of the task to update

**Request**:
```
{
  "title": "Updated task title (optional)",
  "description": "Updated description (optional)",
  "status": "in-progress (optional)",
  "priority": "high (optional)",
  "due_date": "2023-12-31T10:00:00Z (optional)"
}
```

**Response (200 OK)**:
```
{
  "task": {
    "id": "uuid-string",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "in-progress",
    "priority": "high",
    "due_date": "2023-12-31T10:00:00Z",
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-02T10:00:00Z",
    "user_id": "user-uuid-string"
  }
}
```

#### DELETE /api/tasks/{task_id}
**Description**: Delete a specific task for the current user

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Path Parameters**:
- `task_id`: UUID of the task to delete

**Response (200 OK)**:
```
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### AI Assistant Endpoints

#### POST /api/ai/tasks
**Description**: Process natural language input to create tasks or provide suggestions

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Request**:
```
{
  "input": "Remind me to call John tomorrow at 2 PM",
  "context": "task_creation" // or "prioritization", "organization"
}
```

**Response (200 OK)**:
```
{
  "suggestions": [
    {
      "type": "task_creation",
      "task": {
        "title": "Call John",
        "description": "Call John tomorrow at 2 PM",
        "due_date": "2023-12-02T14:00:00Z",
        "priority": "medium"
      },
      "confidence": 0.95
    }
  ]
}
```

## Error Response Format

All error responses follow this standard format:

```
{
  "error": "Error message",
  "error_code": "ERROR_CODE",
  "timestamp": "2023-12-01T10:00:00Z",
  "details": [optional array of specific error details]
}
```

## HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource successfully created
- **400 Bad Request**: Invalid request format or validation error
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Valid token but insufficient permissions (e.g., accessing another user's data)
- **404 Not Found**: Requested resource does not exist
- **422 Unprocessable Entity**: Request format valid but semantic validation failed
- **500 Internal Server Error**: Server-side error occurred

## Security Considerations

- All API requests must include JWT token in Authorization header
- User ID is validated against JWT claims for every data access operation
- No user may access another user's data regardless of URL parameter
- Input validation performed on all request data to prevent injection attacks
- Rate limiting implemented on authentication endpoints to prevent brute force