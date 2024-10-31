from fastapi import FastAPI, HTTPException, Depends
from fastapi.security.api_key import APIKeyHeader, APIKey
import os
import asyncio
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from app.reminder_handler import ReminderHandler
from app.appointment_handler import AppointmentHandler
from app.TextToSpeech import text_to_speech_stream
from app.SpeechToText import speech_recognition, pause_microphone, resume_microphone
from app.LLM import VoiceAssistantLLM
from dotenv import load_dotenv
from pydantic import BaseModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ** Change this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")
API_KEY_NAME = os.getenv("API_KEY_NAME", "api_key")
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key_header_value: str = Depends(api_key_header)):
    if api_key_header_value == API_KEY:
        return api_key_header_value
    else:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

class AssistantManager:
    def __init__(self):
        self.voice_assistant = VoiceAssistantLLM()
        self.assistant_running = False
        self.assistant_task = None
        self.stop_event = asyncio.Event()

    async def start_assistant(self):
        if self.assistant_running:
            raise RuntimeError("Assistant is already running.")

        self.stop_event.clear()
        self.assistant_task = asyncio.create_task(self.listen_for_speech())
        self.assistant_running = True
        logger.info("Assistant started.")

    async def stop_assistant(self):
        if not self.assistant_running:
            raise RuntimeError("Assistant is not running.")

        self.stop_event.set()
        if self.assistant_task:
            await self.assistant_task
        self.assistant_running = False
        logger.info("Assistant stopped.")

    async def listen_for_speech(self):
        async def process_and_convert_to_speech(user_input: str):
            pause_microphone()
            llm_response = self.voice_assistant.generate_response(user_input)
            await asyncio.to_thread(text_to_speech_stream, llm_response)
            resume_microphone()

        try:
            await speech_recognition(process_and_convert_to_speech, self.stop_event)
        except asyncio.CancelledError:
            logger.info("Speech recognition task was cancelled.")
        except Exception as e:
            logger.error(f"Error in speech recognition: {e}")

    async def reminder_text_to_speech(self, message: str):
        try:
            logger.info("Sending reminder.")
            pause_microphone()
            await asyncio.to_thread(text_to_speech_stream, message)
        except Exception as e:
            logger.error(f"Error during reminder: {e}")
        finally:
            if self.assistant_running:
                logger.info("Resuming microphone after reminder.")
                resume_microphone()
            else:
                logger.info("Assistant is not running. Microphone remains paused after reminder.")

assistant_manager = AssistantManager()

REMINDERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "medications.json")
APPOINTMENTS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "appointments.json")

reminder_handler = ReminderHandler(assistant_manager.reminder_text_to_speech, reminders_file=REMINDERS_FILE)
reminder_handler.medications = reminder_handler.load_medications()

appointment_handler = AppointmentHandler(assistant_manager.reminder_text_to_speech, appointments_file=APPOINTMENTS_FILE)
appointment_handler.appointments = appointment_handler.load_appointments()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(reminder_handler.schedule_all_medications())
    asyncio.create_task(appointment_handler.schedule_all_appointments())
    logger.info("Scheduled all reminders and appointments.")

class ControlRequest(BaseModel):
    action: str  # "start" or "stop"

@app.post("/control")
async def control_assistant(request: ControlRequest, api_key: APIKey = Depends(get_api_key)):
    if request.action == "start":
        if assistant_manager.assistant_running:
            raise HTTPException(status_code=400, detail="Assistant is already running.")
        try:
            await assistant_manager.start_assistant()
            return {"status": "Assistant started."}
        except Exception as e:
            logger.error(f"Failed to start assistant: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    elif request.action == "stop":
        if not assistant_manager.assistant_running:
            raise HTTPException(status_code=400, detail="Assistant is not running.")
        try:
            await assistant_manager.stop_assistant()
            return {"status": "Assistant stopped."}
        except Exception as e:
            logger.error(f"Failed to stop assistant: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    else:
        raise HTTPException(status_code=400, detail="Invalid action.")

@app.get("/status")
async def get_status(api_key: APIKey = Depends(get_api_key)):
    status = "running" if assistant_manager.assistant_running else "stopped"
    return {"status": status}

if __name__ == "__main__":
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=True)
