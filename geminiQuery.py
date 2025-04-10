import google.generativeai as genai
import asyncio
from speech_to_text import speech_to_text_translation, output_log_text
from text_to_speech import sys_text_to_speech, play_edge_tts
from dotenv import load_dotenv
import os

load_dotenv()
systemInstruction = "You are a friendly kiosk at a college designed to help students navigate through their school life"

#Provide a model version number and audio transcriptions to Query the gemini model with input text
def query_gemini_model(version=15, transcription=None):
    """
    Queries the Gemini generative model with the specified version and transcription.
    Saves the query and response to a log file.

    Args:
        version (int, optional): The version of the Gemini model to use. Defaults to 3.
        transcription (str, optional): The transcription text to generate content from. Defaults to None.

    Returns:
        str: The generated content from the Gemini model.
    """
    API_KEY = os.getenv('API_KEY')
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(
        model_name=f"tunedModels/flemingkiosk-v{version}"      
        )
    result = model.generate_content(
        transcription, 
        generation_config = genai.GenerationConfig(
        max_output_tokens=75,
        temperature=0.1,
    ))
    output_log_text(transcription)
    try:
        output_log_text(result.text)
    except Exception as e:
        output_log_text(f"Error: {e}")
    if result.candidates[0].finish_reason == 3:
        print("Harmful content detected")
        return "I'm sorry, I cannot provide an answer to that question." 
    else:
        return result


def gemini_query_response_tts(text=None):
    """
    processes text using the Gemini model and plays the resulting text-to-speech.
    Args:
        text (str, optional): The input text to be processed. If not provided, the function will use speech-to-text translation.
    Returns:
        speech (str): The transcript of the questions asked by the user.
        result.text (str): The text-to-speech output from the Gemini model.
    Raises:
        Exception: If there is an error during the text-to-speech playback.
    Behavior:
        - If `text` is provided, it is used as the input speech.
        - If `text` is not provided, the function will call `speech_to_text_translation()` to get the input speech.
        - The function queries the Gemini model with the input speech.
        - If the first candidate's finish reason is 3, it prints "Harmful content detected".
        - Otherwise, it prints the result text and attempts to play the text using Edge TTS.
    """

    speech = text or speech_to_text_translation()
    result = query_gemini_model(version=15, transcription=speech)

    try:
        print(result.text)
        play_edge_tts(result.text)
        return speech, result.text
    except Exception as e:
        print(f"Audio Error: {e}")
        print(speech, result)
        return speech, result



if __name__ == "__main__":
    
    i=8
    print(query_gemini_model(11,"Is fleming college public?"))
    #gemini_query_response_tts("Where is the college located?")
    """
    print(query_gemini_model(i,"Is fleming college public?").text)    
    print(query_gemini_model(i,"Who is the college's mascot?").text)

    print(query_gemini_model(i,"How do I access the bookstore?").text)
    print(f"Model version {i} ********************\n")


    """