import os
import time
import asyncio
from bson import ObjectId
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.schema import HumanMessage, AIMessage
from langchain_groq import ChatGroq
import tkinter as tk
from tkinter import scrolledtext

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")

if not GROQ_API_KEY or not MONGODB_URI:
    exit(1)

class MongoDB:
    def __init__(self):
        try:
            self.client = AsyncIOMotorClient(MONGODB_URI, tls=True,tlsAllowInvalidCertificates=True)
            self.db = self.client["VitaVoiceHealth"]
            self.conversations = self.db["conversations"]
        except Exception as e:
            exit(1)

mongo_instance = MongoDB()

class LanguageModelProcessor:
    def __init__(self):
        self.llm = ChatGroq(temperature=0, model_name="mixtral-8x7b-32768", groq_api_key=GROQ_API_KEY)
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        system_prompt = (
            "You are an expert in analyzing user conversations. Generate a detailed report summarizing the user's emotional state, "
            "general themes in their conversations, and recurring topics or concerns. This report should be descriptive, objective, "
            "and strictly based on the content of the conversations, without providing any recommendations, advice, or actionable suggestions."
        )
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            HumanMessagePromptTemplate.from_template("{text}")
        ])
        self.conversation = LLMChain(
            llm=self.llm,
            prompt=self.prompt,
            memory=self.memory
        )

    def process(self, text):
        self.memory.chat_memory.add_user_message(text)
        response = self.conversation.invoke({"text": text})
        self.memory.chat_memory.add_ai_message(response["text"])
        return response["text"]

class ConversationSummarizer:
    def __init__(self):
        self.conversations = mongo_instance.conversations
        self.processor = LanguageModelProcessor()

    async def fetch_user_conversation(self, user_id: str):
        try:
            conversation = await self.conversations.find_one({"userId": ObjectId(user_id)})
            if not conversation or "messages" not in conversation:
                return []
            return [HumanMessage(content=msg.get("userText", "")) for msg in conversation["messages"]]
        except Exception:
            return []

    async def summarize_conversation(self, user_id: str):
        conversation_history = await self.fetch_user_conversation(user_id)
        if not conversation_history:
            return "No conversation data available for summarization."
        for message in conversation_history:
            self.processor.memory.chat_memory.add_user_message(message.content)
        return self.processor.process("Summarize the user's conversation.")

def display_summary(summary):
    # This prevents macOS quirks
    if not hasattr(tk, "_default_root"):
        tk._default_root = tk.Tk()
        tk._default_root.withdraw()

    window = tk.Tk()
    window.title("Conversation Summary")
    text_area = scrolledtext.ScrolledText(window, wrap=tk.WORD, width=80, height=20)
    text_area.insert(tk.INSERT, summary)
    text_area.configure(state="disabled")
    text_area.pack(padx=10, pady=10)
    window.mainloop()

async def main():
    user_id = os.getenv("USER_ID")
    summarizer = ConversationSummarizer()
    summary = await summarizer.summarize_conversation(user_id)
    display_summary(summary)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except RuntimeError:
        pass
