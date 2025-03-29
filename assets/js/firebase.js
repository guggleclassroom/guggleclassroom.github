import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqwTKgstyRCZwHoDIhMhgHSRKBKzASMR8",
  authDomain: "cosmo-c821b.firebaseapp.com",
  databaseURL: "https://cosmo-c821b-default-rtdb.firebaseio.com",
  projectId: "cosmo-c821b",
  storageBucket: "cosmo-c821b.appspot.com",
  messagingSenderId: "285432006631",
  appId: "1:285432006631:web:be038b5384406fd30a1f42",
  measurementId: "G-QZQ3JMT1YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user);
  } else {
    console.log("User logged out");
  }
});

// Sign up function
function signUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed up:", user);
      
      // Store user info in the database
      set(ref(db, "users/" + user.uid), {
        email: user.email,
        uid: user.uid
      }).catch((error) => console.error("Error saving user data:", error.message));
    })
    .catch((error) => {
      console.error("Error signing up:", error.message);
    });
}

// Sign in function
function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed in:", user);
    })
    .catch((error) => {
      console.error("Error signing in:", error.message);
    });
}

// Sending messages
function sendGroupMessage(roomId, senderId, message) {
  const messagesRef = push(ref(db, "messages/" + roomId));
  
  set(messagesRef, {
    senderId,
    message,
    timestamp: new Date().toISOString()
  })
  .then(() => console.log("Message sent"))
  .catch((error) => console.error("Error sending message:", error.message));
}

// Listening for messages
function listenForNewMessages(roomId) {
  const messagesRef = ref(db, "messages/" + roomId);
  onChildAdded(messagesRef, (snapshot) => {
    const newMessage = snapshot.val();
    if (!newMessage) return;

    console.log("New message:", newMessage);
    updateChatUI(newMessage);
  });
}

// Update chat UI
function updateChatUI(newMessage) {
  const chatContent = document.getElementById("chat-content");
  if (!chatContent) return; // Prevent errors if chat-content doesn't exist

  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  const senderName = newMessage.senderId || "Guest"; 

  messageElement.innerHTML = `
    <span class="sender">${senderName}:</span>
    <span class="message-text">${newMessage.message}</span>
    <span class="timestamp">${new Date(newMessage.timestamp).toLocaleTimeString()}</span>
  `;

  chatContent.appendChild(messageElement);
  chatContent.scrollTop = chatContent.scrollHeight; // Auto-scroll to newest message
}

export { signUp, signIn, sendGroupMessage, listenForNewMessages };
