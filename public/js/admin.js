import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

const auth = getAuth();
const db = getDatabase();

// Admin login logic
document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Admin logged in");
    } catch (error) {
        console.error("Error logging in:", error.message);
    }
});

// Monitor auth state (to show/hide admin dashboard)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Check if user is admin (by checking user email in Firebase Realtime Database)
        checkIfAdmin(user.email);
    } else {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("admin-dashboard").style.display = "none";
    }
});

// Function to check if the logged-in user is an admin
async function checkIfAdmin(email) {
    const adminsRef = ref(db, 'admins/' + email);
    const snapshot = await get(adminsRef);
    if (snapshot.exists() && snapshot.val() === true) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        loadUsers(); // Load users to admin dashboard
    } else {
        console.log("Not an admin");
        alert("You do not have admin privileges.");
    }
}

// Load all users into the admin dashboard
async function loadUsers() {
    const usersRef = ref(db, 'users/');
    const snapshot = await get(usersRef);
    const users = snapshot.val();
    const table = document.getElementById("user-table");
    table.innerHTML = ""; // Clear previous data

    for (const userId in users) {
        const user = users[userId];
        const row = table.insertRow();
        row.insertCell(0).textContent = user.email;
        row.insertCell(1).textContent = user.role;
        const deleteBtn = row.insertCell(2).appendChild(document.createElement("button"));
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteUser(userId));
    }
}

// Delete user logic
async function deleteUser(userId) {
    try {
        await remove(ref(db, 'users/' + userId));
        console.log("User deleted");
        loadUsers(); // Refresh user list
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

// Logout function
document.getElementById("logout-btn").addEventListener("click", async () => {
    await signOut(auth);
});
