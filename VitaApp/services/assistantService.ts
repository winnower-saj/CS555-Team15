const Config = {
	API_URL: 'http://10.0.0.125',
	NODE_PORT: 3000,
	PYTHON_SERVER_PORT: 8000,
};

const clearConversation = async (formData) => {
	try {
		const response = await fetch(
			`${Config.API_URL}:${Config.NODE_PORT}/uploads`,
			{
				method: 'POST',
				body: formData,
			}
		);

		if (!response.ok) {
			console.error(
				`Server Error: ${response.status} - ${response.statusText}`
			);
		}

		return response;
	} catch (error) {
		console.error('Network request failed:', error);
	}
};

const fetchTranscripts = async (userId, transcribedText) => {
	try {
		const response = await fetch(
			`${Config.API_URL}:${Config.PYTHON_SERVER_PORT}/process`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId: userId, text: transcribedText }),
			}
		);
		return response;
	} catch (e) {
		console.error('Error clearing user session:', e);
	}
};

export const fetchReminders = async (userId) => {
	try {
		const response = await fetch(
			`${Config.API_URL}:${Config.PYTHON_SERVER_PORT}/get-reminders/${userId}`
		);
		return response;
	} catch (error) {
		console.error('Error fetching reminders:', error);
		throw error;
	}
};

export const fetchQuestion = async (userId) => {
	try {
		const response = await fetch(
			`${Config.API_URL}:${Config.PYTHON_SERVER_PORT}/reminiscent-question/${userId}`
		);
		return response;
	} catch (error) {
		console.error('Error fetching reminiscent question:', error);
		throw error;
	}
};

export { clearConversation, fetchTranscripts };
