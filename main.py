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


app = Flask(__name__)

# Routes
@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/home')
def home():
    return render_template('home.html') 

@app.route('/chat', methods=['POST'])
async def chat():
    user_input = request.json.get('message', '') # Default value is empty string
    #speech, response = await gemini_query_response_tts(user_input)
    response = query_gemini_model(11, user_input)
    return jsonify({'response': response.text})

@app.route('/record-audio', methods=['POST'])
async def record_audio():
    user_input, output = await gemini_query_response_tts()
    return jsonify({ 
        'user_input': user_input,
        'output': output
        })


if __name__ == '__main__':
    app.run(debug=True) 