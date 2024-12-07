from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from app.LLM import VoiceAssistantLLM
from app.reminders.medication_reminders import MedicationReminder
from app.reminders.appointment_reminders import AppointmentReminder
from app.daily_question_scheduler import ReminiscentQuestionScheduler
from app.config.db_connection import mongo_instance
from bson import ObjectId
from datetime import datetime, timedelta

app = FastAPI()

llm = VoiceAssistantLLM()
medication_reminder = MedicationReminder()
appointment_reminder = AppointmentReminder()
reminiscent_scheduler = ReminiscentQuestionScheduler(llm)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(medication_reminder.start_reminders())
    asyncio.create_task(appointment_reminder.start_reminders())

class TranscriptionRequest(BaseModel):
    userId: str
    text: str

@app.post("/process")
async def process_transcription(request: TranscriptionRequest):
    try:
        llm_response = await llm.generate_response(request.userId, request.text)
        if llm_response:
            return {"responseText": llm_response}
        else:
            raise HTTPException(status_code=500, detail="LLM failed to generate a response.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# Root Endpoint Check
@app.get("/")
async def root():
    return {"message": "API Server with LLM and Reminders is running."}


@app.get("/get-reminders/{userId}")
async def get_reminders(userId: str):
    try:
        try:
            user_id_obj = ObjectId(userId)
        except InvalidId:
            raise HTTPException(status_code=400, detail="Invalid userId format")

        now = datetime.now()
        today = now.date()
        current_time_str = now.strftime("%I:%M %p")  # 12-hour formatting
        tomorrow = today + timedelta(days=1)

        appointments = mongo_instance.get_collection("appointments")
        medications = mongo_instance.get_collection("medications")

        appointment_reminders = []
        async for appointment in appointments.find({"userId": user_id_obj}):
            appointment_time = appointment.get("time")  # ISO format datetime
            if not appointment_time:
                print(f"Skipping appointment without 'time': {appointment}")
                continue 

            if tomorrow == appointment_time.date() and appointment_time.hour == now.hour and appointment_time.minute == now.minute:
                reminder_text = (
                    f"Reminder for your appointment: {appointment['title']} - {appointment['details']} "
                    f"on {appointment_time.strftime('%Y-%m-%d')} at {appointment_time.strftime('%I:%M %p')}."
                )
                appointment_reminders.append({"assistantText": reminder_text, "userText": "", "emotion": "neutral"})

        medication_reminders = []
        async for medication in medications.find({"userId": user_id_obj}):
            if medication["time"] == current_time_str:
                reminder_text = (
                    f"Reminder to take your medication: {medication['name']} - {medication['details']} at {medication['time']}."
                )
                medication_reminders.append({"assistantText": reminder_text, "userText": "", "emotion": "neutral"})

        return {"reminders": appointment_reminders + medication_reminders}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    

@app.get("/reminiscent-question/{userId}")
async def get_reminiscent_question(userId: str):
    try:
        result = await reminiscent_scheduler.ask_reminiscent_question(user_id=userId)
        if result:
            return result
        else:
            raise HTTPException(status_code=500, detail="Failed to generate reminiscent question")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/reminiscent-questions")
async def list_reminiscent_questions():
    return {"questions": reminiscent_scheduler.reminiscent_questions}

@app.post("/reminiscent-questions")
async def add_reminiscent_question(question: BaseModel):
    if question.text and question.text not in reminiscent_scheduler.reminiscent_questions:
        reminiscent_scheduler.reminiscent_questions.append(question.text)
        return {"message": "Question added successfully", "questions": reminiscent_scheduler.reminiscent_questions}
    else:
        raise HTTPException(status_code=400, detail="Question already exists or invalid input")
