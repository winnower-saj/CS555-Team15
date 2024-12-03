import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AudioMessageComponent from '../app/voice';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { clearConversation, fetchTranscripts } from '../services/assistantService';
import { Alert } from 'react-native';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(),
    setAudioModeAsync: jest.fn(),
    Recording: {
      createAsync: jest.fn(),
    },
    RecordingOptionsPresets: { 
      HIGH_QUALITY: {},
    },
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

jest.mock('expo-file-system', () => ({
  cacheDirectory: '/cache/',
  writeAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

jest.mock('../services/assistantService');

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper'); 

describe('AudioMessageComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('renders correctly', () => {
    const { getByTestId, queryByText } = render(<AudioMessageComponent />);

    const assistantButton = getByTestId('assistant-button');
    expect(assistantButton).toBeTruthy();

    expect(queryByText(/Transcription:/)).toBeNull();
    expect(queryByText(/Response:/)).toBeNull();
  });

  test('requests microphone permissions and starts recording', async () => {
    Audio.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Audio.setAudioModeAsync.mockResolvedValue();
    Audio.Recording.createAsync.mockResolvedValue({
      recording: {
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn().mockReturnValue('file://test-uri'),
      },
    });

    const { getByTestId } = render(<AudioMessageComponent />);
    const assistantButton = getByTestId('assistant-button');

    await act(async () => {
      fireEvent.press(assistantButton);
    });

    expect(Audio.requestPermissionsAsync).toHaveBeenCalled();
    expect(Audio.setAudioModeAsync).toHaveBeenCalledWith({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    expect(Audio.Recording.createAsync).toHaveBeenCalledWith(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  });

  test('shows alert if microphone permission is denied', async () => {
    Audio.requestPermissionsAsync.mockResolvedValue({ status: 'denied' });
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByTestId } = render(<AudioMessageComponent />);
    const assistantButton = getByTestId('assistant-button');

    await act(async () => {
      fireEvent.press(assistantButton);
    });

    expect(Audio.requestPermissionsAsync).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(
      'Permission to access microphone is required!'
    );

    alertMock.mockRestore();
  });

  test('stops recording and uploads audio', async () => {
    const mockStopAndUnloadAsync = jest.fn();
    const mockGetURI = jest.fn().mockReturnValue('file://test-uri');

    const mockRecording = {
      stopAndUnloadAsync: mockStopAndUnloadAsync,
      getURI: mockGetURI,
    };

    Audio.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Audio.setAudioModeAsync.mockResolvedValue();
    Audio.Recording.createAsync.mockResolvedValue({
      recording: mockRecording,
    });

    clearConversation.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ transcription: 'Test transcription' }),
    });

    fetchTranscripts.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ responseText: 'Test response' }),
    });

    FileSystem.writeAsStringAsync.mockResolvedValue();
    Audio.Sound.createAsync.mockResolvedValue({
      sound: {
        playAsync: jest.fn(),
      },
    });

    global.fetch = jest.fn((url, options) =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      })
    );

    const { getByTestId, getByText } = render(<AudioMessageComponent />);
    const assistantButton = getByTestId('assistant-button');

    // Start Recording
    await act(async () => {
      fireEvent.press(assistantButton);
    });

    // Stop Recording
    await act(async () => {
      fireEvent.press(assistantButton);
    });

    expect(mockStopAndUnloadAsync).toHaveBeenCalled();
    expect(mockGetURI).toHaveBeenCalled();
    expect(clearConversation).toHaveBeenCalled();

    await waitFor(() => {
      expect(getByText(/Transcription: Test transcription/)).toBeTruthy();
      expect(getByText(/Response: Test response/)).toBeTruthy();
    });

    expect(fetchTranscripts).toHaveBeenCalledWith('Test transcription');
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
    expect(Audio.Sound.createAsync).toHaveBeenCalled();
  });

  test('handles upload audio failure', async () => {
    Audio.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Audio.setAudioModeAsync.mockResolvedValue();
    Audio.Recording.createAsync.mockResolvedValue({
      recording: {
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn().mockReturnValue('file://test-uri'),
      },
    });

    clearConversation.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByTestId } = render(<AudioMessageComponent />);
    const assistantButton = getByTestId('assistant-button');

    // Start Recording
    await act(async () => {
      fireEvent.press(assistantButton);
    });

    // Stop Recording
    await act(async () => {
      fireEvent.press(assistantButton);
    });

    expect(clearConversation).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith('Error', 'Failed to upload audio');

    alertMock.mockRestore();
  });

  test('handles transcription processing failure', async () => {
    const mockStopAndUnloadAsync = jest.fn();
    const mockGetURI = jest.fn().mockReturnValue('file://test-uri');

    const mockRecording = {
      stopAndUnloadAsync: mockStopAndUnloadAsync,
      getURI: mockGetURI,
    };

    Audio.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Audio.setAudioModeAsync.mockResolvedValue();
    Audio.Recording.createAsync.mockResolvedValue({
      recording: mockRecording,
    });

    clearConversation.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ transcription: 'Test transcription' }),
    });

    fetchTranscripts.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByTestId } = render(<AudioMessageComponent />);
    const assistantButton = getByTestId('assistant-button');

    // Start Recording
    await act(async () => {
      fireEvent.press(assistantButton);
    });

    // Stop Recording
    await act(async () => {
      fireEvent.press(assistantButton);
    });

    expect(fetchTranscripts).toHaveBeenCalledWith('Test transcription');
    expect(alertMock).toHaveBeenCalledWith(
      'Error',
      'Failed to process transcription'
    );

    alertMock.mockRestore();
  });

  test('handles TTS playback', async () => {
    const mockStopAndUnloadAsync = jest.fn();
    const mockGetURI = jest.fn().mockReturnValue('file://test-uri');

    const mockRecording = {
      stopAndUnloadAsync: mockStopAndUnloadAsync,
      getURI: mockGetURI,
    };

    Audio.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Audio.setAudioModeAsync.mockResolvedValue();
    Audio.Recording.createAsync.mockResolvedValue({
      recording: mockRecording,
    });

    clearConversation.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ transcription: 'Test transcription' }),
    });

    fetchTranscripts.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ responseText: 'Test response' }),
    });

    FileSystem.writeAsStringAsync.mockResolvedValue();
    
    const mockPlayAsync = jest.fn();

    Audio.Sound.createAsync.mockResolvedValue({
      sound: {
        playAsync: mockPlayAsync,
      },
    });

    global.fetch = jest.fn((url, options) =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      })
    );

    const { getByTestId, getByText } = render(<AudioMessageComponent />);
    const assistantButton = getByTestId('assistant-button');

    // Start Recording
    await act(async () => {
      fireEvent.press(assistantButton);
    });

    // Stop Recording
    await act(async () => {
      fireEvent.press(assistantButton);
    });

    await waitFor(() => {
      expect(getByText(/Transcription: Test transcription/)).toBeTruthy();
      expect(getByText(/Response: Test response/)).toBeTruthy();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.elevenlabs.io/v1/text-to-speech/'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'xi-api-key': 'sk_540dd348ff3604c77c8dcb85d7112437b193e80c7abaa55e',
        }),
        body: JSON.stringify({
          text: 'Test response',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      })
    );

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
    expect(Audio.Sound.createAsync).toHaveBeenCalled();
    expect(mockPlayAsync).toHaveBeenCalled();
  });
});
