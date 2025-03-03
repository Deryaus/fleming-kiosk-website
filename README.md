# Fleming Kiosk 

## Description
This **AI-powered Interactive Kiosk** was developed by the **Computer Engineering Technology** students at
**Fleming College** in its final year. It provides students and visitors with a seamless way to access information about the college
using a conversational AI.

The Kiosk leverages a **fine-tuned Gemini model** trained with **local knowledge** about Fleming College, allowing users
to interact with it to answer questions.

## Key Features:

- 🧠 **AI Assistant** – Interact with a locally optimized AI trained on Fleming College information.  
- 🗺 **Campus Map** – Easily navigate around campus.  
- ❓ **FAQs** – Get quick answers to common questions.  
- 🎮 **Multiple-Choice Game** – Engage with a fun educational quiz.  
- 📅 **Event Schedule** – Stay updated on Fleming SAQ events.  

## Tech Stack
  * **Flask** - Backend framework for the web application
  *  **Hypercorn & Nginx** - Deployment on a linux OS for high-performance hosting.

## Screenshots
![Screenshot](/static/images/welcome_screen.png)

## Table of Contents
- [Usage](#usage)
- [Installation](#installation)
- [Configuration](#configuration)


## Usage

### Welcome Video
- Upon launching the kiosk, a welcome video plays automatically
- Video transitions to Campus Map section when finished
- Can be skipped by clicking any navigation button

### Navigation
- Use the top navigation buttons to access different sections:
  - Campus Map
  - Event Schedule
  - FAQs
  - Chat With Blaze
  - Play A Game

### Campus Map
- View maps of Fleming campuses
- Toggle between Sutherland and Frost campuses
- Access upper/lower level views for Frost campus

### Event Schedule
- Browse upcoming Fleming SAC events
- View event details and images
- Scan QR code for more information

### FAQs
- Browse common questions about Fleming College
- Get instant answers from Blaze the Fleming College Mascot

### Chat with Blaze
- Interactive chat with Blaze Flemings AI assistant
- Support for both text and voice input

### Interactive Quiz
- Test your knowledge about Fleming College
- Multiple-choice questions covering:
  - College history
  - Campus information
  - Student services
  - Sir Sandford Fleming facts


## Installation 

### For Installation instructions on Ubuntu
Please see: [Ubuntu Configuration](docs/ubuntu_configuration.md)



## Configuration
### How to Add or Remove Questions from the Quiz JSON File
Please see: [Add or Remove Quiz questions](docs/How_to_add_or_remove_questions.md)

