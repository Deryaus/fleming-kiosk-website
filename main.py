"""
Description:
 Main program for Fleming kiosk webpage

Usage:
 python main.py

Parameters:
 None
"""

from flask import Flask, render_template, jsonify, request, redirect, url_for
from geminiQuery import gemini_query_response_tts, query_gemini_model
from events import get_all_events
from text_to_speech import play_edge_tts
from apscheduler.schedulers.background import BackgroundScheduler
import csv


app = Flask(__name__)

#Scheduling grabbing the SAC calender image from the website once per day
scheduler = BackgroundScheduler()
scheduler.add_job(get_all_events, 'interval', days=1)
scheduler.start()
try:
    get_all_events()
except Exception as e:
    print(f"Error getting events: {e}")

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
        response = query_gemini_model(11, user_input)
        try:
            return jsonify({'response': response.text})
        except AttributeError:
            return jsonify({'response': 'Sorry, I cannot provide an answer to that question.'})
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
        print(f"Audio record Error: {e}")
        return jsonify({'error': 'Sorry there was a problem with your request'}), 500

#TODO: Create questions for FAQ 

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
        play_edge_tts("Welcome To Fleming College")
        return jsonify({"message": "TTS started", 'status': 'success'}), 200
    except Exception as e:
        print(f"Greeting Error: {e}")
        return jsonify({'error': str(e), 'status': 'error'}), 500

@app.route('/quiz-tts', methods=['POST'])
def quiz_tts():
    """
    Endpoint to handle Text-to-Speech (TTS) for quiz questions.

    This function receives a POST request with a JSON payload containing a 'question'.
    It then uses the play_edge_tts function to convert the question text to speech.

    Returns:
        JSON response indicating the status of the TTS operation.
        - On success: {"message": "TTS started", 'status': 'success'}, HTTP status code 200.
        - On failure: {'error': str(e), 'status': 'error'}, HTTP status code 500.

    """
    try:
        if 'question' in request.json:
            text = request.json.get('question')
        elif 'answer' in request.json:
            text = request.json.get('answer')
    except Exception as e:
        print(f"Quiz TTS Error: {e}")
        return jsonify({'error': str(e), 'status': 'error'}), 500

    try:
        play_edge_tts(str(text))
        return jsonify({"message": "TTS started", 'status': 'success'}), 200
    except Exception as e:
        print(f"Quiz TTS Error: {e}")
        return jsonify({'error': str(e), 'status': 'error'}), 500
    

# Handle form submission
@app.route('/submit', methods=['POST'])
def submit():
    """
    Handles form submission by extracting user data from the request,
    saving it to a CSV file, and returning a success message.
    Extracts the following fields from the form:
    - name: The name of the user
    - email: The email address of the user
    - program: The program the user is interested in
    Saves the extracted data to 'Logs/user_data.csv'.
    Returns:
        tuple: A success message and HTTP status code 200.
    """
    name = request.form['name']
    email = request.form['email']
    program = request.form['program']

    # Save to CSV file
    with open('Logs/user_data.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([name, email, program])
 
    return "Form submitted!", 200 #rethink how to do this part

if __name__ == '__main__':
    app.run(debug=True) 