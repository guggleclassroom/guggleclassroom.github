const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Initialize Firebase Admin SDK using environment variables for credentials
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  console.log("Firebase Admin initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  process.exit(1); // Exit the process if initialization fails
}

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for authentication
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      req.user = decodedToken;
      next();
    })
    .catch(error => {
      console.error('Authentication error:', error);
      res.status(401).send('Unauthorized');
    });
}

// Serve the admin panel
app.get('/admin', (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      const uid = decodedToken.uid;
      return admin.database().ref('admins/' + uid).once('value');
    })
    .then(snapshot => {
      if (snapshot.exists()) {
        res.sendFile(path.join(__dirname, 'public', 'admin.html'));
      } else {
        res.status(403).send('Forbidden');
      }
    })
    .catch(error => {
      console.error('Error verifying token or checking admin:', error);
      res.status(500).send('Internal server error');
    });
});

// Handle chat route
app.post('/api/chat', authenticate, (req, res) => {
  const { roomId, senderId, message } = req.body;

  if (!roomId || !senderId || !message) {
    return res.status(400).send('Missing required fields');
  }

  const messagesRef = admin.database().ref('messages/' + roomId);
  const newMessage = messagesRef.push();
  newMessage.set({
    senderId,
    message,
    timestamp: new Date().toISOString()
  }).then(() => {
    res.status(200).send('Message sent!');
  }).catch(error => {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
