import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync() {
	let token;
	// console.log('Constants: ', Constants);
	if (true) {
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

		token = (
			await Notifications.getExpoPushTokenAsync({
				projectId: 'ab6bd0a3-8daf-4d3f-b207-512535efcc66',
			})
		).data;
	} else {
		console.warn('Must use physical device for Push Notifications');
	}

	return token;
}
