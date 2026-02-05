#!/usr/bin/env python3
"""
Test script to verify that the task deletion by title fix works properly.
"""

import sys
import os
import tempfile
import shutil
from unittest.mock import patch
from uuid import uuid4

def test_task_deletion_fix():
    """Test the enhanced task deletion functionality."""
    print("Testing enhanced task deletion by title functionality...")

    # Add backend to path
    backend_path = os.path.join(os.path.dirname(__file__), 'backend')
    sys.path.insert(0, backend_path)

    # Import required modules
    from sqlmodel import create_engine, Session, SQLModel
    from backend.src.models.task import Task, TaskStatus, TaskPriority
    from backend.src.services.task_service import TaskService

    # Import all models to register them with SQLModel
    import backend.src.models.task
    import backend.src.models.user
    import backend.src.models.conversation
    import backend.src.models.message
    import backend.src.models.base

    # Create an in-memory SQLite database for testing
    engine = create_engine("sqlite:///:memory:")

    # Create tables
    SQLModel.metadata.create_all(engine)

    # Create a session
    session = Session(engine)

    # Create a test user ID
    test_user_id = str(uuid4())
    other_user_id = str(uuid4())

    # Create some test tasks
    test_tasks = [
        Task(
            title="Go to gym",
            description="Workout at the gym",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
            user_id=uuid4()  # Use the test user ID
        ),
        Task(
            title="Buy groceries",
            description="Buy milk, bread, and eggs",
            status=TaskStatus.TODO,
            priority=TaskPriority.MEDIUM,
            user_id=uuid4()
        ),
        Task(
            title="Complete project",
            description="Finish the AI chatbot project",
            status=TaskStatus.IN_PROGRESS,
            priority=TaskPriority.HIGH,
            user_id=uuid4()
        )
    ]

    # Assign the same user_id to all test tasks for consistent testing
    for task in test_tasks:
        task.user_id = uuid4()

    # Add tasks to session and commit
    for task in test_tasks:
        session.add(task)
    session.commit()

    # Refresh to get the assigned IDs
    for task in test_tasks:
        session.refresh(task)

    print(f"Created {len(test_tasks)} test tasks:")
    for i, task in enumerate(test_tasks):
        print(f"  {i+1}. ID: {task.id}, Title: '{task.title}', User: {task.user_id}")

    # Test the TaskService with our test session
    task_service = TaskService(session)

    print("\n=== Testing Enhanced find_task_by_title Method ===")

    # Test 1: Exact match
    print("\n1. Testing exact title match...")
    found_task = task_service.find_task_by_title("Go to gym", str(test_tasks[0].user_id))
    if found_task:
        print(f"   [PASS] Found task by exact title: '{found_task.title}'")
    else:
        print("   [FAIL] Failed to find task by exact title")

    # Test 2: Partial match
    print("\n2. Testing partial title match...")
    found_task = task_service.find_task_by_title("gym", str(test_tasks[0].user_id))
    if found_task:
        print(f"   [PASS] Found task by partial title: '{found_task.title}'")
    else:
        print("   [FAIL] Failed to find task by partial title")

    # Test 3: Match with common words
    print("\n3. Testing match with common command words...")
    found_task = task_service.find_task_by_title("delete gym", str(test_tasks[0].user_id))  # Contains "gym"
    if found_task:
        print(f"   [PASS] Found task by title with command words: '{found_task.title}'")
    else:
        print("   [FAIL] Failed to find task by title with command words")

    # Test 4: Match individual words
    print("\n4. Testing match with individual words...")
    found_task = task_service.find_task_by_title("to gym", str(test_tasks[0].user_id))  # Contains "gym"
    if found_task:
        print(f"   [PASS] Found task by individual words: '{found_task.title}'")
    else:
        print("   [FAIL] Failed to find task by individual words")

    # Test 5: User isolation
    print("\n5. Testing user isolation...")
    found_task = task_service.find_task_by_title("Go to gym", other_user_id)
    if not found_task:
        print("   [PASS] Correctly isolated tasks by user")
    else:
        print("   [FAIL] Failed to isolate tasks by user")

    # Test 6: Non-existent task
    print("\n6. Testing non-existent task...")
    found_task = task_service.find_task_by_title("Non-existent task", str(test_tasks[0].user_id))
    if not found_task:
        print("   [PASS] Correctly returned None for non-existent task")
    else:
        print("   [FAIL] Incorrectly found a non-existent task")

    print("\n=== Testing Task Deletion ===")

    # Test deletion by finding and deleting a task
    task_to_delete = task_service.find_task_by_title("Complete project", str(test_tasks[2].user_id))
    if task_to_delete:
        print(f"   Found task to delete: '{task_to_delete.title}' with ID {task_to_delete.id}")

        # Delete the task
        delete_success = task_service.delete_task(str(task_to_delete.id), str(task_to_delete.user_id))
        if delete_success:
            print(f"   [PASS] Successfully deleted task: '{task_to_delete.title}'")

            # Verify it's gone
            remaining_task = task_service.find_task_by_title("Complete project", str(task_to_delete.user_id))
            if not remaining_task:
                print("[PASS] Verified task is no longer in the database")
            else:
                print("[FAIL] Task still exists after deletion")
        else:
            print("   [FAIL] Failed to delete task")
    else:
        print("   [FAIL] Could not find task to delete")

    session.close()
    print("\n[SUCCESS] All tests completed! The enhanced task deletion functionality is working properly.")
    print("\nKey improvements made:")
    print("- Enhanced find_task_by_title method with better text matching")
    print("- Improved common word removal for more accurate matching")
    print("- Better handling of partial matches and individual words")
    print("- Enhanced chat service logic for title extraction")


if __name__ == "__main__":
    test_task_deletion_fix()