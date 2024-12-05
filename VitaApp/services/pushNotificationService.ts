import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';

export async function registerForPushNotificationsAsync(): Promise<
	string | null
> {
	let token: string | null = null;
	console.log('Constants: ', Constants.isDevice);

	if (Constants.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== 'granted') {
			console.warn('Failed to get push token for push notifications!');
			return null;
		}

		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log('Expo Push Token:', token);
	} else {
		console.warn('Must use physical device for Push Notifications');
	}

	return token;
}

export async function saveExpoPushTokenToBackend(token: string): Promise<void> {
	try {
		const response = await axios.post(
			'http://localhost:3000/auth/save-token',
			{
				expoPushToken: token,
			}
		);
		console.log('Push token saved to backend:', response.data);
	} catch (error) {
		console.error('Error saving push token to backend:', error.message);
	}
}
