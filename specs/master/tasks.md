---
description: "Task list template for feature implementation"
---

# Tasks: Todo Full-Stack Web Application

**Input**: Design documents from `/specs/todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume web app structure - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure with frontend and backend directories per implementation plan
- [X] T002 Initialize Next.js project in frontend directory with TypeScript and Tailwind CSS
- [X] T003 [P] Initialize Python FastAPI project in backend directory with requirements.txt
- [X] T004 [P] Configure linting and formatting tools for both frontend and backend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [X] T005 Setup database schema and migrations framework using SQLModel in backend/src/database/
- [X] T006 [P] Implement authentication framework with Better Auth integration in frontend and JWT verification in backend/src/utils/auth.py
- [X] T007 [P] Setup API routing and middleware structure in backend/src/main.py and backend/src/routes/
- [X] T008 Create base models/entities that all stories depend on in backend/src/models/base.py
- [X] T009 Configure error handling and logging infrastructure in backend/src/utils/
- [X] T010 Setup environment configuration management in both frontend and backend
- [X] T011 Create centralized API client in frontend/lib/api.ts with JWT token handling

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Task Management (Priority: P1) 🎯 MVP

**Goal**: Users can create, view, update, and delete their personal tasks in a web interface - core functionality that forms the foundation of the todo application.

**Independent Test**: Can be fully tested by creating tasks, viewing them in a list, updating their status, and deleting them independently of other features. Delivers core value of a todo application.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T012 [P] [US1] Contract test for GET /api/tasks endpoint in backend/tests/contract/test_tasks.py
- [x] T013 [P] [US1] Contract test for POST /api/tasks endpoint in backend/tests/contract/test_tasks.py
- [x] T014 [P] [US1] Contract test for PUT /api/tasks/{task_id} endpoint in backend/tests/contract/test_tasks.py
- [x] T015 [P] [US1] Contract test for DELETE /api/tasks/{task_id} endpoint in backend/tests/contract/test_tasks.py

### Implementation for User Story 1

- [X] T016 [P] [US1] Create User model in backend/src/models/user.py with fields from data-model.md
- [X] T017 [P] [US1] Create Task model in backend/src/models/task.py with fields from data-model.md
- [X] T018 [US1] Implement UserService in backend/src/services/tasks.py (depends on T016, T017)
- [X] T019 [US1] Implement authentication and authorization logic in backend/src/services/auth.py
- [X] T020 [US1] Implement GET /api/tasks endpoint in backend/src/routes/tasks.py
- [X] T021 [US1] Implement POST /api/tasks endpoint in backend/src/routes/tasks.py
- [X] T022 [US1] Implement GET /api/tasks/{task_id} endpoint in backend/src/routes/tasks.py
- [X] T023 [US1] Implement PUT /api/tasks/{task_id} endpoint in backend/src/routes/tasks.py
- [X] T024 [US1] Implement DELETE /api/tasks/{task_id} endpoint in backend/src/routes/tasks.py
- [X] T025 [US1] Add validation and error handling for task operations
- [X] T026 [US1] Add logging for task operations in backend/src/utils/
- [X] T027 [US1] Create Task form component in frontend/components/Task/TaskForm.tsx
- [X] T028 [US1] Create Task list component in frontend/components/Task/TaskList.tsx
- [X] T029 [US1] Create Task card component in frontend/components/Task/TaskCard.tsx
- [X] T030 [US1] Implement task management page in frontend/app/dashboard/tasks/page.tsx
- [X] T031 [US1] Integrate frontend with backend API using centralized client
- [X] T032 [US1] Add user authentication check to task management page

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Authentication (Priority: P1)

**Goal**: Users can register, login, and maintain authenticated sessions to access their personal todo data - essential for data security.

**Independent Test**: Can be fully tested by registering a new user, logging in, maintaining a session, and logging out. Essential for data security.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [x] T033 [P] [US2] Contract test for POST /api/auth/register endpoint in backend/tests/contract/test_auth.py
- [x] T034 [P] [US2] Contract test for POST /api/auth/login endpoint in backend/tests/contract/test_auth.py
- [x] T035 [P] [US2] Contract test for POST /api/auth/logout endpoint in backend/tests/contract/test_auth.py

### Implementation for User Story 2

- [X] T036 [P] [US2] Create Auth service in backend/src/services/auth.py for user registration and login
- [X] T037 [US2] Implement POST /api/auth/register endpoint in backend/src/routes/auth.py
- [X] T038 [US2] Implement POST /api/auth/login endpoint in backend/src/routes/auth.py
- [X] T039 [US2] Implement POST /api/auth/logout endpoint in backend/src/routes/auth.py
- [X] T040 [US2] Add password hashing functionality in backend/src/utils/security.py
- [X] T041 [US2] Create login page component in frontend/app/login/page.tsx
- [X] T042 [US2] Create register page component in frontend/app/register/page.tsx
- [X] T043 [US2] Create authentication context in frontend/contexts/AuthContext.tsx
- [X] T044 [US2] Create login form component in frontend/components/Auth/LoginForm.tsx
- [X] T045 [US2] Create register form component in frontend/components/Auth/RegisterForm.tsx
- [X] T046 [US2] Implement JWT token storage and retrieval in frontend/lib/auth.ts
- [X] T047 [US2] Add protected route wrapper in frontend/components/Auth/ProtectedRoute.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - AI Assistant Integration (Priority: P2)

**Goal**: Users can interact with an AI assistant to help manage tasks, suggest priorities, and organize their todo lists - value-add feature that differentiates the application.

**Independent Test**: Can be tested by sending natural language requests to the AI assistant and receiving task-related suggestions or actions. Enhances the core task management experience.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [x] T048 [P] [US3] Contract test for POST /api/ai/tasks endpoint in backend/tests/contract/test_ai.py

### Implementation for User Story 3

- [x] T049 [P] [US3] Create AI assistant service in backend/src/services/ai.py
- [x] T050 [US3] Create AI session model in backend/src/models/ai_session.py
- [x] T051 [US3] Implement POST /api/ai/tasks endpoint in backend/src/routes/ai.py
- [x] T052 [US3] Add AI assistant UI component in frontend/components/AI/AIAssistant.tsx
- [x] T053 [US3] Integrate AI assistant with task management in frontend/app/dashboard/tasks/page.tsx

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T054 [P] Documentation updates in docs/
- [x] T055 Code cleanup and refactoring
- [x] T056 Performance optimization across all stories
- [x] T057 [P] Additional unit tests (if requested) in backend/tests/unit/ and frontend/tests/
- [x] T058 Security hardening
- [x] T059 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for GET /api/tasks endpoint in backend/tests/contract/test_tasks.py"
Task: "Contract test for POST /api/tasks endpoint in backend/tests/contract/test_tasks.py"
Task: "Contract test for PUT /api/tasks/{task_id} endpoint in backend/tests/contract/test_tasks.py"
Task: "Contract test for DELETE /api/tasks/{task_id} endpoint in backend/tests/contract/test_tasks.py"

# Launch all models for User Story 1 together:
Task: "Create User model in backend/src/models/user.py with fields from data-model.md"
Task: "Create Task model in backend/src/models/task.py with fields from data-model.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence