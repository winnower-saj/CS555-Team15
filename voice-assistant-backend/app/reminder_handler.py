import asyncio
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

class ReminderHandler:
    def __init__(self, text_to_speech_callback, reminders_file: str = "medications.json"):
        self.text_to_speech_callback = text_to_speech_callback
        self.reminders_file = reminders_file
        self.medications = [] 
        self.tasks = []   

    def load_medications(self) -> List[Dict[str, Any]]:
        try:
            with open(self.reminders_file, 'r') as f:
                medications = json.load(f)
                return medications
        except FileNotFoundError:
            print(f"Medications file {self.reminders_file} not found.")
            return []
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return []

    async def schedule_all_medications(self):
        for med in self.medications:
            name = med.get("name")
            time_str = med.get("time")
            reminder_time = self.parse_time(time_str)
            if reminder_time:
                task = asyncio.create_task(self._schedule_medication(reminder_time, name))
                self.tasks.append(task)

    def parse_time(self, time_str: str) -> datetime:
        try:
            now = datetime.now()
            reminder_time = datetime.strptime(time_str, "%H:%M").replace(
                year=now.year,
                month=now.month,
                day=now.day
            )
            if reminder_time < now:
                # medication reminder passed already
                reminder_time += timedelta(days=1)
            return reminder_time
        except ValueError as e:
            print(f"Error parsing time '{time_str}': {e}")
            return None

    async def _schedule_medication(self, reminder_time: datetime, name: str):
        while True:
            now = datetime.now()
            delay = (reminder_time - now).total_seconds()
            if delay < 0:
                reminder_time += timedelta(days=1)
                delay = (reminder_time - now).total_seconds()

            await asyncio.sleep(delay)
            reminder_message = f"Time to take your {name}."
            await self.text_to_speech_callback(reminder_message)

            reminder_time += timedelta(days=1)
