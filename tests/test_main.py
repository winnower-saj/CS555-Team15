import os
import sys
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

os.environ["API_KEY"] = "test_api_key"
os.environ["API_KEY_NAME"] = "X-API-KEY"
os.environ["GROQ_API_KEY"] = "test_groq_api_key"
os.environ["DEEPGRAM_API_KEY"] = "test_deepgram_api_key"
os.environ["ELEVENLABS_API_KEY"] = "test_elevenlabs_api_key"

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.api_server import app

client = TestClient(app)

def get_headers(api_key=None):
    api_key = api_key or "test_api_key"
    return { "X-API-KEY": api_key }

def test_get_status_success():
    # Test /status with a valid API key
    response = client.get("/status", headers=get_headers())
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] in ["running", "stopped"]

def test_get_status_invalid_api_key():
    # Test /status with an invalid API key
    response = client.get("/status", headers=get_headers(api_key="invalid_key"))
    assert response.status_code == 403
    assert response.json()["detail"] == "Could not validate credentials"

def test_get_status_no_api_key():
    # Test /status without providing an API key
    response = client.get("/status")
    assert response.status_code == 403
    assert response.json()["detail"] == "Could not validate credentials"

@patch("app.api_server.listen_for_speech", return_value=None)
def test_control_start(mock_listen_for_speech):
    # Test /control with action 'start'
    response = client.post(
        "/control",
        json={"action": "start"},
        headers=get_headers(),
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Assistant started."
    mock_listen_for_speech.assert_called_once()

@patch("app.api_server.listen_for_speech", return_value=None)
def test_control_invalid_action(mock_listen_for_speech):
    # Test /control with an invalid action
    response = client.post(
        "/control",
        json={"action": "invalid_action"},
        headers=get_headers(),
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid action."

def test_control_start_invalid_api_key():
    # Test /control with action 'start' and an invalid API key
    response = client.post(
        "/control",
        json={"action": "start"},
        headers=get_headers(api_key="invalid_key"),
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Could not validate credentials"
