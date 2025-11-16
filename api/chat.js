export default async function handler(req, res) {
    const { message } = req.body;
    const q = message.toLowerCase();

    const API_KEY = process.env.GROQ_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ reply: "API key missing!" });
    }


    const hardcoded = {
        "who made you": "I was proudly created by Mr Hillol Dutta Chaudhury also known as Xylo!",
        "who created you": "I was made by Mr Hillol Dutta Chaudhury also known as Xylo!",
        "what is your name": "My name is XyloAI!",
        "your name": "I'm XyloAI!",
        "hi": "Hi! How can I help?",
        "hello": "Hello! What's up?",
        "bye": "Bye! Have a nice day!",
        "good morning": "Good morning!",
        "good night": "Good night!",
        "who are you": "I'm XyloAI, your smart assistant!"
    };

    for (let key in hardcoded) {
        if (q.includes(key)) {
            return res.status(200).json({ reply: hardcoded[key] });
        }
    }


    async function tryMath(text) {
        try {
            const r = await fetch(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(text)}`);
            return await r.text();
        } catch {
            return null;
        }
    }

    const mathAnswer = await tryMath(q);
    if (!isNaN(mathAnswer) && mathAnswer !== null) {
        return res.status(200).json({ reply: mathAnswer.toString() });
    }


    async function weather(city) {
        try {
            const r = await fetch(`https://wttr.in/${city}?format=j1`);
            const data = await r.json();
            const temp = data.current_condition?.[0]?.temp_C;
            const area = data.nearest_area?.[0]?.areaName?.[0]?.value;
            if (temp && area) return `Weather in ${area}: ${temp}°C`;
        } catch {}
        return null;
    }

    if (q.includes("weather in") || q.includes("temperature in")) {
        const city = q.replace("weather in", "").replace("temperature in", "").trim();
        const w = await weather(city);
        if (w) return res.status(200).json({ reply: w });
    }


    async function duck(text) {
        try {
            const r = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(text)}&format=json&no_redirect=1`);
            const data = await r.json();
            if (data.AbstractText) return data.AbstractText;
        } catch {}
        return null;
    }

    const ddg = await duck(message);
    if (ddg) return res.status(200).json({ reply: ddg });


    async function ask(model) {
        try {
            const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: "system", content: "You are XyloAI v3.0, a friendly and smart assistant." },
                        { role: "user", content: message }
                    ]
                })
            });

            const data = await r.json();
            return data.choices?.[0]?.message?.content;
        } catch {
            return null;
        }
    }

    let reply = await ask("llama-3.1-70b-versatile");
    if (!reply) reply = await ask("llama-3.1-8b-instant");
    if (!reply) reply = await ask("llama-3.1-7b-instant");
    if (!reply) reply = "Sorry, I don't know that yet..";

    return res.status(200).json({ reply });
}
