import google.generativeai as genai
import asyncio
from speech_to_text import speech_to_text_translation
from text_to_speech import sys_text_to_speech, play_edge_tts

systemInstruction = "You are a friendly kiosk at a college designed to help students navigate through their school life"

#Provide a model version number and audio transcriptions to Query the gemini model with input text
def query_gemini_model(version=11, transcription=None):
    """
    Queries the Gemini generative model with the specified version and transcription.

    Args:
        version (int, optional): The version of the Gemini model to use. Defaults to 3.
        transcription (str, optional): The transcription text to generate content from. Defaults to None.

    Returns:
        str: The generated content from the Gemini model.
    """
    genai.configure(api_key="AIzaSyD84E4GHYIZCHhrMscz3X_l14wSdakY-CM")
    model = genai.GenerativeModel(
        model_name=f"tunedModels/flemingkiosk-v{version}"      
        )
    result = model.generate_content(
        transcription, 
        generation_config = genai.GenerationConfig(
        max_output_tokens=75,
        temperature=0.1,
    ))
    return result

async def gemini_query_response_tts(text=None):
    """
    Asynchronously processes text using the Gemini model and plays the resulting text-to-speech.
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
    result = query_gemini_model(version=3, transcription=speech)

    if result.candidates[0].finish_reason == 3:
        print("Harmful content detected")
    else:
        try:
            print(result.text)
            #sys_text_to_speech(result.text) #uncomment to use system text to speech
            await play_edge_tts(result.text) #uncomment to use edge text     
            return speech, result.text       
        except Exception as e:
            print(f"Error: {e}")
            return e


if __name__ == "__main__":
    
    i=7
    #asyncio.run(gemini_query_response_tts("Is fleming college public?"))
    print(query_gemini_model(i,"Is fleming college public?").text)    

    print(query_gemini_model(i,"Who is the college's mascot?").text)

    print(query_gemini_model(i,"How do I access the bookstore?").text)
    print(f"Model version {i} ********************\n")


    """
    speech = speech_to_text_translation()
    result = query_gemini_model(version=3, transcription=speech)

    if result.candidates[0].finish_reason == 3:
        print("Harmful content detected")
    else:
        try:
            print(result.text)
            #sys_text_to_speech(result.text) #uncomment to use system text to speech
            asyncio.run(play_edge_tts(result.text)) #uncomment to use edge text            
        except Exception as e:
            print(f"Error: {e}")
    """