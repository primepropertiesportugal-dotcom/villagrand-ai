export default async function handler(req, res) {
  try {
    // Get message safely
    const body = req.body || {};
    const message = body.message || "Hello";

    // Call OpenAI
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
            content: "You are a luxury real estate assistant for Villagrand Real Estate in the Algarve. Speak professionally, clearly and concisely."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // Debug (optional but useful)
    console.log("OpenAI response:", data);

    // Return response safely
    const reply =
      data?.choices?.[0]?.message?.content ||
      "I’m here to help. Could you clarify your request?";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      reply: "There was a connection issue with the AI. Please try again."
    });
  }
}
