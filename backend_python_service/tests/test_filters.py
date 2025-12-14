import pytest
from datetime import datetime
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models import User, Role, Todo, Status
from app.auth import create_access_token, get_password_hash

@pytest.fixture
async def client(test_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def test_user():
    user = User(
        email="filtertest_perm@example.com",
        password_hash=get_password_hash("password"),
        full_name="Filter Test User",
        role=Role.USER
    )
    await user.create()
    return user

@pytest.fixture
def token(test_user):
    return create_access_token({"sub": test_user.email, "role": test_user.role})

@pytest.mark.asyncio
async def test_get_todos_due_date_filter_inclusive(client, token, test_user):
    """
    Test that the due_date_end filter includes the entire day when the time is midnight.
    """
    # Create a todo due on 2023-10-27 at noon
    due_date = datetime(2023, 10, 27, 12, 0, 0)
    todo = Todo(
        title="Due Date Test Inclusive",
        status=Status.BACKLOG,
        due_date=due_date,
        user=test_user
    )
    await todo.create()

    # Filter with end date as 2023-10-27 (which defaults to midnight start of day)
    # We expect this to INCLUDE the todo because the backend should adjust it to end of day
    response = await client.get(
        "/todos/",
        params={"due_date_end": "2023-10-27T00:00:00"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify the item is returned
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Due Date Test Inclusive"

@pytest.mark.asyncio
async def test_get_todos_due_date_filter_exclusive(client, token, test_user):
    """
    Test that the due_date_end filter correctly excludes items after the date.
    """
    # Create a todo due on 2023-10-28 at noon
    due_date = datetime(2023, 10, 28, 12, 0, 0)
    todo = Todo(
        title="Due Date Test Exclusive",
        status=Status.BACKLOG,
        due_date=due_date,
        user=test_user
    )
    await todo.create()

    # Filter with end date as 2023-10-27
    response = await client.get(
        "/todos/",
        params={"due_date_end": "2023-10-27T00:00:00"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify the item is NOT returned
    assert len(data["items"]) == 0
