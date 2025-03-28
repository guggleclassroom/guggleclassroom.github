import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqwTKgstyRCZwHoDIhMhgHSRKBKzASMR8",
  authDomain: "cosmo-c821b.firebaseapp.com",
  databaseURL: "https://cosmo-c821b-default-rtdb.firebaseio.com",
  projectId: "cosmo-c821b",
  storageBucket: "cosmo-c821b.firebasestorage.app",
  messagingSenderId: "285432006631",
  appId: "1:285432006631:web:be038b5384406fd30a1f42",
  measurementId: "G-QZQ3JMT1YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Send message to Firebase
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    push(messagesRef, { text: message });
    messageInput.value = "";

    // Track "Message Sent" event in Google Analytics
    gtag('event', 'message_sent', {
      'event_category': 'chat',
      'event_label': message,
      'value': 1
    });
  }
});

// Listen for new messages
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.textContent = data.text;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
});

// Google Analytics setup (assuming you already have the script included)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-84X34T5QFM');
