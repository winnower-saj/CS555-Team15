import asyncio
from datetime import datetime, timedelta
from bson import ObjectId
from ..config.db_connection import mongo_instance

class AppointmentReminder:
    def __init__(self):
        self.appointments = mongo_instance.get_collection("appointments")
        self.conversations = mongo_instance.get_collection("conversations")

    async def fetch_appointments(self):
        now = datetime.now()
        appointments = self.appointments.find({})
        async for appointment in appointments:
            appointment_date = appointment["date"]
            reminder_time = datetime.combine(appointment_date, datetime.min.time()) - timedelta(days=1)

            if reminder_time > now:
                delay = (reminder_time - now).total_seconds()
                asyncio.create_task(self.delayed_task(delay, appointment))

    async def delayed_task(self, delay, appointment):
        await asyncio.sleep(delay)
        await self.send_reminder(appointment)

    async def send_reminder(self, appointment):
        reminder_text = (
            f"Friendly reminder: You have a '{appointment['title']}' coming up! Take care and see you soon!"
        )
        await self.conversations.update_one(
            {"userId": ObjectId(appointment["userId"])},
            {
                "$push": {"messages": {
                    "assistantText": reminder_text,
                    "userText": "",
                    "emotion": "neutral"
                }},
                "$set": {"updatedAt": datetime.now()},
                "$setOnInsert": {"createdAt": datetime.now()}
            },
            upsert=True
        )
        print(f"Appointment reminder sent: {reminder_text}")

    async def start_reminders(self):
        await self.fetch_appointments()
