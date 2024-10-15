import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
	const router = useRouter();
	return (
		<View style={styles.container}>
			{/* Icon */}
			<Image
				source={require('../assets/images/logo-blue.png')}
				style={styles.icon}
			/>

			{/* App Name */}
			<Text style={styles.appName}>VitaVoice</Text>

			{/* Log In Button */}
			<TouchableOpacity
				style={styles.loginButton}
				onPress={() => router.push('/login')}
			>
				<Text style={styles.buttonText}>Log In</Text>
			</TouchableOpacity>

			{/* Sign Up Button */}
			<TouchableOpacity
				style={styles.signupButton}
				onPress={() => router.push('/signup')}
			>
				<Text style={styles.buttonText}>Sign Up</Text>
			</TouchableOpacity>
		</View>
	);
};

// Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	icon: {
		width: 100, // Adjust size based on your image
		height: 100, // Adjust size based on your image
		marginBottom: 30,
	},
	appName: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#0A0A52',
		marginBottom: 50,
	},
	loginButton: {
		backgroundColor: '#0A0A52', // Dark blue color for Log In
		borderRadius: 30,
		paddingVertical: 15,
		paddingHorizontal: 80,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 5, // for Android shadow
	},
	signupButton: {
		backgroundColor: '#377DFF', // Light blue color for Sign Up
		borderRadius: 30,
		paddingVertical: 15,
		paddingHorizontal: 80,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 5, // for Android shadow
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default WelcomeScreen;
