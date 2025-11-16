
const API_URL = "https://xyloai.vercel.app/api/ai";

const inputBox = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");

sendBtn.addEventListener("click", sendMessage);
inputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function addMessage(who, msg) {
    const div = document.createElement("div");
    div.className = who === "ai" ? "aiMsg" : "userMsg";
    // allow **bold** to work
    div.innerHTML = msg.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function sendMessage() {
    let text = inputBox.value.trim();
    if (text === "") return;

    addMessage("user", text);
    inputBox.value = "";
    askAI(text);
}

async function askAI(question) {
    addMessage("ai", "Thinking...");

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: question })
        });

        const data = await res.json();

    
        chatArea.removeChild(chatArea.lastChild);

        if (data.answer) {
            addMessage("ai", data.answer);
        } else {
            addMessage("ai", "Sorry, I didn't get that.");
        }

    } catch (err) {
        console.error(err);

        // remove “Thinking...” bubble
        chatArea.removeChild(chatArea.lastChild);

        addMessage("ai", "Oops! Something went wrong.");
    }
            }
