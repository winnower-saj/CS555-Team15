# **VitaVoice**

**VitaVoice** is a mobile voice assistant designed to empower seniors, providing personalized health support and companionship. By utilizing voice interactions, the application helps users manage their daily routines and stay on top of important activities like medications, appointments, and healthy habits. It also aims to combat loneliness through meaningful conversations, improving overall well-being.

---

## **Features**

-   **Medication Reminders**: Timely, gentle reminders to help users stay on track with their medications.
-   **Appointment Reminders**: Notifications about upcoming medical appointments to help users stay prepared.
-   **Healthy Habits**: Encourages healthy behaviors like walking, checking blood pressure, sugar levels, and sleeping on time.
-   **Companionship**: Engages in conversations to provide emotional support and alleviate loneliness.
-   **Speech Analysis & Emotion Detection**: Analyzes user speech to detect emotional cues like stress or fatigue, offering personalized suggestions.
-   **Health Reports**: Records user interaction data to generate monthly health reports and alerts doctors if needed.

---

## **Architecture**

The system is divided into several major components:

-   **Mobile App (React Native)**: User interface for voice interaction, reminders, and notifications.
-   **Backend (Node.js)**: Manages API requests, connects with the database, and handles business logic.
-   **Database (MongoDB)**: Stores user data such as profiles, reminders, health reports, and interaction history.
-   **AI/ML Module (Python)**: Handles voice interaction processing, emotion detection, and speech-to-text conversions.
-   **Notification Service**: Sends push notifications and alerts for reminders and health updates (via Firebase).

---

## **Branches**

-   **`main`**: Contains the primary version of the project.
-   **`design`**: Includes design components, such as the application UI and UML diagrams.
-   **`mobile-app`**: Houses the code for the mobile application (React Native).
-   **`ai-ml`**: Contains AI/ML-based features, including emotion detection and speech analysis (Python).
-   **`database`**: Code related to database integration (MongoDB).
-   **`backend`**: Contains backend logic for APIs and server-side processing (Node.js).

---

## **Figma Design Link**

You can explore the app design on Figma [here](https://www.figma.com/proto/2bsdyAoSByOQaL1b2L7sXQ/VitaVoice?node-id=154-463&node-type=canvas&t=ncTtDgX0XsY34CTV-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1).

---

## **How to Run**

Follow these steps to set up and run the project:

### **1. Clone the Repository**
```bash
git clone <repository_url>
cd VitaVoice
```
### **2. Set Up the Server**
1. Navigate to the Server directory:
```bash
cd Server
```
2. Create an .env file in this directory and add the following:
```bash
HOST='<YOUR_IP_ADDRESS>'
DEEPGRAM_API_KEY='<Get your key from Deepgram>'
```
3. Install dependencies and start the Node.js server:
```bash
npm install
npm start
```
### 3. Set Up the Voice Assistant Backend
1. Open another terminal and navigate to the backend directory:
```bash
Copy code
cd ../voice-assistant-backend
```
2. Create an .env file in this directory and add the following:
```bash
GROQ_API_KEY='<Get your GROQ key from Groq>'
```
3. Set up a Python virtual environment:

- Linux/MacOS:
```bash
python3 -m venv your_env_name
source your_env_name/bin/activate
```
- Windows:
```bash
python -m venv your_env_name
your_env_name\Scripts\activate
```
4. Install portaudio:
- Linux:
```bash
sudo apt-get install portaudio19-dev
```
- MacOS:
```bash
brew install portaudio
```
- Windows: Download and install from [PortAudio](https://www.portaudio.com/).
5. Install Python dependencies:
```bash
pip install -r requirements.txt
```
6. Start the backend server:
```bash
uvicorn app.api_server:app --reload --host 0.0.0.0 --port 8000
```
## 4. Set Up the React Frontend
1. Open another terminal and navigate to the VitaApp directory:
```bash
cd ../VitaApp
```
2. Navigate to the services folder and update the IP address:
- Open assistantService.ts and dbService.ts:
```typescript
API_URL = '<YOUR_SERVER_IP>'
```
3. Return to the VitaApp directory and start the React frontend:
```bash
npm install
npm start
```

