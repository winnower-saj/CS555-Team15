import os
import sys
import pytest
from unittest.mock import patch, MagicMock

os.environ['GROQ_API_KEY'] = "test_groq_key"
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.LLM import VoiceAssistantLLM

@pytest.fixture
def voice_assistant():
    return VoiceAssistantLLM()

def test_initialization(voice_assistant):
    assert voice_assistant.llm is not None
    assert voice_assistant.memory is not None
    assert voice_assistant.prompt_template is not None 

@patch("app.LLM.LLMChain.invoke")
def test_generate_response(mock_invoke, voice_assistant):
    user_input = "What’s the weather today?"
    mock_invoke.return_value = {"text": "I don't have access to live weather information."}

    response = voice_assistant.generate_response(user_input)
    assert response == "I don't have access to live weather information."
    mock_invoke.assert_called_once_with({"input_text": user_input})

@patch("app.LLM.LLMChain.invoke")
def test_add_ai_message_to_memory(mock_invoke, voice_assistant):
    user_input = "Tell me a joke."
    ai_response = "Why did the chicken cross the road? To get to the other side!"
    mock_invoke.return_value = {"text": ai_response}

    voice_assistant.generate_response(user_input)
    assert voice_assistant.memory.chat_memory.messages[-1].content == ai_response
