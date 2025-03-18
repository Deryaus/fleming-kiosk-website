# Program Functionality Guide

## main.py

[main.py](../main.py) is the main file for the project. It is executed on startup to run the Flask webserver on which the rest of the program is built on. The flask webserver is hostedn on the localhost port 5000.

This file serves a few functions.

1. Schedules background tasks for retrieving information from the web.
2. Runs the Flask web server and renders html templates
3. Contains Flask function routes that can be used to call python functions

### Flask Routing

[Flask routing](https://flask.palletsprojects.com/en/stable/quickstart/#Routing) is a method used in the kiosk for calling python functionality through JavaScript linked to our front-end web interface. The **@app.route()** decorator is used to specify a URL link that information can be sent to using JavaScript in order to trigger a function in the **main.py** python file.

For Example,

```javascript
fetch("/tts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
});
```

This calls the '/tts' route in the main.py file, triggering that python function.

## Templates and Styles

There are two main HTML template files that are used to render the web pages. These two pages are `welcome.html`and `home.html`. The `Info_collection.html` and `event_div.html` are unused currently. `Info_collection.html` is a prototype of the information form used to gather user info and `event_div.html` is used to store event information ripped from the SAC website.

### welcome.html

[welcome.html](../templates/welcome.html) is used to display the welcome page that appears on the startup of the application. Upon clicking the "Get Started" button, a JavaScript function is called to trigger a tts greeting and redirect the use to the home page The JavaScript linked is in the `welcome_scripts.js` file.

### home.html

[home.html](../templates/home.html) contains the main functionality of the program. It allows users to navigate through the various content sections hosted on the page. The JavaSript used is linked to the `home_scripts.js` file. The Navigation bar at the top is used to switch between content sections. This is done through the `showContentSection()` function. This function works by displaying the associated 'content-section' div in the bottom section of the page.

Adding more content sections can be done through this nav bar and creating a content section div with a corresponding div id tag.

**Ex.**

```html
<div class="button-container">
  <button class="btn" onclick="showSection('map-section')">Campus Map</button>
</div>
```

**Nav bar button.**

```html
<div id="map-section" class="content-section"></div>
```

**The div with the corresponding id tag.**

## JavaScript

### welcome_scripts.js

[welcome_scripts.js](../static/js/welcome_scripts.js) contains the JavaScript code that is executed on the welcome page. This script is responsible for handling user interactions and triggering specific actions when the user interacts with the welcome page.

Key functionalities include:

1. **Text-to-Speech (TTS) Greeting**: When the "Get Started" button is clicked, a TTS greeting is triggered to welcome the user.
2. **Redirection**: After the TTS greeting, the user is redirected to the home page.
3. **Event Listeners**: The script sets up event listeners for user interactions on the welcome page.

Example of the TTS greeting and redirection:

```javascript
document
  .getElementById("get-started-btn")
  .addEventListener("click", function () {
    fetch("/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: "Welcome to the kiosk!" }),
    }).then(() => {
      window.location.href = "/home";
    });
  });
```

### home_scripts.js

[home_scripts.js](../static/js/home_scripts.js) contains the JavaScript code that is executed on the home page. This script is responsible for managing the dynamic content and user interactions on the home page.

Key functionalities include:

1. **Content Section Navigation**: Handles the navigation between different content sections on the home page. This is achieved through the `showContentSection()` function, which displays the relevant content section based on the user's selection.
2. **Event Listeners**: Sets up event listeners for various interactive elements on the home page, such as buttons and links.
3. **Dynamic Content Loading**: Manages the loading and updating of dynamic content within the content sections, ensuring that the displayed information is current and relevant.
4. **User Interaction Handling**: Processes user inputs and interactions, providing a responsive and interactive user experience.
5. **On Screen Keyboard**: Implements an on-screen keyboard for user input. This feature is particularly useful for touch screen interfaces where a physical keyboard may not be available. The on-screen keyboard allows users to input text directly into form fields or other input elements on the home page.

### Quiz Game

Located within `home_scripts.js` is the Quiz Game functionality. There are a series of functions that outline the gameplay; `startQuiz()`, `showQuestion`, `checkAnswer()`, `nextQuestion`, `playAgain`, and `shuffleQuestion()`. Docstrings in the file indicate the use of the functions.

### FAQ

In the `home_scripts.js` file are the FAQ functions.
