let conversationHistory = [];

export default async function handler(req, res) {
  try {
    const message = req.body?.message || "";

    // ✅ keep last messages (memory)
    conversationHistory.push({ role: "user", content: message });

    if (conversationHistory.length > 10) {
      conversationHistory.shift();
    }

    // ✅ get property data
    const dataRes = await fetch("https://barbara.primepropertiesportugal.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const propertyData = await dataRes.json();

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are Barbara, senior advisor at Villagrand Real Estate.

CRITICAL:

- You introduce yourself ONLY ONCE at the beginning:
  "Good afternoon, Barbara here from Villagrand Real Estate."

- After that, you NEVER introduce yourself again.

- You remember everything the client already said.

- NEVER repeat questions already asked.
- NEVER ignore previously given information.

---

STYLE:

- Short
- Controlled
- Professional
- No fluff
- No long paragraphs

---

CONVERSATION BEHAVIOUR:

- One step at a time
- One question at a time
- Do not interrogate
- Do not lecture

---

POSITIONING:

- Portugal-wide (NOT Algarve only)

---

PROPERTY DATA:

${propertyData.reply || ""}

- Only use properties when relevant
- Do NOT dump listings
- Only show them when enough info is known

---

EXAMPLE FLOW:

Client: hi  
→ Good afternoon, Barbara here from Villagrand Real Estate.  
→ Are you looking for something specific?

Client: plot vale do lobo  
→ Understood. Do you have a budget range in mind?

Client: 5 million  
→ Then show relevant options

---

You behave like a real experienced agent, not a chatbot.
`
          },
          ...conversationHistory
        ],
        temperature: 0.6
      })
    });

    const text = await aiRes.text();

    let reply = "No response";

    try {
      const json = JSON.parse(text);
      reply = json.choices?.[0]?.message?.content || text;
    } catch {
      reply = text;
    }

    // ✅ remember AI response too
    conversationHistory.push({ role: "assistant", content: reply });

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "Error." });
  }
}

