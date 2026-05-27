export default async function handler(req, res) {
  try {
    const body = req.body || {};
    const message = body.message || "Hello";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: "You are a luxury real estate assistant for Villagrand Real Estate in the Algarve. Speak professionally and concisely."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No response from AI";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Error connecting to AI."
    });
  }
}
