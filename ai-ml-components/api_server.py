from fastapi import FastAPI, HTTPException, Depends
from fastapi.security.api_key import APIKeyHeader, APIKey
import os
import asyncio
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from reminder_handler import ReminderHandler
from appointment_handler import AppointmentHandler
from TextToSpeech import text_to_speech_stream
from SpeechToText import speech_recognition, pause_microphone, resume_microphone
from LLM import VoiceAssistantLLM
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ** to be changed later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")
API_KEY_NAME = os.getenv("API_KEY_NAME")
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key_header_value: str = Depends(api_key_header)):
    if api_key_header_value == API_KEY:
        return api_key_header_value
    else:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

voice_assistant = VoiceAssistantLLM()
assistant_running = False
assistant_task = None
stop_event = None

async def reminder_text_to_speech(message: str):
    pause_microphone()
    await asyncio.to_thread(text_to_speech_stream, message)
    resume_microphone()

# Initialize ReminderHandler and AppointmentHandler
reminder_handler = ReminderHandler(reminder_text_to_speech, reminders_file="medications.json")
reminder_handler.medications = reminder_handler.load_medications()

appointment_handler = AppointmentHandler(reminder_text_to_speech, appointments_file="appointments.json")
appointment_handler.appointments = appointment_handler.load_appointments()

@app.on_event("startup")
async def startup_event():
    # Schedule medication reminders
    asyncio.create_task(reminder_handler.schedule_all_medications())
    # Schedule appointment reminders
    asyncio.create_task(appointment_handler.schedule_all_appointments())

class ControlRequest(BaseModel):
    action: str  # "start" or "stop"

@app.post("/control")
async def control_assistant(request: ControlRequest, api_key: APIKey = Depends(get_api_key)):
    global assistant_running, assistant_task, stop_event

    if request.action == "start":
        if assistant_running:
            raise HTTPException(status_code=400, detail="Assistant is already running.")

        stop_event = asyncio.Event()

        # Start speech recognition
        assistant_task = asyncio.create_task(listen_for_speech(stop_event))

        assistant_running = True
        return {"status": "Assistant started."}

    elif request.action == "stop":
        if not assistant_running:
            raise HTTPException(status_code=400, detail="Assistant is not running.")

        # Stop the speech recognition
        stop_event.set()

        # Cancel the voice assistant task
        assistant_task.cancel()
        try:
            await assistant_task
        except asyncio.CancelledError:
            pass

        assistant_running = False
        return {"status": "Assistant stopped."}

    else:
        raise HTTPException(status_code=400, detail="Invalid action.")

@app.get("/status")
async def get_status(api_key: APIKey = Depends(get_api_key)):
    return {"status": "running" if assistant_running else "stopped"}

async def listen_for_speech(stop_event):
    async def process_and_convert_to_speech(user_input: str):
        pause_microphone()
        llm_response = voice_assistant.generate_response(user_input)
        await asyncio.to_thread(text_to_speech_stream, llm_response)
        resume_microphone()

    async def speech_recognition_wrapper():
        await speech_recognition(process_and_convert_to_speech)

    try:
        await speech_recognition_wrapper()
    except asyncio.CancelledError:
        print("Speech recognition cancelled.")
    except Exception as e:
        print(f"Error in speech recognition: {e}")

if __name__ == "__main__":
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=True)
