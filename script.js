
const API_URL = "https://xyloai.vercel.app/api/chat.js";

const inputBox = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");

sendBtn.addEventListener("click", sendMessage);
inputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function addMsg(who, msg) {
    let div = document.createElement("div");
    div.className = who === "ai" ? "aiMsg" : "userMsg";
    div.innerHTML = msg.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function sendMessage() {
    let text = inputBox.value.trim();
    if (!text) return;

    addMsg("user", text);
    inputBox.value = "";
    askAI(text);
}

async function askAI(question) {
    addMsg("ai", "Thinking...");

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });

        const data = await res.json();

        chatArea.removeChild(chatArea.lastChild);

        if (data.answer) addMsg("ai", data.answer);
        else addMsg("ai", "Sorry, I didn't get that.");

    } catch (e) {
        console.log(e);
        chatArea.removeChild(chatArea.lastChild);
        addMsg("ai", "Error talking to server.");
    }
}
