const ELEVEN_LABS_API_KEY =
	'sk_7215e9640df21cd3771dd1922cd9686d8a5e389d6349f9df';
const ELEVEN_LABS_VOICE_ID = 'pMsXgVXv3BLzUgSXRplE';

const Config = {
	API_URL: 'http://<SERVER_IP>',
	NODE_PORT: 3000,
	PYTHON_SERVER_PORT: 8000,
};

const clearConversation = async (formData) => {
	try {
	  const response = await fetch(`${Config.API_URL}:${Config.NODE_PORT}/uploads`, {
		method: 'POST',
		body: formData,

	  });
  
	  if (!response.ok) {
		console.error(`Server Error: ${response.status} - ${response.statusText}`);
	  }
  
	  return response;
	} catch (error) {
	  console.error('Network request failed:', error);
	}
  };
  

const fetchTranscripts = async (transcribedText) => {
	try {
		const response = await fetch(
			`${Config.API_URL}:${Config.PYTHON_SERVER_PORT}/process`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text: transcribedText }),
			}
		);
		return response;
	} catch (e) {
		console.error('Error clearing user session:', e);
	}
};

export { clearConversation, fetchTranscripts };
