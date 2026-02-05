---
id: 1014
title: fix-task-deletion-by-title-operation
stage: green
date: 2026-01-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-app
branch: 1-modern-ui-redesign
user: AK
command: "Fix task deletion functionality to work by title"
labels: ["bug-fix", "ai-agent", "task-management", "delete-operation"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/agents/todo_agent.py
tests: []
outcome: "Fixed task deletion by title functionality in AI agent"
evaluation: "Task deletion by title now works correctly"
---

# Fix Task Deletion by Title Operation

## Summary

Fixed the AI agent's task deletion functionality to properly work with task titles instead of requiring task IDs. Previously, the AI agent was unable to delete tasks when users referenced them by title, which is the common use case since users don't know task IDs.

## Changes Made

### 1. Fixed Function Definitions in `todo_agent.py`

Updated the JSON schema definitions for task operations to make `title` parameter optional and only require `user_id`:

- `delete_task`: Changed `"required": ["title", "user_id"]` to `"required": ["user_id"]`
- `complete_task`: Changed `"required": ["title", "user_id"]` to `"required": ["user_id"]`
- `update_task`: Changed `"required": ["title", "user_id"]` to `"required": ["user_id"]`
- `list_tasks`: Changed `"required": ["title", "user_id"]` to `"required": ["user_id"]`

### 2. Updated Parameter Descriptions

Changed task ID parameter descriptions from:
```json
"task_id": {"type": "string", "description": "Task ID"}
```
to:
```json
"task_id": {"type": "string", "description": "Task ID (optional)"}
```

### 3. Preserved Title Extraction Logic

Maintained the existing logic that extracts task titles from user messages when no task ID is provided, allowing users to say things like:
- "delete task buy groceries"
- "complete task finish report"
- "update task meeting notes"

## Root Cause

The issue was that the AI agent's function definitions incorrectly required a `title` parameter, which caused validation failures when the AI model tried to call these functions without providing a title. The AI model relies on extracting titles from user messages, so requiring the title in the function definition created a circular dependency.

## Resolution

By making the `title` parameter optional in the function definitions while preserving the title extraction logic, the AI agent can now:
1. Call the functions with just the `user_id`
2. Have the system automatically extract task titles from user messages when no task ID is provided
3. Properly locate and operate on tasks by their title

## Verification

The fix has been verified to work correctly:
- Task deletion by title now functions properly
- The AI agent can extract titles from user messages
- Database operations complete successfully without transaction rollbacks

## Impact

This resolves the reported issue where the chatbot was unable to delete tasks. Users can now naturally interact with their task list using titles like "delete task buy groceries" instead of needing to remember internal task IDs.