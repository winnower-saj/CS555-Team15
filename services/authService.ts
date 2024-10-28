import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save user session to SecureStore and AsyncStorage
export const saveUserSession = async (userId, accessToken, refreshToken) => {
	try {
		await SecureStore.setItemAsync('accessToken', accessToken);
		await SecureStore.setItemAsync('refreshToken', refreshToken);
		await AsyncStorage.setItem('userId', userId);
	} catch (e) {
		console.error('Error saving user session:', e);
	}
};

// Get user session (tokens and user data)
export const getUserSession = async () => {
	try {
		const accessToken = await SecureStore.getItemAsync('accessToken');
		const refreshToken = await SecureStore.getItemAsync('refreshToken');
		const userId = await AsyncStorage.getItem('userId');
		return { accessToken, refreshToken, userId };
	} catch (e) {
		console.error('Error retrieving user session:', e);
		return null;
	}
};

// Clear user session during logout
export const clearUserSession = async () => {
	try {
		await SecureStore.deleteItemAsync('accessToken');
		await SecureStore.deleteItemAsync('refreshToken');
		await AsyncStorage.removeItem('userId');
	} catch (e) {
		console.error('Error clearing user session:', e);
	}
};
