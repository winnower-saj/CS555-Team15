import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { updatePassword } from '../services/dbService';
import PageHeading from './components/PageHeading';
import MediumButton from './components/MediumButton';
import PasswordInput from './components/PasswordInput';

const PasswordManager = ({ navigation, route }) => {
	const { user } = route.params;
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const changePassword = async () => {
		if (newPassword !== confirmPassword) {
			Alert.alert('Password Error', 'New passwords do not match.');
			return;
		}

		try {
			const userId = user.userId
			const response = await updatePassword(
				userId,
				currentPassword,
				newPassword,
			);

			if (response) {
				Alert.alert('Success', response);
			}
		} catch (e) {
			if (e.response && e.response.data && e.response.data.message) {
				Alert.alert('Error', e.response.data.message); // Backend error message
			} else {
				Alert.alert('Error', 'Failed to update password.'); // General error
			}
		}
	};
	return (
		<View style={styles.container}>
			<PageHeading title='Password Manager' handlePress={() => navigation.navigate('settings')} />

			<View style={styles.passwordWrapper}>
				<Text style={styles.label}>Current Password</Text>
				<PasswordInput
					value={currentPassword}
					placeholder=''
					onChange={setCurrentPassword}
					hasError=''
				/>

				<Text style={styles.label}>New Password</Text>
				<PasswordInput
					value={newPassword}
					placeholder=''
					onChange={setNewPassword}
					hasError=''
				/>

				<Text style={styles.label}>Confirm New Password</Text>
				<PasswordInput
					value={confirmPassword}
					placeholder=''
					onChange={setConfirmPassword}
					hasError=''
				/>
			</View>

			<View style={styles.updateButton}>
				<MediumButton btnTitle='Update Password' handlePress={changePassword} />
			</View>
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		paddingVertical: '5%',
	},
	passwordWrapper: {
		paddingHorizontal: '5%',
		marginVertical: '10%',
	},
	label: {
		fontSize: 20,
		fontWeight: '600',
		marginBottom: '2%',
	},
	updateButton: {
		alignItems: 'center',
	},
});

export default PasswordManager;
