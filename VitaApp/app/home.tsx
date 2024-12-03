import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Voice from './voice';

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
					<Voice />
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
	assistantText: {
		marginTop: 20,
		fontSize: 32,
		color: '#000000',
		fontWeight: 'semibold',
	},
});

export default Home;
