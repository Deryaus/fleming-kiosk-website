function welcomeTTSGreeting() {
    // Make TTS request
    fetch('/tts', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        // Always redirect after 1 second, regardless of TTS success/failure
        setTimeout(() => {
            window.location.href = "home";
        }, 1000);
    });
}