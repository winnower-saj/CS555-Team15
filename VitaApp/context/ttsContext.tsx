import React, { createContext, useState, useContext, useCallback } from 'react';
import * as Speech from 'expo-speech';

// Create the context with default values
const TTSContext = createContext({
	isTTSActive: false,
	playTTS: (text = '') => Promise.resolve(),
});

export const TTSProvider = ({ children }) => {
	const [isTTSActive, setIsTTSActive] = useState(false);
	const isTTSInProgress = React.useRef(false); // Lock mechanism

	const playTTS = useCallback(
		async (text = 'Default message', callBack = () => {}) => {
			if (isTTSInProgress.current) {
				console.log(
					'TTS already in progress, ignoring duplicate request.'
				);
				return;
			}

			isTTSInProgress.current = true; // Set lock
			setIsTTSActive(true);

			try {
				console.log(`Starting TTS for text: "${text}"`);
				await Speech.speak(text, {
					onDone: () => {
						console.log('TTS completed successfully.');
						isTTSInProgress.current = false; // Release lock
						setIsTTSActive(false);
						callBack();
					},
					onStopped: () => {
						console.log('TTS stopped by user.');
						isTTSInProgress.current = false; // Release lock
						setIsTTSActive(false);
					},
					onError: (error) => {
						console.error('TTS Error:', error);
						isTTSInProgress.current = false; // Release lock
						setIsTTSActive(false);
					},
				});
			} catch (error) {
				console.error('TTS failed to start:', error);
				isTTSInProgress.current = false; // Release lock
				setIsTTSActive(false);
			}
		},
		[]
	);

	return (
		<TTSContext.Provider value={{ isTTSActive, playTTS }}>
			{children}
		</TTSContext.Provider>
	);
};

export const useTTS = () => useContext(TTSContext);
