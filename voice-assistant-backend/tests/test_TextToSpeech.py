import os
import pytest
from unittest.mock import patch, MagicMock
from io import BytesIO

os.environ["ELEVENLABS_API_KEY"] = "test_api_key"

from app.TextToSpeech import text_to_speech_stream

@pytest.fixture
def sample_audio_data():
    return BytesIO(b"fake audio data")

@patch("app.TextToSpeech.client.text_to_speech.convert")
def test_text_to_speech_stream_success(mock_convert):
    mock_convert.return_value = [b"audio chunk 1", b"audio chunk 2"]
    
    with patch("app.TextToSpeech.play_audio") as mock_play_audio:
        text_to_speech_stream("Hello, world!")
        mock_play_audio.assert_called_once() 

@patch("app.TextToSpeech.client.text_to_speech.convert", side_effect=Exception("API error"))
def test_text_to_speech_stream_error(mock_convert):
    with patch("builtins.print") as mock_print:
        text_to_speech_stream("This should trigger an error.")
        mock_print.assert_any_call("Error during TTS conversion: API error")
