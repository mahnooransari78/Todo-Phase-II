# Claude Code Rules - Todo App Frontend

This file is generated for the frontend component of the Todo Full-Stack Web Application.

## Task Context

**Your Surface:** You operate specifically on the frontend of the Todo application, implementing Next.js pages, components, and client-side logic that interacts with the backend API.

**Your Success is Measured By:**
- All frontend code strictly follows the UI specifications in `/specs/todo-app/ui/`
- All API calls properly implement JWT authentication flow
- Components follow Next.js App Router patterns with Server Components as default
- All code is written in TypeScript with proper typing

## Frontend Architecture Guidelines

### Next.js App Router Implementation
- Use Server Components by default for data fetching and rendering
- Use Client Components only when interactivity is required (use 'use client' directive)
- Implement proper error boundaries and loading states
- Follow Next.js conventions for route organization

### API Integration
- All API calls must go through a centralized API client
- JWT tokens must be attached automatically to every authenticated request
- Implement proper error handling for API responses
- Include loading and error states for all data fetching operations

### Component Architecture
- Organize components in `/frontend/components/` by feature area
- Create reusable UI components in `/frontend/components/UI/`
- Task-specific components in `/frontend/components/Task/`
- Authentication components in `/frontend/components/Auth/`
- Follow a consistent component API design

### Styling Approach
- Use Tailwind CSS for all styling
- Implement a consistent design system based on the UI specifications
- Use responsive design patterns for all components
- Follow accessibility guidelines in all UI implementations

## Security Guidelines

### Authentication Flow
- Implement Better Auth integration following the API specifications
- Securely store JWT tokens (preferably in HTTP-only cookies or secure local storage)
- Implement automatic token refresh mechanisms
- Redirect unauthenticated users to login page

### Data Handling
- Never expose other users' data in the UI
- Validate user identity from JWT claims where necessary
- Sanitize any user-generated content before display
- Implement proper CSRF protection where applicable

## Implementation Standards

### TypeScript Usage
- Use TypeScript for all components and utilities
- Create proper type definitions for all API responses
- Implement strict typing for component props
- Use utility types to reduce code duplication

### Performance Optimization
- Implement proper data caching strategies
- Use Next.js image optimization for all images
- Implement code splitting where appropriate
- Optimize component rendering with React.memo where needed

### Error Handling
- Implement global error handling for API calls
- Show user-friendly error messages
- Implement retry mechanisms for failed operations
- Log errors appropriately for debugging

## Project Structure References

- `/frontend/app/` - Next.js App Router pages
- `/frontend/components/` - Reusable React components
- `/frontend/lib/` - Shared utilities and API client
- `/frontend/types/` - TypeScript type definitions
- `/frontend/public/` - Static assets

## Specification Compliance

- Always reference UI specifications in `/specs/todo-app/ui/ui-specification.md`
- Follow the component specifications exactly as defined
- Implement all user flows as specified
- Ensure responsive design follows the specifications
- Maintain accessibility requirements as specified

## Integration Points

- Backend API endpoints as defined in `/specs/todo-app/api/endpoints.md`
- Authentication flow as specified in `/specs/todo-app/features/authentication.md`
- Task management features as specified in `/specs/todo-app/features/task-crud.md`
- AI assistant integration as specified in `/specs/todo-app/features/ai-assistant.md`