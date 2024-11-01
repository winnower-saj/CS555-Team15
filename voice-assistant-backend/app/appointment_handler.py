import asyncio
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

class AppointmentHandler:
    def __init__(self, text_to_speech_callback, appointments_file: str = "appointments.json"):
        self.text_to_speech_callback = text_to_speech_callback
        self.appointments_file = appointments_file
        self.appointments = [] 
        self.tasks = []      

    def load_appointments(self) -> List[Dict[str, Any]]:
        try:
            with open(self.appointments_file, 'r') as f:
                appointments = json.load(f)
                return appointments
        except FileNotFoundError:
            print(f"Appointments file {self.appointments_file} not found.")
            return []
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return []

    async def schedule_all_appointments(self):
        for appt in self.appointments:
            name = appt.get("name")
            date_str = appt.get("date")  # 'YYYY-MM-DD'
            time_str = appt.get("time")  # 'HH:MM'
            appointment_datetime = self.parse_datetime(date_str, time_str)
            if appointment_datetime:
                reminder_time = appointment_datetime - timedelta(days=1)
                task = asyncio.create_task(self._schedule_appointment(reminder_time, name, appointment_datetime))
                self.tasks.append(task)

    def parse_datetime(self, date_str: str, time_str: str) -> datetime:
        try:
            appointment_datetime = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
            return appointment_datetime
        except ValueError as e:
            print(f"Error parsing date and time '{date_str} {time_str}': {e}")
            return None

    async def _schedule_appointment(self, reminder_time: datetime, name: str, appointment_datetime: datetime):
        now = datetime.now()
        delay = (reminder_time - now).total_seconds()
        if delay <= 0:
            # reminder passed already
            return

        await asyncio.sleep(delay)
        appointment_time_str = appointment_datetime.strftime("%Y-%m-%d %H:%M")
        reminder_message = f"Reminder: You have an appointment '{name}' tomorrow at {appointment_time_str}."
        await self.text_to_speech_callback(reminder_message)
