import os 
from signal import SIGINT, SIGTERM
import asyncio
from dotenv import load_dotenv
from deepgram import (
    DeepgramClient,
    DeepgramClientOptions,
    LiveTranscriptionEvents,
    LiveOptions,
    Microphone,
)
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
DEEPGRAM_API_KEY = os.getenv('DEEPGRAM_API_KEY')

class TranscriptManager:
    def __init__(self):
        self.transcript_parts = []

    def add_transcription(self, part):
        self.transcript_parts.append(part)

    def get_full_transcription(self):
        return " ".join(self.transcript_parts)

    def clear(self):
        self.transcript_parts = []

mic_instance = None

def pause_microphone():
    global mic_instance
    if mic_instance is not None and mic_instance._stream is not None:
        mic_instance._stream.stop_stream()  # pause the microphone stream
        logger.info("Microphone paused.")

def resume_microphone():
    global mic_instance
    if mic_instance is not None and mic_instance._stream is not None:
        if not mic_instance._stream.is_active():
            mic_instance._stream.start_stream()  # resume the microphone stream
            logger.info("Microphone resumed.")

async def speech_recognition(callback, stop_event):
    transcript_manager = TranscriptManager() 
    global mic_instance, dg_connection

    try:
        client_config = DeepgramClientOptions(options={"keepalive": "true"})
        deepgram_client = DeepgramClient(DEEPGRAM_API_KEY, client_config)
        dg_connection = deepgram_client.listen.asyncwebsocket.v("1")

        async def on_message(self, result, **kwargs):
            transcription = result.channel.alternatives[0].transcript

            if not result.speech_final:  # speech final -> sentence complete based on endpointing
                transcript_manager.add_transcription(transcription)
            else:
                transcript_manager.add_transcription(transcription)
                full_transcript = transcript_manager.get_full_transcription().strip()
                if len(full_transcript) > 0:
                    logger.info(f"Final Transcription: {full_transcript}")
                    await callback(full_transcript)
                    transcript_manager.clear()

        dg_connection.on(LiveTranscriptionEvents.Transcript, on_message)

        transcription_options = LiveOptions(
            model="nova-2",
            punctuate=True,
            language="en-US",
            encoding="linear16",
            channels=1,
            sample_rate=16000,
            endpointing=300, 
            smart_format=True,
        )

        await dg_connection.start(transcription_options)

        mic_instance = Microphone(dg_connection.send)
        mic_instance.start()
        logger.info("Microphone started.")

        # Keep listening until the stop_event is set
        while not stop_event.is_set():
            await asyncio.sleep(0.1)  # Short sleep to allow checking the stop_event frequently

    except asyncio.CancelledError:
        logger.info("Speech recognition task was cancelled.")
    except Exception as error:
        logger.error(f"Error in speech recognition: {error}")
    finally:
        if mic_instance and mic_instance._stream is not None:
            mic_instance._stream.stop_stream()
            logger.info("Microphone stopped in finally block.")
