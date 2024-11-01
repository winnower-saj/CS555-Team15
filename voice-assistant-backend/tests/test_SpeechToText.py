import sys
import os
import pytest
import asyncio
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.SpeechToText import TranscriptManager, speech_recognition, pause_microphone, resume_microphone

@pytest.fixture
def transcript_manager():
    return TranscriptManager()

def test_add_transcription(transcript_manager):
    transcript_manager.add_transcription("Hello")
    assert transcript_manager.get_full_transcription() == "Hello"

def test_get_full_transcription(transcript_manager):
    transcript_manager.add_transcription("Hello")
    transcript_manager.add_transcription("World")
    assert transcript_manager.get_full_transcription() == "Hello World"

def test_clear_transcription(transcript_manager):
    transcript_manager.add_transcription("Test")
    transcript_manager.clear()
    assert transcript_manager.get_full_transcription() == ""

@patch("app.SpeechToText.DeepgramClient.listen.asyncwebsocket.v")
async def test_speech_recognition_callback(mock_dg_connection, transcript_manager):
    callback = AsyncMock()
    stop_event = asyncio.Event()
    stop_event.set()  # Trigger stop immediately for test

    with patch("app.SpeechToText.Microphone.start", MagicMock()):
        await speech_recognition(callback, stop_event)

    callback.assert_awaited_once()

@patch("app.SpeechToText.mic_instance")
def test_pause_microphone(mock_mic_instance):
    mock_mic_instance._stream.stop_stream = MagicMock()
    pause_microphone()
    mock_mic_instance._stream.stop_stream.assert_called_once()

@patch("app.SpeechToText.mic_instance")
def test_resume_microphone(mock_mic_instance):
    mock_mic_instance._stream.start_stream = MagicMock()
    mock_mic_instance._stream.is_active.return_value = False
    resume_microphone()
    mock_mic_instance._stream.start_stream.assert_called_once()
