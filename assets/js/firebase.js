import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, push, onChildAdded } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // Use environment variables for sensitive keys
  authDomain: "cosmo-c821b.firebaseapp.com",
  databaseURL: "https://cosmo-c821b-default-rtdb.firebaseio.com",
  projectId: "cosmo-c821b",
  storageBucket: "cosmo-c821b.appspot.com",
  messagingSenderId: "285432006631",
  appId: "1:285432006631:web:be038b5384406fd30a1f42",
  measurementId: "G-84X34T5QFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// Auth state listener to handle user session
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user);
    // You can use this to display the UI for the logged-in user, etc.
  } else {
    console.log('User logged out');
    // Handle UI updates for logged-out state (e.g., show login button)
  }
});

// Example for signing up and signing in
function signUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User signed up:', user);
      // Optionally, store user info in the database
      set(ref(db, 'users/' + user.uid), {
        email: user.email,
        uid: user.uid,
      });
    })
    .catch((error) => {
      console.error('Error signing up:', error.message);
    });
}

function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User signed in:', user);
    })
    .catch((error) => {
      console.error('Error signing in:', error.message);
    });
}

// Example for sending and receiving chat messages
function sendGroupMessage(roomId, senderId, message) {
  const messagesRef = ref(db, 'messages/' + roomId);
  const newMessageKey = push(messagesRef).key;
  set(ref(db, 'messages/' + roomId + '/' + newMessageKey), {
    senderId,
    message,
    timestamp: new Date().toISOString(),
  }).then(() => {
    console.log('Message sent');
  }).catch((error) => {
    console.error('Error sending message:', error.message);
  });
}

function listenForNewMessages(roomId) {
  const messagesRef = ref(db, 'messages/' + roomId);
  onChildAdded(messagesRef, (snapshot) => {
    const newMessage = snapshot.val();
    console.log('New message:', newMessage);
    // Update the chat UI here by appending newMessage to the chat window
    updateChatUI(newMessage);
  });
}

function updateChatUI(newMessage) {
  const chatContent = document.getElementById('chat-content');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `
    <span class="sender">${newMessage.senderId}:</span>
    <span class="message-text">${newMessage.message}</span>
    <span class="timestamp">${new Date(newMessage.timestamp).toLocaleTimeString()}</span>
  `;
  chatContent.appendChild(messageElement);
}

