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

- **[Flask](https://flask.palletsprojects.com/en/stable/)** - Backend framework for the web application
- **[Hypercorn](https://hypercorn.readthedocs.io/en/latest/) & [Nginx](https://nginx.org/en/docs/)** - Deployment on a linux OS for high-performance hosting.

## Screenshots

![Screenshot](/static/images/welcome_screen.png)

## Table of Contents

- [Usage](#usage)
- [Installation](#installation)
- [Configuration](#configuration)
- [File Structure and Operation](#File-Structure-and-Functionality) -[AI Functionality and Training]

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

Please see: [Ubuntu Configuration](docs/Ubuntu_configuration.md)

### For restricting USB Access

Please see: [Restrict USB](docs/restrict_usb_devices.md)

## Configuration

### How to Add or Remove Questions from the Quiz JSON File

Please see: [Add or Remove Quiz questions](docs/How_to_add_or_remove_quiz_questions.md)

### How to Add or Remove FAQ from the JSON File

Please see: [Add or Remove FAQ qestions](docs/Add_or_remove_FAQ.md)

### Training the AI

TODO: Training the AI instructions

## File Structure and Functionality

### File Structure

The Fleming Kiosk file structure follows the required hierarchy as described in the [Flask documentation](https://flask.palletsprojects.com/en/stable/quickstart/).

All python script files are hosted in the main project folder.

The [static](https://flask.palletsprojects.com/en/stable/quickstart/#static-files) folder is used to hold all of the static resource files. This includes **CSS**, **JSON**, **JavaScript (js)**, **Videos**, **Images** and more.

The **Logs** folder stores records of operational data. This includes a record of AI chats (AIChatLog.txt), the Training data for the AI (Training Q&A - Sheet1.csv), and the collected user information (user_data.csv).

The **docs** folder contains information regarding the moodification and installation of the Fleming Kiosk software and requirements.

The **templates** folder contains the HTML templates for the webpages to be rendered through Flask.

### Functionality

Please see: [Functionality Guide](docs/Functionality_guide.md) for an in depth breakdown of the program operation.

## AI Functionality and Training Guide

Please see: [AI Functionality and Training Guide](docs/AI_Functionality_and_Training_Guide.md) for an in depth breakdown of the AI operation.
