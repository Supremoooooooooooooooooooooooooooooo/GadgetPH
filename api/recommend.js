import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt received' });
    }

    const client = new OpenAI({
      baseURL: "https://models.github.ai/inference",
      apiKey: process.env.GITHUB_TOKEN
    });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a gadget expert for the Philippine market. Always respond with valid JSON only, no markdown." },
        { role: "user", content: prompt }
      ],
      model: "openai/gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1200
    });

    const text = response.choices[0].message.content;
    res.status(200).json({ text });

  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
