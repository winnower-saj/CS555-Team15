import React, { useState, useRef } from 'react';
import {
	View,
	Alert,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
} from 'react-native';
// import { Audio } from 'expo-av';
// import * as FileSystem from 'expo-file-system';
// import { Buffer } from 'buffer';
// global.Buffer = Buffer;
import {
	clearConversation,
	fetchTranscripts,
} from '../services/assistantService';

const ELEVEN_LABS_API_KEY =
	'sk_7215e9640df21cd3771dd1922cd9686d8a5e389d6349f9df';
const ELEVEN_LABS_VOICE_ID = 'pMsXgVXv3BLzUgSXRplE';

export default function AudioMessageComponent() {
	const [recording, setRecording] = useState(null);
	const [transcription, setTranscription] = useState('');
	const [responseText, setResponseText] = useState('');
	const recordingRef = useRef(null);

	const startRecording = async () => {
		console.log('Requesting microphone permissions...');
		try {
			// const { status } = await Audio.requestPermissionsAsync();
			// if (status !== 'granted') {
			// 	Alert.alert('Permission to access microphone is required!');
			// 	return;
			// }
			// console.log('Microphone permissions granted.');

			// await Audio.setAudioModeAsync({
			// 	allowsRecordingIOS: true,
			// 	playsInSilentModeIOS: true,
			// });

			// const { recording } = await Audio.Recording.createAsync(
			// 	Audio.RecordingOptionsPresets.HIGH_QUALITY
			// );
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
			const formData = new FormData();
			// formData.append('file', {
			// 	uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
			// 	name: 'audiofile.m4a',
			// 	type: 'audio/m4a',
			// });

			console.log('Uploading audio to server...');
			const response = await clearConversation(formData);

			if (response.ok) {
				console.log('Audio uploaded successfully.');
				const result = await response.json();
				console.log(`Received transcription: ${result.transcription}`);
				setTranscription(result.transcription);
				await processTranscription(result.transcription);
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

	const processTranscription = async (transcribedText) => {
		console.log('Sending transcription to EC2 backend...');
		try {
			const response = await fetchTranscripts(transcribedText);
			if (response.ok) {
				const data = await response.json();
				console.log(
					`Received response from EC2 backend: ${data.responseText}`
				);
				setResponseText(data.responseText);
				await playTTS(data.responseText);
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

	const playTTS = async (text) => {
		console.log('Requesting TTS from Eleven Labs...');
		try {
			const response = await fetch(
				`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'xi-api-key': ELEVEN_LABS_API_KEY,
					},
					body: JSON.stringify({
						text,
						voice_settings: {
							stability: 0.5,
							similarity_boost: 0.5,
						},
					}),
				}
			);

			if (!response.ok) {
				console.error('Failed to generate TTS:', response.statusText);
				return;
			}

			const audioData = await response.arrayBuffer();
			// const fileUri = FileSystem.cacheDirectory + 'tts-audio.mp3';

			// await FileSystem.writeAsStringAsync(
			// 	fileUri,
			// 	Buffer.from(audioData).toString('base64'),
			// 	{
			// 		encoding: FileSystem.EncodingType.Base64,
			// 	}
			// );

			// const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
			// await sound.playAsync();
		} catch (error) {
			console.error('Error with TTS:', error);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				// title={recording ? 'Stop Recording' : 'Start Recording'}
				style={styles.assistant}
				onPress={recording ? stopRecording : startRecording}
			>
				<Image
					source={require('../assets/images/splash.png')}
					style={styles.assistantIcon}
				/>
			</TouchableOpacity>
			{transcription ? (
				<Text style={styles.transcription}>
					Transcription: {transcription}
				</Text>
			) : null}
			{responseText ? (
				<Text style={styles.responseText}>
					Response: {responseText}
				</Text>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
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
		backgroundColor: '#03045E',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 10,
	},
	assistantIcon: {
		width: 80,
		height: 80,
		tintColor: '#FFFFFF',
	},
});
