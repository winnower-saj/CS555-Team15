import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext';
import { loginUser } from '../services/dbService';

const Login = () => {
	const router = useRouter();
	const { login } = useAuth();
	const [contactInfo, setContactInfo] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(true);
	const [errors, setErrors] = useState({
		contactInfo: false,
		password: false,
	});

	const handleLogIn = async () => {
		const trimmedContactInfo = contactInfo.trim();
		const trimmedPassword = password.trim();

		let valid = true;
		const newErrors = {
			contactInfo: false,
			password: false,
		};

		if (!trimmedContactInfo) {
			newErrors.contactInfo = true;
			valid = false;
		}

		if (!trimmedPassword) {
			newErrors.password = true;
			valid = false;
		}

		setErrors(newErrors);

		if (!valid) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

		try {
			const userData = {
				phoneNumber: trimmedContactInfo,
				password: trimmedPassword,
			};

			const response = await loginUser(userData);

			if (response.status === 200) {
				const {
					userId,
					accessToken,
					refreshToken,
					firstName,
					lastName,
					phoneNumber,
				} = response.data;
				console.log(firstName);

				await login(
					userId,
					accessToken,
					refreshToken,
					firstName,
					lastName,
					phoneNumber
				);
				while (router.canGoBack()) {
					router.back();
				}
				router.replace('/home');
			}
		} catch (error) {
			console.error(
				'Error during login:',
				error.response?.data || error.message
			);
			Alert.alert('Error', 'Failed to log in. Please try again.');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome Back!</Text>
			<Text style={styles.subtitle}>We're glad to see you again!</Text>

			<TextInput
				style={[styles.input, errors.contactInfo && styles.inputError]}
				placeholder='Phone Number'
				value={contactInfo}
				keyboardType='phone-pad'
				onChangeText={setContactInfo}
			/>

			<View
				style={[
					styles.passwordContainer,
					errors.password && styles.inputError,
				]}
			>
				<TextInput
					style={styles.inputPassword}
					placeholder='Password'
					value={password}
					secureTextEntry={showPassword}
					onChangeText={setPassword}
				/>
				<Icon
					name={showPassword ? 'eye' : 'eye-off'}
					type='feather'
					size={24}
					onPress={() => setShowPassword(!showPassword)}
				/>
			</View>

			<Button
				title='Log In'
				buttonStyle={styles.LogInButton}
				onPress={handleLogIn}
			/>

			<View style={styles.loginContainer}>
				<TouchableOpacity
					onPress={() => router.navigate('/forgot-password')}
				>
					<Text style={styles.forgotPasswordText}>
						Forgot Password?
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.signUpContainer}>
				<Text>Don't have an account? </Text>
				<TouchableOpacity onPress={() => router.navigate('/signup')}>
					<Text style={styles.signUpText}>Sign Up</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#001C71',
	},
	subtitle: {
		fontSize: 16,
		color: '#4169E1',
		marginBottom: 20,
	},
	input: {
		width: '100%',
		borderColor: '#0077FF',
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		marginBottom: 15,
	},
	inputError: {
		borderColor: 'red',
	},
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		borderColor: '#0077FF',
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 15,
		paddingRight: 10,
	},
	inputPassword: {
		flex: 1,
		padding: 10,
	},
	LogInButton: {
		backgroundColor: '#0077FF',
		width: '100%',
		padding: 15,
		borderRadius: 10,
	},
	loginContainer: {
		flexDirection: 'row',
		marginTop: 20,
	},
	forgotPasswordText: {
		color: '#0077FF',
	},
	signUpContainer: {
		flexDirection: 'row',
		marginTop: 20,
	},
	signUpText: {
		color: '#0077FF',
		fontWeight: 'bold',
	},
});

export default Login;
