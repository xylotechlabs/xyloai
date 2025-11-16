function addMsg(who, text) {
    let chat = document.getElementById("chat");
    let div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `<b>${who}:</b> ${text}`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

async function sendMsg() {
    let box = document.getElementById("input");
    let text = box.value.trim();
    if (text === "") return;

    addMsg("You", text);
    box.value = "";

    let r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
    });

    let data = await r.json();
    addMsg("XyloAI", data.reply);
}

document.getElementById("input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        sendMsg();
    }
});
