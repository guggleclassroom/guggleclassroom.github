import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
import { 
  getDatabase, ref, set, get, remove 
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqwTKgstyRCZwHoDIhMhgHSRKBKzASMR8",
  authDomain: "cosmo-c821b.firebaseapp.com",
  databaseURL: "https://cosmo-c821b-default-rtdb.firebaseio.com",
  projectId: "cosmo-c821b",
  storageBucket: "cosmo-c821b.appspot.com",
  messagingSenderId: "285432006631",
  appId: "1:285432006631:web:be038b5384406fd30a1f42",
  measurementId: "G-84X34T5QFM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Check if user is admin
function checkAdmin(user) {
  return get(ref(db, `admins/${user.uid}`)).then(snapshot => snapshot.exists());
}

// Handle signup
document.getElementById('signup-form')?.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, username + "@example.com", password)
    .then((userCredential) => {
      const user = userCredential.user;
      return set(ref(db, `users/${user.uid}`), {
        username: username,
        role: "user"
      }).then(() => {
        alert("Signup successful!");
        window.location.href = "library.html";
      });
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});

// Handle login
document.getElementById('login-form')?.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, username + "@example.com", password)
    .then(() => {
      alert("Login successful");
      window.location.href = "library.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});

// Handle logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

// Show admin panel link in library.html if user is admin
onAuthStateChanged(auth, (user) => {
  if (user) {
    checkAdmin(user).then(isAdmin => {
      const adminLink = document.getElementById("admin-link");
      if (adminLink) {
        adminLink.classList.toggle("hidden", !isAdmin);
      }
    });

    set(ref(db, `activeUsers/${user.uid}`), {
      username: user.displayName || "Unknown",
      lastActive: Date.now()
    });
  } else {
    const adminLink = document.getElementById("admin-link");
    if (adminLink) {
      adminLink.classList.add("hidden");
    }
    remove(ref(db, `activeUsers/${auth.currentUser?.uid}`));
  }
});
