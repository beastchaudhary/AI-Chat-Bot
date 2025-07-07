// ✅ JavaScript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const btn = document.querySelector("#listen-btn");

btn.addEventListener("click", function () {
  // Allow window.open only within this click
  let allowWindowOpen = true;

  // Speak function
  function speak(text, callback) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = callback;
    window.speechSynthesis.speak(utterance);
  }

  // Handle commands
  function handleCommand(command) {
    const openAndSpeak = (url, name) => {
      if (allowWindowOpen) {
        window.open(url, "_blank");
        allowWindowOpen = false;
      }
      speak(`Opening ${name}...`);
    };

    if (command.includes("open youtube")) {
      openAndSpeak("https://www.youtube.com", "YouTube");
    } else if (command.includes("open google")) {
      openAndSpeak("https://www.google.com", "Google");
    } else if (command.includes("open facebook")) {
      openAndSpeak("https://www.facebook.com", "Facebook");
    } else if (command.includes("open instagram")) {
      openAndSpeak("https://www.instagram.com", "Instagram");
    } else if (command.includes("open whatsapp")) {
      openAndSpeak("https://www.whatsapp.com", "WhatsApp");
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(command)}`;
      if (allowWindowOpen) {
        window.open(searchUrl, "_blank");
        allowWindowOpen = false;
      }
      speak(`Searching Google for ${command}`);
    }

    //timer
    setTimeout(() => {
      btn.innerHTML = "Start Listening";
      btn.classList.remove("listening");
    }, 5000); // 5-second delay
  }

  // Start recognition after greeting
  speak("Hello, how can I help you?", () => {
    btn.innerHTML = "Listening...👂";
    btn.classList.add("listening");
    recognition.start();
  });

  // On result
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log("Heard:", command);
    handleCommand(command);
  };

  // On end — no need to reset button here due to timer
  recognition.onend = () => {
    console.log("Recognition ended.");
  };

  // On error
  recognition.onerror = (e) => {
    console.error("Speech recognition error:", e.error);
    speak("Sorry, I couldn't hear you. Please try again.");
    btn.innerHTML = "Start Listening";
    btn.classList.remove("listening");
  };
});
