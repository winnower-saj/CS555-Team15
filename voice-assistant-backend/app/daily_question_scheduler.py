import asyncio
import random
from datetime import datetime
from bson import ObjectId
from app.LLM import VoiceAssistantLLM
from app.config.db_connection import mongo_instance

class ReminiscentQuestionScheduler:
    def __init__(self, llm=None):
        self.llm = llm if llm else VoiceAssistantLLM()
        self.conversations = mongo_instance.get_collection("conversations")
        self.reminiscent_questions = [
            "Would you share a favorite childhood memory that always brings a smile to your face?",
            "Could you tell me about a moment in your life that changed your perspective or shaped who you are?",
            "What is a time in your life when you felt especially proud of yourself? I’d love to hear about it.",
            "Could you share a story about a friendship that has had a meaningful impact on your life?",
            "Is there a place that holds special memories for you? I'd love to know why it’s so dear to you.",
            "What’s a valuable lesson you’ve learned from an experience in your past?",
            "Would you mind telling me about a challenge you faced and how you managed to overcome it?",
            "Do you have a cherished family tradition or memory that you’d like to share?",
            "Could you recall a time when someone’s kindness truly touched you? It would be wonderful to hear about it.",
            "Is there a skill or hobby you wish you had pursued earlier in life? What drew you to it?"
        ]
        self.last_asked_question = None

    async def ask_reminiscent_question(self, user_id):
        while True:
            question = random.choice(self.reminiscent_questions)
            if question != self.last_asked_question:
                self.last_asked_question = question
                break

        try:
            await self.conversations.update_one(
                {"userId": ObjectId(user_id)},
                {
                    "$push": {
                        "messages": {
                            "assistantText": question,
                            "userText": "",
                            "emotion": "neutral"
                        }
                    },
                    "$set": {"updatedAt": datetime.now()},
                    "$setOnInsert": {"createdAt": datetime.now()},
                },
                upsert=True
            )
            return {"question": question}
        except Exception as e:
            return None
