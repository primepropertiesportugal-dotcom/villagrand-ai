export default async function handler(req, res) {
  try {
    const message = req.body?.message || "";

    // 1️⃣ Get properties from your Worker
    const dataRes = await fetch("https://barbara.primepropertiesportugal.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const propertyData = await dataRes.json();

    // 2️⃣ Send BOTH user + property context to AI
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
            content: `You are a high-end real estate advisor for Villagrand Real Estate.

You operate across Portugal (not only Algarve).

IMPORTANT RULES:
- Speak naturally like a real agent, not like a chatbot.
- Do not give long explanations.
- Do not ask multiple questions at once.
- Guide conversation step by step.
- Only suggest properties AFTER understanding the client.

If property data is available, use it naturally (do not dump it).

Tone:
- calm, confident, professional
- minimal words
- no marketing language
`
          },
          {
            role: "system",
            content: `Property data:\n${propertyData.reply || ""}`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
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

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "Error connecting to assistant." });
  }
}
``
