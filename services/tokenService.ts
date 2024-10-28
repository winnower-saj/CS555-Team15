export const refreshAccessToken = async (refreshToken) => {
	try {
		const response = await fetch('YOUR_BACKEND_URL/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token: refreshToken }),
		});

		if (response.ok) {
			const data = await response.json();
			return data.accessToken;
		}
		throw new Error('Failed to refresh access token');
	} catch (e) {
		console.error('Error refreshing token:', e);
		return null;
	}
};
