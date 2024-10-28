import axios from 'axios';
import { getUserSession, clearUserSession } from './authService';
import { refreshAccessToken } from './tokenService';

const apiClient = axios.create({
	baseURL: 'http://18.221.78.54:3000',
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use(
	async (config) => {
		const { accessToken, refreshToken } = await getUserSession();

		// Attach access token to request headers
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}

		// Optionally, refresh the access token if expired
		const expirationTime = getTokenExpirationTime(accessToken); // Implement this logic to check token expiry
		if (Date.now() >= expirationTime) {
			const newAccessToken = await refreshAccessToken(refreshToken);
			if (newAccessToken) {
				await SecureStore.setItemAsync('accessToken', newAccessToken);
				config.headers['Authorization'] = `Bearer ${newAccessToken}`;
			} else {
				await clearUserSession();
				throw new Error('Session expired, please log in again');
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default apiClient;
