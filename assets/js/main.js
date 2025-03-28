document.addEventListener("DOMContentLoaded", function() {
  // Navigation: Map sidebar icons to sections
  const sections = {
    home: document.getElementById("home-section"),
    games: document.getElementById("games-section"),
    chat: document.getElementById("chat-section")
    // Proxy section can be added later
  };

  // Initially, show the Home section
  showSection("home");

  function showSection(sectionName) {
    Object.keys(sections).forEach(key => {
      if (key === sectionName) {
        sections[key].classList.add("active");
      } else {
        sections[key].classList.remove("active");
      }
    });
  }

  // Event listeners for sidebar icons
  document.getElementById("nav-home").addEventListener("click", () => showSection("home"));
  document.getElementById("nav-games").addEventListener("click", () => showSection("games"));
  document.getElementById("nav-chat").addEventListener("click", () => showSection("chat"));

  // Draggable Chat Window
  const chatWindow = document.getElementById("chat-window");
  const closeButton = document.getElementById("close-chat");
  const sendMessageButton = document.getElementById("send-message");
  const chatInput = document.getElementById("chat-input");

  if (chatWindow) {
    const header = chatWindow.querySelector(".chat-header");

    // Make the chat window draggable
    makeDraggable(chatWindow, header);

    // Close chat window functionality
    closeButton.addEventListener("click", function() {
      chatWindow.style.display = "none";
    });
  }

  // Toggle chat window with "C" key
  document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "c") {
      if (chatWindow) {
        chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
      }
    }
  });

  // Send message functionality
  if (sendMessageButton && chatInput) {
    sendMessageButton.addEventListener("click", function() {
      const message = chatInput.value;
      if (message.trim() !== "") {
        const newMessage = document.createElement("p");
        newMessage.textContent = "User: " + message;  // Replace "User" with actual username
        document.getElementById("chat-content").appendChild(newMessage);
        chatInput.value = ""; // Clear input
      }
    });
  }

  function makeDraggable(element, header) {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    header.addEventListener("mousedown", function(e) {
      isDragging = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
    });

    document.addEventListener("mousemove", function(e) {
      if (isDragging) {
        element.style.left = (e.clientX - offsetX) + "px";
        element.style.top = (e.clientY - offsetY) + "px";
      }
    });

    document.addEventListener("mouseup", function() {
      isDragging = false;
    });
  }
});
