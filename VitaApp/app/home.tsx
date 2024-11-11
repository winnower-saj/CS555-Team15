import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	StyleSheet,
	Alert,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

const API_URL = process.env.API_URL;
const STATUS_URL = process.env.STATUS_URL;
const API_KEY = process.env.API_KEY;
const API_KEY_NAME = process.env.API_KEY_NAME;

const Home = ({ navigation, route }) => {
	const { user } = route.params;
	const [isRunning, setIsRunning] = useState(false);
	const [loading, setLoading] = useState(false);
	const [greeting, setGreeting] = useState('');

	const getGreetingMessage = () => {
		const hour = new Date().getHours();

		if (hour < 12) return 'Good Morning!';
		if (hour < 18) return 'Good Afternoon!';
		return 'Good Evening!';
	};

	const fetchStatus = () => {
		axios
			.get(STATUS_URL, { headers: { [API_KEY_NAME]: API_KEY } })
			.then((response) =>
				setIsRunning(response.data.status === 'running')
			)
			.catch(() => Alert.alert('Error', 'Failed to fetch status.'));
	};

	useEffect(() => {
		setGreeting(getGreetingMessage());
		fetchStatus();
	}, []);

	const handleAssistant = () => {
		setLoading(true);
		const action = isRunning ? 'stop' : 'start';

		axios
			.post(
				API_URL,
				{ action },
				{
					headers: {
						[API_KEY_NAME]: API_KEY,
						'Content-Type': 'application/json',
					},
				}
			)
			.then((response) => {
				setIsRunning(!isRunning);
				Alert.alert('Success', response.data.status);
			})
			.catch((error) =>
				Alert.alert(
					'Error',
					error.response?.data?.detail || 'Something went wrong.'
				)
			)
			.finally(() => setLoading(false));
	};

	const handleGesture = (event) => {
		const { translationX } = event.nativeEvent;

		if (translationX < -50) {
			// Detect left swipe
			navigation.navigate('notifications');
		} else if (translationX > 50) {
			// Detect right swipe
			navigation.navigate('profile');
		}
	};

	return (
		<PanGestureHandler
			onGestureEvent={handleGesture}
			onHandlerStateChange={handleGesture}
		>
			<View style={styles.container}>
				<View style={styles.navigation}>
					<TouchableOpacity
						style={styles.iconContainer}
						onPress={() => navigation.navigate('profile')}
					>
						<Image
							source={require('../assets/images/profile.png')}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>Profile</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.iconContainer}
						onPress={() => navigation.navigate('notifications')}
					>
						<Image
							source={require('../assets/images/notifications.png')}
							style={styles.icon}
						/>
						<Text style={styles.iconText}>Notifications</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.assistantContainer}>
					<View style={styles.greetingContainer}>
						<Text style={styles.greeting}>{greeting}</Text>
						<Text
							style={styles.userName}
						>{`${user.firstName} ${user.lastName}`}</Text>
					</View>
					<TouchableOpacity
						style={styles.assistant}
						onPress={handleAssistant}
						disabled={loading}
					>
						<Image
							source={require('../assets/images/splash.png')}
							style={styles.assistantIcon}
						/>
					</TouchableOpacity>
					<Text style={styles.assistantText}>Tap to Vita</Text>
				</View>
			</View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		padding: 24,
	},
	navigation: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 36,
	},
	iconContainer: {
		alignItems: 'center',
	},
	icon: {
		width: 30,
		height: 30,
		backgroundColor: '#0077B6',
		borderRadius: 50,
	},
	iconText: {
		marginTop: 5,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#0077B6',
	},
	assistantContainer: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	greetingContainer: {
		position: 'absolute',
		top: 60,
	},
	greeting: {
		color: '#000000',
		fontSize: 24,
		fontWeight: 'medium',
		textAlign: 'center',
	},
	userName: {
		color: '#0077B6',
		fontSize: 32,
		fontWeight: 'semibold',
		textAlign: 'center',
		marginTop: 16,
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
	assistantText: {
		marginTop: 20,
		fontSize: 32,
		color: '#000000',
		fontWeight: 'semibold',
	},
});

export default Home;
