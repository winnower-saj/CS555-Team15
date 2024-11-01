import os
from typing import IO
import subprocess
import shutil
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from io import BytesIO
from pydub import AudioSegment
from pydub.playback import play
from dotenv import load_dotenv
load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise ValueError("ELEVENLABS_API_KEY not found in environment variables.")

client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

def play_audio(audio_stream: IO[bytes], use_pydub=True):
    if use_pydub:
        try:
            audio_data = audio_stream.read()
            if not audio_data:
                print("No audio data to play.")
                return
            audio_segment = AudioSegment.from_file(BytesIO(audio_data), format="mp3")
            play(audio_segment)
            print("Audio playback finished.")
        except Exception as e:
            print(f"Error during pydub playback: {e}")
    else:
        player = "ffplay"
        
        if not shutil.which(player):
            raise ValueError(f"{player} not found, necessary to stream audio.")
        
        player_command = [player, "-autoexit", "-", "-nodisp"]

        try:
            player_process = subprocess.Popen(
                player_command,
                stdin=subprocess.PIPE,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
            )
        except Exception as e:
            print(f"Error launching ffplay: {e}")
            return

        try:
            data = audio_stream.read()
            if not data:
                print("No audio data received.")
            player_process.stdin.write(data)
            player_process.stdin.close()
        except Exception as e:
            print(f"Error writing to ffplay stdin: {e}")

        try:
            stderr = player_process.stderr.read().decode()
            if stderr:
                print(f"ffplay stderr: {stderr}")
        except Exception as e:
            print(f"Error reading ffplay stderr: {e}")

        player_process.wait()

def text_to_speech_stream(text: str):
    try:
        print(f"Sending text to ElevenLabs API: {text}")
        response = client.text_to_speech.convert(
            voice_id="pNInz6obpgDQGcFmaJgB", 
            output_format="mp3_22050_32",
            text=text,
            model_id="eleven_multilingual_v2",
            voice_settings=VoiceSettings(
                stability=0.0,
                similarity_boost=1.0,
                style=0.0,
                use_speaker_boost=True,
            ),
        )
    except Exception as e:
        print(f"Error during TTS conversion: {e}")
        return

    audio_stream = BytesIO()

    # Write each chunk of audio data to the stream
    for chunk in response:
        if chunk:
            audio_stream.write(chunk)
            print(f"Received chunk of size: {len(chunk)} bytes")

    # Reset stream position to the beginning before playing
    audio_stream.seek(0)

    # Play the audio using pydub
    try:
        print("Playing audio with pydub...")
        play_audio(audio_stream, use_pydub=True)
    except Exception as e:
        print(f"Error during audio playback: {e}")
