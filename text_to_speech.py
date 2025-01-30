import pyttsx3
import edge_tts
import asyncio
import tempfile
import playsound

#Rate

# From https://huggingface.co/spaces/innoai/Edge-TTS-Text-to-Speech/blob/main/app.py

async def get_voices():
    """
    Asynchronously retrieves a list of available voices from the edge_tts service.

    Returns:
        dict: A dictionary where the keys are formatted strings containing the voice's
              short name, locale, and gender, and the values are the corresponding short names.
    """
    voices = await edge_tts.list_voices()
    return {f"{v['ShortName']} - {v['Locale']} ({v['Gender']})": v['ShortName'] for v in voices}

async def text_to_speech(text, voice, rate, pitch):
    """
    Convert the given text to speech using the specified voice, rate, and pitch.
    Args:
        text (str): The text to convert to speech.
        voice (str): The voice to use for the speech. Should be in the format "VoiceName - Description".
        rate (int): The rate of speech as a percentage. Positive values increase the rate, negative values decrease it.
        pitch (int): The pitch of the speech in Hz. Positive values increase the pitch, negative values decrease it.
    Returns:
        tuple: A tuple containing the path to the generated speech file (str) and an error message (str) if any.
               If the conversion is successful, the error message will be None.
               If there is an error, the path will be None and the error message will contain the details.
    """
    
    rate_str = f"{rate:+d}%"
    pitch_str = f"{pitch:+d}Hz"
    communicate = edge_tts.Communicate(text, voice, rate=rate_str, pitch=pitch_str)

    tmp_path = tempfile.mktemp(suffix=".mp3")
    await communicate.save(tmp_path)    
    return tmp_path, None

async def tts_interface(text, voice, rate, pitch):
    """
    Asynchronously converts text to speech using specified voice, rate, and pitch.

    Args:
        text (str): The text to be converted to speech.
        voice (str): The voice to be used for speech synthesis.
        rate (int): The rate (%) increase of the speech.
        pitch (int): The pitch (Hz) increase of the speech.

    Returns:
        tuple: A tuple containing the audio data and a warning message if any. 
               If there is no warning, the second element of the tuple will be None.
    """
    audio, _ = await text_to_speech(text, voice, rate, pitch)
    return audio, None

async def play_edge_tts(text):
    """
    Asynchronously converts text to speech using the specified voice and plays the audio.

    Args:
        text (str): The text to be converted to speech.

    Returns:
        None

    Raises:
        Exception: If there is an error during the text-to-speech conversion or audio playback.
    """
    inter, warning = await text_to_speech(text, voice="en-CA-ClaraNeural", rate=150, pitch=20)
    try:
        playsound.playsound(inter)
    except Exception as e:
        print(f"Error: {e}")


#Initializing TTS engine
engine = pyttsx3.init()

def get_tts_engine_info():
    """
    Retrieves and prints information about the text-to-speech (TTS) engine.
    This function performs the following actions:
    1. Retrieves the current speech rate of the TTS engine, increases it by 150, and prints the original rate.
    2. Retrieves and prints the current volume level of the TTS engine.
    3. Retrieves and prints the available voices of the TTS engine.
    Note: The function assumes that the TTS engine object `engine` is already initialized and available in the scope.
    """
    
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate+150)
    print(rate)
    
    volume = engine.getProperty('volume')
    print(volume)

    voices = engine.getProperty('voices')
    print(voices)

    
def sys_text_to_speech(text):
    """
    Convert the given text to speech using the System text-to-speech engine.

    Args:
        text (str): The text to be converted to speech.

    Returns:
        None
    """
    engine.setProperty('rate', 275)
    engine.say(text)
    engine.runAndWait()
    engine.stop()
    return


if __name__ == "__main__":
    #For testing purposes

    #Edge TTS test
    asyncio.run(play_edge_tts("Hello, my name is Gemini."))

    #Uncomment for SystemEngine TTS
    """"
    voices = engine.getProperty('voices')
    for voice in voices:
        engine.setProperty('voice', voice.id)
        text_to_speech("Hello, my name is Gemini.")
    """