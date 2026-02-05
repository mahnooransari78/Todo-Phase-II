#!/usr/bin/env python3
"""
Script to initialize the database and create all tables.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from sqlmodel import SQLModel
from src.database.session import engine

# Import all models to register them with SQLModel
from src.models.user import User
from src.models.task import Task
from src.models.conversation import Conversation
from src.models.message import Message

def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()