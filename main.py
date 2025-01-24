"""
Description:
 Main program for Fleming kiosk webpage

Usage:
 python main.py

Parameters:
 None
"""

from flask import Flask, render_template

app = Flask(__name__)

# Routes

@app.route('/')
def welcome():
    return render_template('welcome.html')


@app.route('/home')
def home():
    return render_template('home.html') 

if __name__ == '__main__':
    app.run(debug=True) 