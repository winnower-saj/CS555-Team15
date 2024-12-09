import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Voice from './voice';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const Home = ({ navigation, route }) => {
	const { user } = route.params;
	const [greeting, setGreeting] = useState('');

	const getGreetingMessage = () => {
		const hour = new Date().getHours();

		if (hour < 12) return 'Good Morning!';
		if (hour < 18) return 'Good Afternoon!';
		return 'Good Evening!';
	};

	useEffect(() => {
		setGreeting(getGreetingMessage());
	}, []);

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
			testID='panGestureHandler'
		>
			<View style={styles.container}>
				<View style={styles.navigation}>
					<TouchableOpacity
						style={styles.iconContainer}
						onPress={() => navigation.navigate('profile')}>

						<Image source={require('../assets/images/user-small.png')} />
						<Text style={styles.iconText}>My Profile</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.iconContainer}
						onPress={() => navigation.navigate('notifications')}>

						<View style={styles.icon}>
							<Ionicons name='notifications' size={30} color='#FFFFFF' />
						</View>
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

					<View style={styles.vitaTap}>
						<Text style={styles.tapText}>Tap to Vita</Text>
						<Voice></Voice>
					</View>
				</View>

				<TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('chat')}>
					<Text style={styles.chatText}>Chat</Text>
				</TouchableOpacity>
			</View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		padding: '5%',
	},
	navigation: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: '8%',
	},
	iconContainer: {
		alignItems: 'center',
	},
	icon: {
		width: 60,
		height: 60,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.blue.primary,
		borderRadius: 50,
		marginRight: '6%',
	},
	iconText: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.blue.primary,
		marginTop: '5%',
	},
	assistantContainer: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	greetingContainer: {
		position: 'absolute',
		top: '6%',
	},
	greeting: {
		fontSize: 24,
		fontWeight: 'medium',
		color: '#000000',
		textAlign: 'center',
	},
	userName: {
		fontSize: 32,
		fontWeight: '600',
		textAlign: 'center',
		color: Colors.blue.primary,
		marginTop: '5%',
	},
	vitaTap: {
		marginTop: '30%'
	},
	tapText: {
		fontSize: 32,
		fontWeight: '600',
		color: '#000000',
		marginBottom: '5%',
	},
	chatButton: {
		alignSelf: 'center',
		backgroundColor: Colors.blue.dark,
		paddingVertical: '2%',
		paddingHorizontal: '12%',
		borderRadius: 50,
	},
	chatText: {
		fontSize: 24,
		fontWeight: '600',
		color: '#ffffff',
		textAlign: 'center'
	}
});

export default Home;
