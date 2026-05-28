export default async function handler(req, res) {
  try {
    const body = req.body || {};
    const message = body.message || "";

    const response = await fetch("https://barbara.primepropertiesportugal.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.reply
    });

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      reply: "Error connecting to property assistant."
    });
  }
}
