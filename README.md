# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

    ```bash
    npm install
    ```

2. Start the app

    ```bash
     npx expo start
    ```

In the output, you'll find options to open the app in a

-   [development build](https://docs.expo.dev/develop/development-builds/introduction/)
-   [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
-   [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
-   [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

-   [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
-   [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

-   [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
-   [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

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
