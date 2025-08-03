let database = {};

fetch("database.json")
  .then((res) => res.json())
  .then((data) => {
    database = data;
  });

function sendMessage() {
  const inputField = document.getElementById("userInput");
  const message = inputField.value.trim().toLowerCase();
  if (!message) return;

  appendMessage("user", message);
  inputField.value = "";

  let reply = "Sorry, this keyword is not present in my database.";

  for (const keyword in database) {
    if (message.includes(keyword)) {
      reply = database[keyword];
      break;
    }
  }

  setTimeout(() => {
    appendMessage("bot", reply);
  }, 500);
}

function appendMessage(sender, text) {
  const chatbox = document.getElementById("chatbox");
  const msg = document.createElement("div");
  msg.className = sender;
  msg.innerText = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}
