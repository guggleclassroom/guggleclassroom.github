const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./assets/cosmo-c821b-firebase-adminsdk-fbsvc-2e66c25610.json')),
  databaseURL: 'https://cosmo-c821b.firebaseio.com'
});

app.use(express.static(path.join(__dirname, 'public')));

// Serve the admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
