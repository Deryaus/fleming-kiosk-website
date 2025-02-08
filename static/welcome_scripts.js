function welcomeTTSGreeting() {
    window.location.href = "home";
    // TODO: Call tts for greeting/fact 
    fetch('/greeting', {
        method: "POST",
    })
    .then(response => response.json())
    .then(data => console.log(data.message))  // Logs "TTS started"
    .catch(error => console.error("Error:", error));
}