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

@app.route('/tts', methods=['POST'])
def tts():
    try:
        welcome_message = "Say Welcome to Fleming College, Then tell me a random fact about Sir Sandford Fleming The Person"
        gemini_query_response_tts(welcome_message)
        return jsonify({"message": "TTS started", 'status': 'success'}), 200
    except Exception as e:
        print(f"Greeting Error: {e}")
        return jsonify({'error': str(e), 'status': 'error'}), 500

if __name__ == '__main__':
    app.run(debug=True) 