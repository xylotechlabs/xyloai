
const hardcodedReplies = {
    "hi": "Hello! How can I help?",
    "hello": "Hi there!",
    "hey": "Hey! What’s up?",
    "who made you": "I was created by Mr. Hillol Dutta Chaudhury also known as Xylo",
    "what is your name": "My name is XyloAI!",
    "who are you": "I am XyloAI, a small smart assistant!",
    "how are you": "I'm fine! Thanks for asking.",
    "bye": "Goodbye! See you later!",
    "thanks": "You're welcome!",
    "thank you": "No problem!",
    "good morning": "Good morning!",
    "good night": "Good night!",
    "ok": "Okay!",
    "who created you": "I was made by Mr. Hillol Dutta Chaudhury also known as Xylo!",
    "who is your owner": "Mr. Hillol Dutta Chaudhury also known as Xylo owns me!",
    "are you real": "I am a virtual assistant, so kind of!",
    "do you love me": "Haha! I like everyone!",
    "what can you do": "I can answer questions, do programming, do math, search info, and more!"
};


function matchHardcodedReply(question) {
    const q = " " + question.toLowerCase().replace(/[^a-z0-9\s]/g, "") + " ";

    for (const key in hardcodedReplies) {
        const cleanKey = " " + key.toLowerCase().replace(/[^a-z0-9\s]/g, "") + " ";

        if (q.includes(cleanKey)) {
            return hardcodedReplies[key];
        }
    }

    return null;
}



async function tryMath(question) {
    try {
        if (/[0-9+\-*/()%]/.test(question)) {
            return math.evaluate(question).toString();
        }
    } catch (e) {}
    return null;
}


async function tryDuckAPI(q) {
    try {
        const res = await fetch(
            "https://api.duckduckgo.com/?q=" + encodeURIComponent(q) + "&format=json&no_redirect=1&no_html=1"
        );
        const data = await res.json();

        if (data.Abstract && data.Abstract.length > 0) {
            return data.Abstract;
        }

        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            if (data.RelatedTopics[0].Text) {
                return data.RelatedTopics[0].Text;
            }
        }

        return null;
    } catch (err) {
        return null;
    }
}



async function askGroq(prompt) {
    const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: prompt })
    });

    const data = await res.json();
    return data.reply || null;
}



async function askXyloAI() {
    const input = document.getElementById("question");
    const chat = document.getElementById("chat");

    const question = input.value.trim();
    if (question === "") return;

    // Show user message
    chat.innerHTML += `<div class="user">You: ${question}</div>`;
    chat.scrollTop = chat.scrollHeight;

    input.value = "";

  
    const hard = matchHardcodedReply(question);
    if (hard) {
        chat.innerHTML += `<div class="bot">AI: ${hard}</div>`;
        chat.scrollTop = chat.scrollHeight;
        return;
    }

  
    const mathAns = await tryMath(question);
    if (mathAns) {
        chat.innerHTML += `<div class="bot">AI: ${mathAns}</div>`;
        chat.scrollTop = chat.scrollHeight;
        return;
    }


    const duckAns = await tryDuckAPI(question);
    if (duckAns) {
        chat.innerHTML += `<div class="bot">AI: ${duckAns}</div>`;
        chat.scrollTop = chat.scrollHeight;
        return;
    }

    const aiAns = await askGroq(question);
    if (aiAns) {
        chat.innerHTML += `<div class="bot">AI: ${aiAns}</div>`;
        chat.scrollTop = chat.scrollHeight;
        return;
    }

    chat.innerHTML += `<div class="bot">AI: Sorry, I don't know that yet.</div>`;
    chat.scrollTop = chat.scrollHeight;
}


document.getElementById("question").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        askXyloAI();
    }
});
