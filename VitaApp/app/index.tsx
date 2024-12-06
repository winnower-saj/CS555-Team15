import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import MediumButton from './components/MediumButton';
import { Colors } from '../constants/Colors';

const WelcomeScreen = () => {
	const router = useRouter();
	const [fontLoaded] = useFonts({
		Alice: require('../assets/fonts/Alice-Regular.ttf'),
	});

	if (!fontLoaded) {
		return null;
	}

	const handlePressLogin = () => {
		router.navigate('/login');
	};

	const handlePressSignup = () => {
		router.navigate('/signup');
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.logoContainer}>
					<Image source={require('../assets/images/logo-blue.png')} style={styles.icon} />
					<Text style={styles.appName}>VitaVoice</Text>
				</View>

				<View style={styles.buttonContainer}>
					<MediumButton btnTitle='Log In' btnBackgroundColor={Colors.blue.dark} handlePress={handlePressLogin} />
					<MediumButton btnTitle='Sign Up' marginTop={20} handlePress={handlePressSignup} />
				</View>
			</View>
		</SafeAreaView>
	);
};

// Styles
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	container: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '5%',
	},
	logoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '20%',
	},
	icon: {
		width: 120,
		height: 120,
		marginBottom: "5%",
	},
	appName: {
		fontSize: 60,
		fontFamily: 'Alice',
		color: Colors.blue.dark,
	},
	buttonContainer: {
		width: '100%',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: "20%",
	},
});

export default WelcomeScreen;
