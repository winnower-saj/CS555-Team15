import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { playWordAssocGame, playMemoryCardGame } from './games';

global.Buffer = Buffer;

const ELEVEN_LABS_API_KEY = 'sk_540dd348ff3604c77c8dcb85d7112437b193e80c7abaa55e';
const ELEVEN_LABS_VOICE_ID = 'pMsXgVXv3BLzUgSXRplE';

export default function VoiceAssistant() {
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [responseText, setResponseText] = useState('');
  const recordingRef = useRef(null);

  const startRecording = async () => {
    console.log('Requesting microphone permissions...');
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }
      console.log('Microphone permissions granted.');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setRecording(recording);
      console.log('Recording started.');
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      console.log(`Recording stopped. File saved at: ${uri}`);
      setRecording(null);
      await processAudio(uri);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const processAudio = async (uri) => {
    console.log('Processing audio...');
    try {
      // Transcription API integration (replace with your endpoint)
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: 'audio.m4a',
        type: 'audio/m4a',
      });

      const response = await fetch('YOUR_TRANSCRIPTION_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`Transcription: ${result.transcription}`);
        setTranscription(result.transcription);
        handleCommand(result.transcription.toLowerCase());
      } else {
        console.error('Failed to process audio. Response:', response.status);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  const handleCommand = (command) => {
    console.log('Processing command:', command);

    let response = '';

    if (command.includes('word association')) {
      response = playWordAssocGame();
    } else if (command.includes('memory card')) {
      response = playMemoryCardGame();
    } else {
      response = "Sorry, I didn't understand. Please say 'Word Association' or 'Memory Card'.";
    }

    setResponseText(response);
    playTTS(response);
  };

  const playTTS = async (text) => {
    console.log('Playing TTS...');
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVEN_LABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            voice_settings: { stability: 0.5, similarity_boost: 0.5 },
          }),
        }
      );

      if (!response.ok) {
        console.error('TTS request failed:', response.statusText);
        return;
      }

      const audioData = await response.arrayBuffer();
      const fileUri = FileSystem.cacheDirectory + 'tts-audio.mp3';

      await FileSystem.writeAsStringAsync(
        fileUri,
        Buffer.from(audioData).toString('base64'),
        { encoding: FileSystem.EncodingType.Base64 }
      );

      const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing TTS:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.assistantButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Image
          source={require('../assets/images/splash.png')}
          style={styles.assistantIcon}
        />
      </TouchableOpacity>
      {transcription ? (
        <Text style={styles.transcription}>Transcription: {transcription}</Text>
      ) : null}
      {responseText ? (
        <Text style={styles.responseText}>Response: {responseText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  assistantButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#03045E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  assistantIcon: {
    width: 80,
    height: 80,
    tintColor: '#FFFFFF',
  },
  transcription: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  responseText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});
