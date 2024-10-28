import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getUserSession, clearUserSession } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadSession = async () => {
			const session = await getUserSession();
			if (session?.accessToken) {
				setUser(session);
			}
			setIsLoading(false);
		};
		loadSession();
	}, []);

	const login = async (userId, accessToken, refreshToken) => {
		await SecureStore.setItemAsync('accessToken', accessToken);
		await SecureStore.setItemAsync('refreshToken', refreshToken);
		await AsyncStorage.setItem('userId', userId);
		setUser({ userId, accessToken });
	};

	const logout = async () => {
		await clearUserSession();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
