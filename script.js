document.getElementById("askBtn").addEventListener("click", ask);
document.getElementById("q").addEventListener("keydown", function(e) {
  if (e.key === "Enter") ask();
});

async function ask() {
  const q = document.getElementById('q').value.trim().toLowerCase();
  const reply = document.getElementById('reply');
  if (!q) return reply.textContent = "Please type a question first.";
  reply.textContent = "Thinking...";

  // emotion-based quick replies
  const emotionReplies = {
    "hi": "Hi there! How can I help you today?",
    "hello": "Hello! How can I help you today?",
    "hey": "Hey! What’s up?",
    "yes": "Yes, absolutely!",
    "no": "Nope",
    "thanks": "You're welcome!",
    "thank you": "Glad to help!",
    "sorry": "No worries 💫",
    "idk": "That’s okay! Let’s find out together",
    "who are you": "I'm XyloAI — your friendly little smart assistant"
  };

  for (let key in emotionReplies) {
    if (q === key || q.includes(key)) {
      reply.textContent = emotionReplies[key];
      return;
    }
  }

  let answer = "", apiUrl = "";

  const cleaned = q
    .replace(/^(what is|who is|define|meaning of|explain|tell me about)\s+/i, "")
    .replace(/[?!.]+$/, "")
    .trim();

  try {
    if (q.match(/[\d+\-*/()%]/)) {
      apiUrl = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(q)}`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        answer = await res.text();
        if (answer) return reply.textContent = answer;
      }
    }

    if (q.includes("weather")) {
      const placeMatch = q.match(/weather (in|at)?\s*(.*)/);
      const place = placeMatch && placeMatch[2] ? placeMatch[2] : "your city";
      apiUrl = `https://wttr.in/${encodeURIComponent(place)}?format=3`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        answer = await res.text();
        if (answer && !answer.toLowerCase().includes("unknown")) {
          reply.textContent = answer;
          return;
        }
      }
    }

    if (q.startsWith("define") || q.startsWith("meaning of")) {
      apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleaned)}`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        answer = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
        if (answer) return reply.textContent = answer;
      }
    }

    apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json`;
    let res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      answer = data.AbstractText || data.RelatedTopics?.[0]?.Text;
      if (answer) return reply.textContent = answer;
    }

    const topic = cleaned.replace(/\s+/g, "_");
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    const wikiRes = await fetch(wikiUrl);
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json();
      answer = wikiData.extract;
      if (answer) return reply.textContent = answer;
    }

    reply.textContent = "Hmm, I don’t know that yet. Try rephrasing your question.";
  } catch (e) {
    reply.textContent = "Oops, I couldn’t reach any API right now.";
  }
}
