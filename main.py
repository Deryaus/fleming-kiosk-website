"""
Description:
 Main program for Fleming kiosk webpage

Usage:
 python main.py

Parameters:
 None
"""

from flask import Flask, render_template, jsonify, request
from geminiQuery import gemini_query_response_tts, query_gemini_model
from events import get_all_events
from text_to_speech import play_edge_tts
from apscheduler.schedulers.background import BackgroundScheduler


app = Flask(__name__)

#Scheduling grabbing the SAC calender image from the website once per day
scheduler = BackgroundScheduler()
scheduler.add_job(get_all_events, 'interval', days=1)
scheduler.start()
get_all_events()

# Routes
@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/home')
def home():
    return render_template('home.html') 

@app.route('/chat', methods=['POST'])
def chat():
    """
    Handle chat requests by processing user input and returning a response.

    This function retrieves the user's message from the JSON request, processes it using
    the Gemini model, and returns the model's response as a JSON object. If an error occurs
    during processing, an error message is returned.

    Returns:
        Response: A JSON response containing the model's reply or an error message.

    Raises:
        Exception: If there is an issue with processing the request.
    """
    try:
        user_input = request.json.get('message', '') # Default value is empty string
        #speech, response = await gemini_query_response_tts(user_input)
        response = query_gemini_model(11, user_input)
        return jsonify({'response': response.text})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Sorry there was a problem with your request'}), 500
    
@app.route('/record-audio', methods=['POST'])
def record_audio():
    """
    Records audio and processes it using the gemini_query_response_tts function.

    This function attempts to record audio input, process it, and return the results
    in a JSON response. If an error occurs during processing, it catches the exception
    and returns an error message in a JSON response with a 500 status code.

    Returns:
        Response: A JSON response containing the user input and output from the 
                  gemini_query_response_tts function, or an error message if an 
                  exception occurs.
    """
    try:
        user_input, output = gemini_query_response_tts()
        return jsonify({ 
            'user_input': user_input,
            'output': output
            })
    except Exception as e:
        print(e)
        return jsonify({'error': 'Sorry there was a problem with your request'}), 500

#TODO: Add different colour speech bubbles to the HTML
#TODO: Create questions for FAQ 
#TODO: Use question text to return a response using TTS
#TODO: timeout welcome button for TTS

@app.route('/tts', methods=['POST'])
def tts():
    """
    Initiates a text-to-speech (TTS) process to deliver a welcome message and prompt for a random fact about Sir Sandford Fleming.

    The function attempts to generate a TTS response with a predefined welcome message. If successful, it returns a JSON response indicating the TTS process has started. If an error occurs, it catches the exception, prints an error message, and returns a JSON response with the error details.

    Returns:
        tuple: A tuple containing a JSON response and an HTTP status code.
            - On success: ({"message": "TTS started", 'status': 'success'}, 200)
            - On error: ({"error": str(e), 'status': 'error'}, 500)
    """
    try:
        welcome_message = "Say Welcome to Fleming College"
        gemini_query_response_tts(welcome_message)
        return jsonify({"message": "TTS started", 'status': 'success'}), 200
    except Exception as e:
        print(f"Greeting Error: {e}")
        return jsonify({'error': str(e), 'status': 'error'}), 500

if __name__ == '__main__':
    app.run(debug=True) 