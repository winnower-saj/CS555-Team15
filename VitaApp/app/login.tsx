import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext';
import { loginUser } from '../services/dbService';
import PasswordInput from './components/PasswordInput';
import MediumButton from './components/MediumButton';
import { Colors } from '../constants/Colors';
import { isValidPhoneNumber } from 'libphonenumber-js';

const Login = () => {
	const router = useRouter();
	const { login } = useAuth();
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({
		phoneNumber: false,
		password: false,
	});

	// Validate user details
	const isValidDetails = (userDetails: {
		phoneNumber: string;
		password: string;
	}) => {
		let { phoneNumber, password } = userDetails;

		let isValid = true;
		const newErrors = {
			phoneNumber: false,
			password: false,
		};

		if (!phoneNumber || !isValidPhoneNumber(phoneNumber, 'US')) {
			newErrors.phoneNumber = true;
			isValid = false;
		}

		if (!password) {
			newErrors.password = true;
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	// Login the user
	const handleLogin = async () => {
		const trimmedPhoneNumber = phoneNumber.trim();
		const trimmedPassword = password.trim();

		const isValid = isValidDetails({
			phoneNumber: trimmedPhoneNumber,
			password: trimmedPassword,
		});

		if (!isValid) {
			Alert.alert(
				'⚠️ Login Error',
				'\nProvide a valid phone number and password.',
				[
					{
						text: 'Close',
						onPress: () => console.log('Login Error: Alert Closed'),
					},
				]
			);

			return;
		}

		try {
			const response = await loginUser({
				phoneNumber: trimmedPhoneNumber,
				password: trimmedPassword,
			});

			if (response.status === 200) {
				const {
					userId,
					accessToken,
					refreshToken,
					firstName,
					lastName,
					phoneNumber,
				} = response.data;

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
			Alert.alert(
				'⚠️ Login Error',
				'\nFailed to login. Please try again.',
				[
					{
						text: 'Close',
						onPress: () => console.log('Login Error: Alert Closed'),
					},
				]
			);

			console.error(
				'Login Error:',
				error.response?.data || error.message
			);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome Back!</Text>
			<Text style={styles.subtitle}>We're glad to see you again!</Text>

			<Text style={styles.loginText} testID='login-heading'>
				Log In
			</Text>
			<TextInput
				style={[styles.input, errors.phoneNumber && styles.inputError]}
				placeholder='Phone Number'
				value={phoneNumber}
				keyboardType='phone-pad'
				onChangeText={setPhoneNumber}
				underlineColorAndroid='transparent'
			></TextInput>

			<PasswordInput
				value={password}
				placeholder='Password'
				onChange={setPassword}
				hasError={errors.password}
			></PasswordInput>

			<View style={styles.loginContainer}>
				<TouchableOpacity
					onPress={() => router.navigate('/forgot-password')}
				>
					<Text style={styles.forgotPasswordText}>
						Forgot Password?
					</Text>
				</TouchableOpacity>
			</View>

			<MediumButton
				btnTitle='Log In'
				btnBackgroundColor={Colors.blue.dark}
				marginTop={20}
				handlePress={handleLogin}
			/>

			<View style={styles.signUpContainer}>
				<Text style={styles.noAccount}>Don't have an account? </Text>
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
		padding: '5%',
	},
	title: {
		fontSize: 35,
		fontWeight: '600',
		color: Colors.blue.dark,
		marginBottom: '6%',
	},
	subtitle: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.blue.primary,
		marginBottom: '22%',
	},
	loginText: {
		width: '100%',
		fontSize: 28,
		fontWeight: '600',
		textAlign: 'left',
		color: Colors.blue.dark,
		marginBottom: '5%',
	},
	input: {
		width: '100%',
		fontSize: 20,
		fontWeight: '600',
		borderColor: Colors.blue.primary,
		padding: '4%',
		marginBottom: '4%',
		borderWidth: 4,
		borderRadius: 10,
	},
	inputError: {
		borderColor: '#ff0000',
	},
	forgotPasswordText: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.blue.primary,
		paddingBottom: '5%',
	},
	loginContainer: {
		flexDirection: 'row',
		marginTop: '5%',
	},
	noAccount: {
		fontSize: 20,
	},
	signUpContainer: {
		flexDirection: 'row',
		paddingTop: '10%',
	},
	signUpText: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.blue.primary,
	},
});

export default Login;
