import React, { useRef, useState } from 'react'
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from 'react-native'
import PageHeading from './components/PageHeading';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { getUserSession } from '../services/authService';
import { fetchTranscripts } from '../services/assistantService';
import uuid from 'react-native-uuid';

const Chat = ({ navigation }) => {
	const scrollViewRef = useRef(null);
	const [userText, setUserText] = useState('');
	const [messages, setMessages] = useState([]);
	const [textInputHeight, setTextInputHeight] = useState(50);

	// Handle message sending
	const handleSendMessage = async () => {
		if (userText.trim() !== '') {
			const userMessageId = uuid.v4();
			const newMessage = { id: userMessageId, text: userText, sender: 'user' };
			setMessages((prevMessages) => [...prevMessages, newMessage]);

			await processTranscription(userText);

			setUserText('');
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

				const assistantMessageId = uuid.v4();
				const assistantMessage = {
					id: assistantMessageId,
					text: data.responseText,
					sender: 'assistant',
				};

				setMessages((prevMessages) => [...prevMessages, assistantMessage]);
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

	// Reset user text when screen is focused
	useFocusEffect(
		React.useCallback(() => {
			setUserText('');
		}, [])
	);

	// Scroll to the bottom after new message
	const scrollToBottom = () => {
		scrollViewRef.current?.scrollToEnd({ animated: true });
	};

	React.useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleContentSizeChange = (height: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
		const contentHeight = height.nativeEvent.contentSize.height;
		setTextInputHeight(contentHeight);
	};

	return (
		<View style={styles.container}>
			<PageHeading title='Vita Assistant' handlePress={() => navigation.navigate('home')} />
			<View style={styles.chatContainer}>
				<View style={styles.iconWrapper}>
					<Image
						source={require('../assets/images/logo-white.png')}
						style={styles.icon}
					/>
				</View>
				<ScrollView
					style={styles.chatWrapper}
					showsVerticalScrollIndicator={false}
					ref={scrollViewRef}>

					{messages.map((message) => (
						<View
							key={message.id}
							style={[
								styles.message,
								message.sender === 'user' ? styles.userMessage : styles.assistantMessage,
							]}>

							<Text style={styles.text}>{message.text}</Text>
						</View>
					))}
				</ScrollView>
			</View>
			<View style={styles.messageContainer}>
				<View style={styles.messageWrapper}>
					<TextInput
						style={[styles.messageInput, { height: textInputHeight }]}
						placeholder='Chat with Vita'
						value={userText}
						onChangeText={setUserText}
						multiline={true}
						onContentSizeChange={handleContentSizeChange}
						textAlignVertical='top' />
					<TouchableOpacity style={styles.submitIcon} onPress={handleSendMessage}>
						<Ionicons name='navigate-outline' size={25} color='#ffffff' />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#ffffff',
		paddingTop: '5%',
	},
	chatContainer: {
		flex: 1,
		paddingHorizontal: '5%',
	},
	iconWrapper: {
		position: 'absolute',
		top: '15%',
		width: 150,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: Colors.blue.dark,
		borderRadius: 75,
		zIndex: -1,
		opacity: 0.7,
	},
	icon: {
		width: 96,
		height: 96,
		tintColor: '#FFFFFF',
	},
	chatWrapper: {
		zIndex: 1,
	},
	message: {
		paddingVertical: '2%',
		paddingHorizontal: '5%',
		marginBottom: '5%',
		borderRadius: 30,
	},
	text: {
		fontSize: 18,
	},
	userMessage: {
		backgroundColor: Colors.blue.light,
		alignSelf: 'flex-end',
	},
	assistantMessage: {
		backgroundColor: Colors.blue.light,
		alignSelf: 'flex-start',
	},
	messageContainer: {
		paddingVertical: '8%',
		backgroundColor: Colors.blue.dark,
	},
	messageWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: '5%',
	},
	messageInput: {
		flex: 1,
		fontSize: 20,
		color: '#000000',
		backgroundColor: '#ffffff',
		borderRadius: 35,
		paddingVertical: '3%',
		paddingHorizontal: '6%',
		minHeight: 50,
		maxHeight: 100,
		textAlignVertical: 'top',
	},
	submitIcon: {
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.blue.primary,
		borderRadius: 50,
		marginLeft: '5%',
	},
});

export default Chat;