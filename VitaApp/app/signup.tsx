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
import CustomModal from './components/CustomModal';
import { useAuth } from '../context/authContext';
import { signupUser } from '../services/dbService';
import PasswordInput from './components/PasswordInput';
import MediumButton from './components/MediumButton';
import { Colors } from '../constants/Colors';
import { isValidPhoneNumber } from 'libphonenumber-js';

const Signup = () => {
	const router = useRouter();
	const { login } = useAuth();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState({
		firstName: false,
		lastName: false,
		phoneNumber: false,
		password: false,
		confirmPassword: false,
	});
	const [showModal, setShowModal] = useState(false);
	const [userDetails, setUserDetails] = useState({
		accessToken: '',
		refreshToken: '',
		userId: '',
		firstName: '',
		lastName: '',
		phoneNumber: ''
	});

	// Validate user details
	const isValidDetails = (userDetails: { firstName: string; lastName: string; phoneNumber: string; password: string; confirmPassword: string; }) => {
		const { firstName, lastName, phoneNumber, password, confirmPassword } = userDetails;

		let isValid = true;
		const newErrors = {
			firstName: false,
			lastName: false,
			phoneNumber: false,
			password: false,
			confirmPassword: false,
		};

		const nameRegex = /^[a-zA-Z\s'-]+$/;
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

		if (!firstName || !nameRegex.test(firstName)) {
			newErrors.firstName = true;
			isValid = false;
		}

		if (!lastName || !nameRegex.test(lastName)) {
			newErrors.lastName = true;
			isValid = false;
		}

		if (!phoneNumber || !isValidPhoneNumber(phoneNumber, 'US')) {
			newErrors.phoneNumber = true;
			isValid = false;
		}

		if (!password || !passwordRegex.test(password)) {
			newErrors.password = true;
			isValid = false;
		}

		if (!confirmPassword || confirmPassword !== password) {
			newErrors.confirmPassword = true;
			isValid = false;
		}

		if (password !== confirmPassword) {
			newErrors.password = true;
			newErrors.confirmPassword = true;
			isValid = false;
		}

		setErrors(newErrors);
		return { isValid, newErrors };
	};

	// Sign up the user
	const handleSignup = async () => {
		const trimmedFirstName = firstName.trim();
		const trimmedLastName = lastName.trim();
		const trimmedPhoneNumber = phoneNumber.trim();
		const trimmedPassword = password.trim();
		const trimmedConfirmPassword = confirmPassword.trim();

		const { isValid, newErrors } = isValidDetails({
			firstName: trimmedFirstName,
			lastName: trimmedLastName,
			phoneNumber: trimmedPhoneNumber,
			password: trimmedPassword,
			confirmPassword: trimmedConfirmPassword,
		});

		if (!isValid) {
			let errorMessage = 'Please fill out all required fields.\n';

			if (newErrors.firstName) {
				errorMessage += '\n\t❌ First name must only contain' + '\n\t\t\t\t letters';
			}

			if (newErrors.lastName) {
				errorMessage += '\n\t❌ Last name must only contain' + '\n\t\t\t\t letters';
			}

			if (newErrors.phoneNumber) {
				errorMessage += '\n\t❌ Phone number must be a valid' + '\n\t\t\t\t 10-digit number';
			}

			if (newErrors.password) {
				errorMessage += '\n\t❌ Password must be \n\t\t\t\t\t• 8 - 64 characters long' +
					'\n\t\t\t\t\t• contains one uppercase letter' +
					'\n\t\t\t\t\t• contains one lowercase letter' +
					'\n\t\t\t\t\t• contains one special character';
			}

			if (newErrors.confirmPassword) {
				errorMessage += '\n\t❌ Confirm password must match the' + '\n\t\t\t\t password';
			}

			Alert.alert('⚠️ Signup Error',
				errorMessage,
				[
					{
						text: 'Close',
						onPress: () => console.log('Signup Error: Alert Closed'),
					}
				]
			);

			return;
		}

		try {
			const response = await signupUser({
				firstName: trimmedFirstName,
				lastName: trimmedLastName,
				phoneNumber: trimmedPhoneNumber,
				password: trimmedPassword,
			});

			if (response.status === 201) {
				const { accessToken, refreshToken, userId, firstName, lastName, phoneNumber } = response.data;

				setUserDetails({
					accessToken: accessToken,
					refreshToken: refreshToken,
					userId: userId,
					firstName: firstName,
					lastName: lastName,
					phoneNumber: phoneNumber
				});

				setShowModal(true);
			}
		} catch (error) {
			let alertMessage = '\nFailed to create an account. Please try again.';

			if (error.response?.data.message === 'User with this phone number already exists.') {
				alertMessage = '\nPhone number already exists.';
			}

			Alert.alert('⚠️ Signup Error',
				alertMessage,
				[
					{
						text: 'Close',
						onPress: () => console.log('Signup Error: Alert Closed'),
					}
				]
			);

			console.error('Signup Error:', error.response?.data || error.message);
		}
	};

	const handleModalClose = async () => {
		await login(
			userDetails.userId,
			userDetails.accessToken,
			userDetails.refreshToken,
			userDetails.firstName,
			userDetails.lastName,
			userDetails.phoneNumber
		);

		setShowModal(false);
		router.replace('/home');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create an account</Text>

			<TextInput
				style={[styles.input, errors.firstName && styles.inputError]}
				placeholder='First Name'
				value={firstName}
				onChangeText={setFirstName}
				underlineColorAndroid="transparent"
			/>

			<TextInput
				style={[styles.input, errors.lastName && styles.inputError]}
				placeholder='Last Name'
				value={lastName}
				onChangeText={setLastName}
				underlineColorAndroid="transparent"
			/>

			<TextInput
				style={[styles.input, errors.phoneNumber && styles.inputError]}
				placeholder='Phone Number'
				value={phoneNumber}
				keyboardType='phone-pad'
				onChangeText={setPhoneNumber}
				underlineColorAndroid="transparent"
			/>

			<PasswordInput
				value={password}
				placeholder='Password'
				onChange={setPassword}
				hasError={errors.password}
			/>

			<PasswordInput
				value={confirmPassword}
				placeholder='Confirm Password'
				onChange={setConfirmPassword}
				hasError={errors.confirmPassword}
			/>

			<MediumButton btnTitle='Sign Up' marginTop={20} handlePress={handleSignup} />

			<View style={styles.loginContainer}>
				<Text style={styles.haveAccount}>Already have an account? </Text>
				<TouchableOpacity onPress={() => router.navigate('/login')}>
					<Text style={styles.loginText}>Log In</Text>
				</TouchableOpacity>
			</View>

			<View>
				<CustomModal
					title='Successfully Registered'
					message='Congratulations, you have successfully created the VitaVoice account.'
					btnTitle='Home'
					onClose={handleModalClose}
					visible={showModal}
				/>
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
		marginBottom: '14%',
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
	haveAccount: {
		fontSize: 20,
	},
	loginContainer: {
		flexDirection: 'row',
		marginTop: '5%',
	},
	loginText: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.blue.primary,
	},
});

export default Signup;
