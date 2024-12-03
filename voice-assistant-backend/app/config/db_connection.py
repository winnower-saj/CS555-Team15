import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    def __init__(self):
        self.client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
        self.db = self.client["VitaVoiceHealth"]  # MongoDB database
        self.conversations = self.db["conversationsTest2"]  # MongoDB collection
        self.medications = self.db["medications"]  # Medications collection
        self.appointments = self.db["appointments"]  # Appointments collection

    def get_collection(self, collection_name):
        return self.db[collection_name]

mongo_instance = MongoDB() # Singleton instance
