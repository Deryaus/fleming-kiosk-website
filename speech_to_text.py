import speech_recognition as sr
from datetime import datetime
import time, os.path, sys, contextlib

#supress STDERR messages from PyAudio module
@contextlib.contextmanager
def ignoreStdErr():
    devnull = os.open(os.devnull, os.O_WRONLY)
    old_stderr = os.dup(2)
    sys.stderr.flush()
    os.dup2(devnull, 2)
    os.close(devnull)
    try:
        yield
    finally:
        os.dup2(old_stderr, 2)
        os.close(old_stderr)

#Intialize the recognizer
r = sr.Recognizer() 

#Function to record the audio
def record_text():
    """
    Records audio from the microphone and converts it to text using Google's speech recognition.
    The function continuously listens for audio input from the microphone, adjusts for ambient noise,
    and attempts to recognize and convert the spoken words to text. If successful, it prints and returns
    the recognized text. If there is an error with the request or the speech is not recognized, it prints
    an error message.
    Returns:
        str: The recognized text from the audio input.
    Raises:
        sr.RequestError: If there is an issue with the request to the Google API.
        sr.UnknownValueError: If the speech is unintelligible.
    """
    print("Listening...")
    while(1):
        try:
            with sr.Microphone() as source:
                r.adjust_for_ambient_noise(source, duration=0.2)                
                audio = r.listen(source)
                print("Recording...")
                text = r.recognize_google(audio)
                print("You said: ", text)
                return text
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
                
        except sr.UnknownValueError:
            print("Sorry, I did not get that.")
    return

#Outputs text to speechlog.txt file with timestamp to keep track of the conversation
def output_log_text(text):
    """
    Appends the provided text to a log file with a timestamp.

    If the log file does not exist, it creates the file and writes a header.
    Each log entry is prefixed with the current date and time.

    Args:
        text (str): The text to be logged.

    Returns:
        None
    """
    if not os.path.exists("speechlog.txt"):
        with open("speechlog.txt", "a") as f:
            f.write("Speech Log:\n\n")
    else:
        f = open("speechlog.txt", "a")
    f.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S") + " " + text + "\n")
    f.close()
    return

#Translates speech to text and outputs the recorded text to terminal. 
#Recording timeout is modified throughthe RECORDING_TIMEOUT value
def speech_to_text_translation():
    """
    Records speech for a specified duration and translates it to text.

    This function records audio for a duration defined by RECORDING_TIMEOUT,
    converts the recorded speech to text, and outputs the text. The function
    returns the final translated text after the recording duration has elapsed.

    Returns:
        str: The translated text from the recorded speech.
    """
    RECORDING_TIMEOUT = 2
    start_time = time.time()
    with ignoreStdErr():
        while time.time() - start_time < RECORDING_TIMEOUT:
            text = record_text()
            output_log_text(text)
        return text

if __name__ == "__main__":
    speech_to_text_translation()
