import os
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import asyncio
from dotenv import load_dotenv
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

class MongoDB:
    def __init__(self):
        self.client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
        self.db = self.client["VitaVoiceHealth"]
        self.conversations = self.db["conversationsTest2"]

    def get_collection(self, collection_name):
        return self.db[collection_name]

mongo_instance = MongoDB()

async def fetch_weekly_emotions():
    conversations_collection = mongo_instance.conversations
    user_id = os.getenv("USER_ID")
    one_week_ago = datetime.now() - timedelta(days=7)
    query = {"userId": ObjectId(user_id), "createdAt": {"$gte": one_week_ago}}
    projection = {"messages.emotion": 1}
    conversation = await conversations_collection.find_one(query, projection)
    emotions = {}
    if conversation and "messages" in conversation:
        for message in conversation["messages"]:
            emotion = message.get("emotion", "neutral")
            emotions[emotion] = emotions.get(emotion, 0) + 1
    return emotions

def plot_emotions(emotions):
    emotion_colors = {
        'anger': 'red',
        'disgust': 'green',
        'fear': 'purple',
        'joy': 'yellow',
        'neutral': 'gray',
        'sadness': 'blue',
        'surprise': 'orange'
    }
    all_emotions = ['anger', 'disgust', 'fear', 'joy', 'neutral', 'sadness', 'surprise']
    emotions_with_defaults = {emotion: emotions.get(emotion, 0) for emotion in all_emotions}
    labels = [emotion for emotion, count in emotions_with_defaults.items() if count > 0]
    values = [count for count in emotions_with_defaults.values() if count > 0]
    colors = [emotion_colors[emotion] for emotion in labels]
    if not values:
        return
    plt.figure(figsize=(8, 6))
    wedges, texts, autotexts = plt.pie(
        values, labels=labels, autopct='%1.1f%%', startangle=140,
        colors=colors, textprops={'fontsize': 12}
    )
    plt.setp(autotexts, size=10, weight="bold")
    plt.title("User's Emotional Distribution", fontsize=14, weight="bold")
    plt.show()

async def main():
    emotions = await fetch_weekly_emotions()
    plot_emotions(emotions)

if __name__ == "__main__":
    asyncio.run(main())
