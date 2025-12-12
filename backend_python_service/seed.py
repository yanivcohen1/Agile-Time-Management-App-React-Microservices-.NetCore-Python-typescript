"""
Database Seeding Script

This script initializes the database with default users and sample data.
It creates:
- An Admin user (if not exists)
- A Demo user (if not exists)
- Sample Todo items for the Demo user
"""
import asyncio
# Monkeypatch asyncio.coroutine for Motor 2.5.1 compatibility with Python 3.14
if not hasattr(asyncio, 'coroutine'):
    asyncio.coroutine = lambda x: x

import os
from app.database import init_db
from app.models import User, Todo, Role, Status
from app.auth import get_password_hash
from datetime import datetime, timedelta

async def seed():
    await init_db()
    
    # Seed Admin
    admin_email = os.getenv("SEED_ADMIN_EMAIL", "admin@todo.dev")
    admin_password = os.getenv("SEED_DEMO_PASSWORD", "ChangeMe123!")
    admin_name = os.getenv("SEED_ADMIN_NAME", "Demo Admin")
    
    admin = await User.find_one(User.email == admin_email)
    if not admin:
        admin = User(
            email=admin_email,
            password_hash=get_password_hash(admin_password),
            full_name=admin_name,
            role=Role.ADMIN
        )
        await admin.create()
        print(f"Created admin: {admin_email}")
    
    # Seed User
    user_email = os.getenv("SEED_USER_EMAIL", "user@todo.dev")
    user_password = os.getenv("SEED_DEMO_PASSWORD", "ChangeMe123!")
    user_name = os.getenv("SEED_USER_NAME", "Demo User")
    
    user = await User.find_one(User.email == user_email)
    if not user:
        user = User(
            email=user_email,
            password_hash=get_password_hash(user_password),
            full_name=user_name,
            role=Role.USER
        )
        await user.create()
        print(f"Created user: {user_email}")

    # Seed Todos for User
    if await Todo.find(Todo.user.id == user.id).count() == 0:
        todos = [
            Todo(title="Learn React", description="Understand components, hooks, and state management.", status=Status.COMPLETED, user=user, due_date=datetime.utcnow() - timedelta(days=1), duration="2h"),
            Todo(title="Build a Project", description="Create a full-stack application using React and Python.", status=Status.IN_PROGRESS, user=user, due_date=datetime.utcnow() + timedelta(days=2), duration="5h"),
            Todo(title="Master FastAPI", description="Learn about dependency injection, Pydantic models, and async routes.", status=Status.PENDING, user=user, due_date=datetime.utcnow() + timedelta(days=5), duration="3h"),
            Todo(title="Deploy App", description="Deploy the application to a cloud provider like Azure or AWS.", status=Status.BACKLOG, user=user, due_date=datetime.utcnow() + timedelta(days=10), duration="1h"),
        ]
        for todo in todos:
            await todo.create()
        print(f"Seeded {len(todos)} todos for user")

if __name__ == "__main__":
    asyncio.run(seed())
