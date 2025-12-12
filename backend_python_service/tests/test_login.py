"""
Script to test login functionality manually.
"""
# pylint: disable=duplicate-code
import asyncio

# Monkeypatch asyncio.coroutine for Motor 2.5.1 compatibility with Python 3.14
if not hasattr(asyncio, 'coroutine'):
    def coroutine(func):
        """Mock asyncio.coroutine."""
        return func
    asyncio.coroutine = coroutine

# pylint: disable=wrong-import-position
from app.database import init_db
from app.models import User
from app.auth import verify_password

async def test_login():
    """Test the login process."""
    await init_db()
    email = "user@todo.dev"
    password = "ChangeMe123!"

    user = await User.find_one(User.email == email)
    if not user:
        print("User not found")
        return

    print(f"User found: {user.email}")
    print(f"Stored hash: {user.password_hash}")

    is_valid = verify_password(password, user.password_hash)
    print(f"Password '{password}' valid? {is_valid}")

    # Test with wrong password
    is_valid_wrong = verify_password("wrong", user.password_hash)
    print(f"Password 'wrong' valid? {is_valid_wrong}")

if __name__ == "__main__":
    asyncio.run(test_login())
