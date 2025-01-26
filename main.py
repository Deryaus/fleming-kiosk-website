"""
Description:
 Main program for Fleming kiosk webpage

Usage:
 python main.py

Parameters:
 None
"""

from flask import Flask, render_template, jsonify, request
from helloworld import helloworld, testaudio


app = Flask(__name__)

# Routes
@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/home')
def home():
    return render_template('home.html') 

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '') # Default value is empty string
    response = helloworld(user_input)
    return jsonify({'response': response})

@app.route('/record-audio', methods=['POST'])
def record_audio():
    userInput, output = testaudio()
    return jsonify({
        'userInput': userInput,
        'output': output
        })


if __name__ == '__main__':
    app.run(debug=True) 