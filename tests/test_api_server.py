import os
import sys
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["API_KEY"] = "testkey"
os.environ["API_KEY_NAME"] = "api_key"

from app.api_server import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def valid_headers():
    return {"api_key": "testkey"}

@pytest.fixture
def invalid_headers():
    return {"api_key": "invalid"}

# Test Cases

@pytest.mark.asyncio
@patch("app.api_server.assistant_manager.start_assistant", new_callable=AsyncMock)
async def test_control_start_success(mock_start, client, valid_headers):
    response = client.post("/control", json={"action": "start"}, headers=valid_headers)
    assert response.status_code == 200
    assert response.json() == {"status": "Assistant started."}
    mock_start.assert_awaited_once()


def test_control_invalid_action(client, valid_headers):
    response = client.post("/control", json={"action": "invalid"}, headers=valid_headers)
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid action."}

def test_control_missing_api_key(client):
    response = client.post("/control", json={"action": "start"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Could not validate credentials"}

def test_control_invalid_api_key(client, invalid_headers):
    response = client.post("/control", json={"action": "start"}, headers=invalid_headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Could not validate credentials"}

@patch("app.api_server.assistant_manager.assistant_running", True)
def test_status_running(client, valid_headers):
    response = client.get("/status", headers=valid_headers)
    assert response.status_code == 200
    assert response.json() == {"status": "running"}

@patch("app.api_server.assistant_manager.assistant_running", False)
def test_status_stopped(client, valid_headers):
    response = client.get("/status", headers=valid_headers)
    assert response.status_code == 200
    assert response.json() == {"status": "stopped"}

def test_status_missing_api_key(client):
    response = client.get("/status")
    assert response.status_code == 403
    assert response.json() == {"detail": "Could not validate credentials"}

def test_status_invalid_api_key(client, invalid_headers):
    response = client.get("/status", headers=invalid_headers)
    assert response.status_code == 403
    assert response.json() == {"detail": "Could not validate credentials"}

@patch("app.api_server.assistant_manager.assistant_running", True)
def test_control_start_already_running(client, valid_headers):
    response = client.post("/control", json={"action": "start"}, headers=valid_headers)
    assert response.status_code == 400
    assert response.json() == {"detail": "Assistant is already running."}

@patch("app.api_server.assistant_manager.assistant_running", False)
def test_control_stop_not_running(client, valid_headers):
    response = client.post("/control", json={"action": "stop"}, headers=valid_headers)
    assert response.status_code == 400
    assert response.json() == {"detail": "Assistant is not running."}
