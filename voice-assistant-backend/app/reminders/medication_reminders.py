import asyncio
from datetime import datetime
from bson import ObjectId
from ..config.db_connection import mongo_instance

class MedicationReminder:
    def __init__(self):
        self.medications = mongo_instance.get_collection("medications")
        self.conversations = mongo_instance.get_collection("conversations")

    async def fetch_medications(self):
        now = datetime.now()
        medications = self.medications.find({})
        async for medication in medications:
            med_time = datetime.strptime(medication["time"], "%I:%M %p").replace(
                year=now.year, month=now.month, day=now.day
            )
            if med_time > now:
                delay = (med_time - now).total_seconds()
                asyncio.create_task(self.delayed_task(delay, medication))

    async def delayed_task(self, delay, medication):
        await asyncio.sleep(delay)
        await self.send_reminder(medication)

    async def send_reminder(self, medication):
        reminder_text = f"Friendly reminder: It's time for your {medication['name']}! - Please take a {medication['details']}. Stay healthy!"
        await self.conversations.update_one(
            {"userId": ObjectId(medication["userId"])},
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
        print(f"Medication reminder sent: {reminder_text}")

    async def start_reminders(self):
        await self.fetch_medications()
