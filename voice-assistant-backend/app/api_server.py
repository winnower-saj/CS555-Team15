from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from app.LLM import VoiceAssistantLLM
from app.reminders.medication_reminders import MedicationReminder
from app.reminders.appointment_reminders import AppointmentReminder
from app.config.db_connection import mongo_instance
from bson import ObjectId
from datetime import datetime, timedelta

app = FastAPI()
llm = VoiceAssistantLLM()
medication_reminder = MedicationReminder()
appointment_reminder = AppointmentReminder()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptionRequest(BaseModel):
    userId: str
    text: str

@app.post("/process")
async def process_transcription(request: TranscriptionRequest):
    try:
        # Log the incoming request (optional logging setup)
        # logger.info(f"Received request: {request.dict()}")

        # Generate response from LLM
        llm_response = await llm.generate_response(request.userId, request.text)

        if llm_response:
            return {"responseText": llm_response}
        else:
            raise HTTPException(status_code=500, detail="LLM failed to generate a response.")
    except Exception as e:
        # Log the error (optional logging setup)
        # logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.on_event("startup")
async def startup_event():
    # Schedule medication reminders
    asyncio.create_task(medication_reminder.start_reminders())

    # Schedule appointment reminders
    asyncio.create_task(appointment_reminder.start_reminders())

# Root Endpoint Check
@app.get("/")
async def root():
    return {"message": "API Server with LLM and Reminders is running."}

@app.get("/get-reminders/{userId}")
async def get_reminders(userId: str):
    try:
        now = datetime.now()
        today = now.date()
        current_time_str = now.strftime("%I:%M %p")  # 12-hour formatting
        tomorrow = today + timedelta(days=1)

        appointments = mongo_instance.get_collection("appointments")
        medications = mongo_instance.get_collection("medications")

        appointment_reminders = []
        async for appointment in appointments.find({"userId": ObjectId(userId)}):
            appointment_date = appointment["date"].date()
            if appointment_date == tomorrow and appointment["time"] == current_time_str:
                reminder_text = (
                    f"Reminder for your appointment: {appointment['title']} - {appointment['details']} "
                    f"on {appointment_date.strftime('%Y-%m-%d')} at {appointment['time']}."
                )
                appointment_reminders.append({"assistantText": reminder_text, "userText": "", "emotion": "neutral"})

        medication_reminders = []
        async for medication in medications.find({"userId": ObjectId(userId)}):
            if medication["time"] == current_time_str:
                reminder_text = (
                    f"Reminder to take your medication: {medication['name']} - {medication['details']} at {medication['time']}."
                )
                medication_reminders.append({"assistantText": reminder_text, "userText": "", "emotion": "neutral"})

        return {"reminders": appointment_reminders + medication_reminders}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

