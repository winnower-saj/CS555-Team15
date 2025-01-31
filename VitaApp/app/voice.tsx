import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Alert,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
import {
	clearConversation,
	fetchTranscripts,
	fetchReminders,
	fetchQuestion,
} from '../services/assistantService';
import { getUserSession } from '../services/authService';
import {
	incrementConversation,
	incrementMedication,
} from '../services/dbService';
import { playWordAssocGame, playMemoryCardGame } from './games';
import { Colors } from '../constants/Colors';
import { useTTS } from '../context/ttsContext';

const ELEVEN_LABS_API_KEY =
	'sk_dfa379001439f6facf1d01e0ba2acc629c8084c00804ee01';
// 'sk_0077d1721ef2a3594d73e1bb7bf910c6f3e036172166b78d';
const ELEVEN_LABS_VOICE_ID = 'cgSgspJ2msm6clMCkdW9';

export default function AudioMessageComponent() {
	const [recording, setRecording] = useState(null);
	const [transcription, setTranscription] = useState('');
	const [responseText, setResponseText] = useState('');
	const [lastReminderTimestamp, setLastReminderTimestamp] = useState(null);
	const [lastFetchedDate, setLastFetchedDate] = useState(null);
	const recordingRef = useRef(null);
	const targetTime = '18:53';
	// const [isTTSActive, setIsTTSActive] = useState(false);
	const { playTTS, isTTSActive } = useTTS();

	useEffect(() => {
		const interval = setInterval(() => {
			// checkForReminders();
			checkAndFetchQuestion();
		}, 60000); // Check every minute

		return () => clearInterval(interval);
	}, [lastReminderTimestamp]);

	const startRecording = async () => {
		console.log('Requesting microphone permissions...');
		try {
			const { status } = await Audio.requestPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permission to access microphone is required!');
				return;
			}
			console.log('Microphone permissions granted.');

			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});

			const { recording } = await Audio.Recording.createAsync(
				Audio.RecordingOptionsPresets.HIGH_QUALITY
			);
			recordingRef.current = recording;
			setRecording(recording);
			console.log('Recording started.');
		} catch (error) {
			console.error('Failed to start recording', error);
		}
	};

	const stopRecording = async () => {
		console.log('Stopping recording...');
		try {
			await recordingRef.current.stopAndUnloadAsync();
			const uri = recordingRef.current.getURI();
			console.log(`Recording stopped. File saved at: ${uri}`);
			setRecording(null);
			await uploadAudio(uri);
		} catch (error) {
			console.error('Failed to stop recording', error);
		}
	};

	const uploadAudio = async (uri) => {
		console.log('Preparing to upload audio...');
		try {
			const userId = await fetchUserId();
			const formData = new FormData();
			formData.append('file', {
				uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
				name: 'audiofile.m4a',
				type: 'audio/m4a',
			});

			console.log('Uploading audio to server...');
			const response = await clearConversation(formData);

			if (response.ok) {
				console.log('Audio uploaded successfully.');
				const result = await response.json();
				console.log(`Received transcription: ${result.transcription}`);
				setTranscription(result.transcription);
				await processTranscription(result.transcription);
				const conversationInc = await incrementConversation(userId);
			} else {
				console.error(
					'Failed to upload audio. Server responded with:',
					response.status
				);
				Alert.alert('Error', 'Failed to upload audio');
			}
		} catch (error) {
			console.error('Error uploading audio file:', error);
			Alert.alert('Error', 'Failed to upload audio');
		}
	};

	const handleCommand = async (command) => {
		console.log('Processing command:', command);
		let response = '';
		if (command.includes('word association')) {
			response = playWordAssocGame();
		} else if (command.includes('memory card')) {
			response = playMemoryCardGame();
		} else {
			response =
				"Sorry, I didn't understand. Please say 'Word Association' or 'Memory Card'.";
		}
		setResponseText(response); // Update UI
		if (!isTTSActive) {
			await playTTS(response); // Speak the response
		}
	};

	const fetchUserId = async () => {
		try {
			const session = await getUserSession();
			if (session && session.userId) {
				console.log('User ID:', session.userId);
				return session.userId;
			} else {
				console.error('No user session found');
				return null;
			}
		} catch (e) {
			console.error('Error fetching user session:', e);
			return null;
		}
	};

	const processTranscription = async (transcribedText) => {
		console.log('Sending transcription to EC2 backend...');
		try {
			const userId = await fetchUserId();
			console.log('Current User ID:', userId);
			const response = await fetchTranscripts(userId, transcribedText);
			if (response.ok) {
				const data = await response.json();
				console.log(
					`Received response from EC2 backend: ${data.responseText}`
				);
				if (
					transcribedText.includes('word association') ||
					transcribedText.includes('memory card')
				) {
					// await handleCommand(transcribedText);
				}
				setResponseText(data.responseText);
				if (!isTTSActive) {
					await playTTS(data.responseText);
				}
			} else {
				console.error(
					'Failed to process transcription. Backend responded with:',
					response.status
				);
				Alert.alert('Error', 'Failed to process transcription');
			}
		} catch (error) {
			console.error('Error processing transcription:', error);
			Alert.alert('Error', 'Failed to process transcription');
		}
	};

	// const playTTS = async (text) => {
	// 	if (!isTTSActive) {
	// 		setIsTTSActive(true);
	// 		try {
	// 			console.log('Starting TTS using expo-speech...');
	// 			Speech.speak(text, {
	// 				onDone: () => setIsTTSActive(false),
	// 				onStopped: () => setIsTTSActive(false),
	// 				onError: (error) => {
	// 					console.error('TTS Error:', error);
	// 					setIsTTSActive(false);
	// 				},
	// 			});
	// 		} catch (error) {
	// 			console.error('Error with TTS:', error);
	// 			setIsTTSActive(false);
	// 		}
	// 	}
	// };

	const checkForReminders = async () => {
		try {
			const userId = await fetchUserId();
			if (!userId) {
				console.error('Cannot fetch reminders without user ID');
				return;
			}

			console.log('Fetching reminders for user:', userId);
			const response = await fetchReminders(userId);
			if (response.ok) {
				const data = await response.json();
				console.log('Fetched reminders:', data.reminders);
				if (data.reminders.length !== 0) {
					await incrementMedication(userId);
				}

				for (const reminder of data.reminders) {
					if (!isTTSActive) {
						await playTTS(reminder.assistantText);
					}
				}
			} else {
				console.error(
					'Failed to fetch reminders. Server responded with:',
					response.status
				);
			}
		} catch (error) {
			console.error('Error fetching reminders:', error);
		}
	};

	const checkAndFetchQuestion = async () => {
		const now = new Date();
		const currentTime = `${String(now.getHours()).padStart(
			2,
			'0'
		)}:${String(now.getMinutes()).padStart(2, '0')}`;
		const today = now.toDateString();

		if (currentTime === targetTime && lastFetchedDate !== today) {
			console.log('Target time reached. Fetching question...');
			const userId = await fetchUserId();
			if (userId) {
				await fetchQuestionForUser(userId);
				setLastFetchedDate(today);
			}
		}
	};

	const fetchQuestionForUser = async (userId) => {
		try {
			const response = await fetchQuestion(userId);
			if (response.ok) {
				const data = await response.json();
				console.log('Fetched question:', data.question);

				if (!isTTSActive) {
					await playTTS(data.question);
				}
			} else {
				console.error(
					'Failed to fetch question. Server responded with:',
					response.status
				);
			}
		} catch (error) {
			console.error('Error fetching question:', error);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				testID='assistant-button'
				style={styles.assistant}
				onPress={recording ? stopRecording : startRecording}
			>
				<Image
					source={require('../assets/images/logo-white.png')}
					style={styles.assistantIcon}
				/>
			</TouchableOpacity>
			{/* {transcription ? (
				<Text style={styles.transcription}>
					Transcription: {transcription}
				</Text>
			) : null}
			{responseText ? (
				<Text style={styles.responseText}>
					Response: {responseText}
				</Text>
			) : null} */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	transcription: {
		marginTop: 20,
		fontSize: 16,
		color: 'black',
	},
	responseText: {
		marginTop: 20,
		fontSize: 16,
		color: 'blue',
	},
	assistant: {
		width: 150,
		height: 150,
		borderRadius: 75,
		backgroundColor: Colors.blue.dark,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 10,
	},
	assistantIcon: {
		width: 80,
		height: 80,
		tintColor: '#ffffff',
	},
});
