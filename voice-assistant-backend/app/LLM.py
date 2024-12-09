import re
import os
import traceback
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from transformers import pipeline
from mistralai import Mistral
from langchain.schema import HumanMessage, AIMessage
from app.config.db_connection import mongo_instance

load_dotenv()
MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
if not MISTRAL_API_KEY:
    raise ValueError("Missing MISTRAL_API_KEY")

class VoiceAssistantLLM:
    def __init__(self):
        try:
            self.conversations = mongo_instance.conversations
        except Exception as db_error:
            raise
        self.llm_client = Mistral(api_key=MISTRAL_API_KEY)
        self.model_name = "open-mistral-nemo"
        self.emotion_classifier = pipeline("text-classification", model="michellejieli/emotion_text_classifier")

    async def fetch_user_conversation(self, user_id: str):
        try:
            conversation = await self.conversations.find_one({"userId": ObjectId(user_id)})
            messages = []
            if conversation:
                for msg in conversation.get("messages", []):
                    messages.append(HumanMessage(content=msg["userText"]))
                    messages.append(AIMessage(content=msg["assistantText"]))
            return messages
        except Exception as e:
            raise

    async def save_conversation(self, user_id: str, user_text: str, assistant_text: str, emotion: str):
        try:
            message = {
                "userText": user_text,
                "assistantText": assistant_text,
                "emotion": emotion,
            }
            await self.conversations.update_one(
                {"userId": ObjectId(user_id)},
                {
                    "$push": {"messages": message},
                    "$set": {"updatedAt": datetime.now()},
                    "$setOnInsert": {"createdAt": datetime.now()},
                },
                upsert=True,
            )
        except Exception as e:
            raise

    def filter_emojis(self, text: str) -> str:
        return re.sub(r'[^\w\s,.!?]', '', text)

    async def detect_emotion(self, text: str) -> str:
        try:
            result = self.emotion_classifier(text)
            if result and isinstance(result, list):
                return result[0]['label']
            return "neutral"
        except Exception as e:
            return "neutral"

    async def generate_response(self, user_id: str, user_input: str) -> str:
        if not user_input.strip():
            return "I'm sorry, I didn't quite get you, could you please repeat that?"

        try:
            conversation_history = await self.fetch_user_conversation(user_id)
            formatted_history = "\n".join(
                [f"User: {msg.content}" if isinstance(msg, HumanMessage) else f"Assistant: {msg.content}" for msg in conversation_history]
            )
            full_prompt = (
                "You are a voice assistant. Have good conversations with the user and provide companionship. "
                "Dont start response with the word assistant "
                f"Keep your answers short and concise.\nConversation History:\n{formatted_history}\nUser Input: {user_input}"
            )

            response = self.llm_client.chat.complete(
                model=self.model_name,
                messages=[{"role": "user", "content": full_prompt}],
                temperature=0.0
            )
            assistant_response = response.choices[0].message.content.strip()

            if not assistant_response:
                raise ValueError("LLM returned an empty response.")

            assistant_response = self.filter_emojis(assistant_response)
            emotion = await self.detect_emotion(user_input)
            await self.save_conversation(user_id, user_input, assistant_response, emotion)
            return assistant_response

        except Exception as e:
            return "Sorry, something went wrong while generating a response. Please try again later."
