document.getElementById("askBtn").addEventListener("click", ask);
document.getElementById("q").addEventListener("keydown", function(e) {
  if (e.key === "Enter") ask();
});

async function ask() {
  const q = document.getElementById('q').value.trim().toLowerCase();
  const reply = document.getElementById('reply');
  if (!q) return reply.textContent = "Please type a question first.";
  reply.textContent = "Thinking...";

  let apiUrl = "", answer = "";

  const cleaned = q
    .replace(/^(what is|who is|define|meaning of|explain|tell me about)\s+/i, "")
    .replace(/[?!.]+$/, "")
    .trim();

  try {
    if (q.match(/[\d+\-*/()%]/)) {
      apiUrl = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(q)}`;
      const res = await fetch(apiUrl);
      answer = await res.text();
    }

    else if (q.includes("weather")) {
      const placeMatch = q.match(/weather (in|at)?\s*(.*)/);
      const place = placeMatch && placeMatch[2] ? placeMatch[2] : "your city";
      apiUrl = `https://wttr.in/${encodeURIComponent(place)}?format=3`;
      const res = await fetch(apiUrl);
      answer = await res.text();
    }

    else if (q.startsWith("define") || q.startsWith("meaning of")) {
      const word = cleaned;
      apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      answer = data[0]?.meanings?.[0]?.definitions?.[0]?.definition || "Couldn't find a definition.";
    }

    else {
      apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      answer = data.AbstractText || data.RelatedTopics?.[0]?.Text || "";

      if (!answer) {
        const topic = cleaned.replace(/\s+/g, "_");
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
        const wikiRes = await fetch(wikiUrl);
        const wikiData = await wikiRes.json();
        answer = wikiData.extract || "I couldn’t find an exact answer.";
      }
    }
  } catch (e) {
    answer = "Error: Couldn't reach the API.";
  }

  reply.textContent = answer;
}
