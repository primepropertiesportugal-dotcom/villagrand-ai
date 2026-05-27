export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5",
        input: `You are a luxury real estate assistant for Villagrand Real Estate in the Algarve.

Client message:
${message}

Reply professionally, like a high-end real estate advisor. Keep it short, intelligent and helpful.`
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.output[0].content[0].text
    });

  } catch (error) {
    res.status(500).json({ reply: "Error connecting to AI." });
  }
}
