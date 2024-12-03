import threading
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
from app.daily_question_schedular import ReminiscentQuestionScheduler


app = FastAPI()
llm = VoiceAssistantLLM()
medication_reminder = MedicationReminder()
appointment_reminder = AppointmentReminder()


app = FastAPI()
llm = VoiceAssistantLLM()
medication_reminder = MedicationReminder()
appointment_reminder = AppointmentReminder()
reminiscent_scheduler = ReminiscentQuestionScheduler(llm)
def start_scheduler():
    # Background thread to run the scheduler
    reminiscent_scheduler.start_scheduler()
# Start scheduler in a background thread
scheduler_thread = threading.Thread(target=start_scheduler, daemon=True)
scheduler_thread.start()


# Configure CORS Middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create global scheduler instance
reminiscent_scheduler = ReminiscentQuestionScheduler(llm)
def start_scheduler():
    # Background thread to run the scheduler
    reminiscent_scheduler.start_scheduler()
# Start scheduler in a background thread
scheduler_thread = threading.Thread(target=start_scheduler, daemon=True)
scheduler_thread.start()



class TranscriptionRequest(BaseModel):
    userId: str
    text: str


async def get_api_key(api_key_header_value: str = Depends(api_key_header)):
    if api_key_header_value == API_KEY:
        return api_key_header_value
    else:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

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



@app.get("/reminiscent-question")
async def get_reminiscent_question():
    # Endpoint to manually trigger or retrieve the reminiscent question
    result = reminiscent_scheduler.ask_reminiscent_question()
    if result:
        return result
    else:
        raise HTTPException(status_code=500, detail="Failed to generate reminiscent question")

@app.get("/reminiscent-questions")
async def list_reminiscent_questions():
    # Endpoint to list available reminiscent questions
    return {"questions": reminiscent_scheduler.reminiscent_questions}

@app.post("/reminiscent-questions")
async def add_reminiscent_question(question: TranscriptionRequest):
    # Endpoint to add a new reminiscent question
    if question.text and question.text not in reminiscent_scheduler.reminiscent_questions:
        reminiscent_scheduler.reminiscent_questions.append(question.text)
        return {"message": "Question added successfully", "questions": reminiscent_scheduler.reminiscent_questions}
    else:
        raise HTTPException(status_code=500, detail="Failed to ask reminiscent question")