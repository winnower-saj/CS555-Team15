import asyncio
import schedule
import random
from text_to_speech import text_to_speech_stream  

# List of reminiscence questions
reminiscence_questions = [
    "What's one of your favorite childhood memories?",
    "What was the most exciting trip you've ever taken?",
    "Who was someone who had a big impact on your life?",
    # Add more questions as needed
]

async def ask_reminiscence_question():
    # Selects a random reminiscence question and plays it using TTS.
    question = random.choice(reminiscence_questions)
    print(f"Question of the day: {question}")
    await asyncio.to_thread(text_to_speech_stream, question)

def schedule_daily_question():
    # Schedules the daily reminiscence question at 11:00 AM."""
    schedule.every().day.at("11:00").do(lambda: asyncio.run_coroutine_threadsafe(
        ask_reminiscence_question(), asyncio.get_event_loop()
    ))

async def scheduler_loop():
    # Runs the scheduler in a loop to check for pending tasks.
    while True:
        schedule.run_pending()
        await asyncio.sleep(60)  # Check every minute if the scheduled time has reached
