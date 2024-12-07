import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save user session to SecureStore and AsyncStorage
export const saveUserSession = async (
	userId: string, accessToken: string, refreshToken: string,
	firstName: string, lastName: string, phoneNumber: string) => {

	try {
		await SecureStore.setItemAsync('accessToken', accessToken);
		await SecureStore.setItemAsync('refreshToken', refreshToken);
		await AsyncStorage.setItem('userId', userId);
		await AsyncStorage.setItem('firstName', firstName);
		await AsyncStorage.setItem('lastName', lastName);
		await AsyncStorage.setItem('phoneNumber', phoneNumber);
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
		const firstName = await AsyncStorage.getItem('firstName');
		const lastName = await AsyncStorage.getItem('lastName');
		const phoneNumber = await AsyncStorage.getItem('phoneNumber');
		return { accessToken, refreshToken, userId, firstName, lastName, phoneNumber };
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
		await AsyncStorage.removeItem('firstName');
		await AsyncStorage.removeItem('lastName');
		await AsyncStorage.removeItem('phoneNumber');
	} catch (e) {
		console.error('Error clearing user session:', e);
	}
};