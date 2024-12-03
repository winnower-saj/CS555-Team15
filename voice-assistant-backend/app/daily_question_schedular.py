import schedule
import time
import random
from datetime import datetime
from app.LLM import VoiceAssistantLLM

class ReminiscentQuestionScheduler:
    def __init__(self, llm=None):
        # Initialize the scheduler with optional LLM instance
        self.llm = llm if llm else VoiceAssistantLLM()
        self.reminiscent_questions = [
            "What's a childhood memory that always makes you smile?",
            "Can you recall a moment that changed your perspective on life?",
            "Tell me about a time when you felt truly proud of yourself.",
            "What's a friendship that has deeply impacted your life?",
            "Describe a place that holds special memories for you.",
            "What's a lesson you learned from a past experience?",
            "Recall a moment when you overcame a significant challenge.",
            "What's a cherished family tradition you remember?",
            "Tell me about a time when someone's kindness surprised you.",
            "What's a skill or hobby you wish you had pursued earlier?"
        ]
        self.last_asked_question = None

    def ask_reminiscent_question(self, user_id='system'):
    # Randomly select a question, ensuring it's different from the last one
        while True:
            question = random.choice(self.reminiscent_questions)
            if question != self.last_asked_question:
                self.last_asked_question = question
                break
        
        # Process the question through the LLM
        try:
            print(f"[{datetime.now()}] Asking reminiscent question: {question}")
            # Pass both user_input and user_id
            llm_response = self.llm.generate_response(user_input=question, user_id='system')
            return {
                "timestamp": datetime.now().isoformat(),
                "question": question,
                "response": llm_response
            }
        except Exception as e:
            print(f"Error processing reminiscent question: {e}")
        return None

    def start_scheduler(self, time_str="11:00"):
        print(f"Reminiscent Question Scheduler started. Will ask question daily at {time_str}")
        schedule.every().day.at(time_str).do(self.ask_reminiscent_question)
        
        # Run the scheduler
        while True:
            schedule.run_pending()
            time.sleep(1)

def run_scheduler(time_str="11:00"):
    scheduler = ReminiscentQuestionScheduler()
    scheduler.start_scheduler(time_str)