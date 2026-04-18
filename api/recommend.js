export default async function handler(req, res) {
  // Allow browser requests from your site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { prompt } = req.body;

    // Call Google Gemini API using the secret key stored in Vercel environment variables
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          }
        })
      }
    );

const data = await response.json();

// TEMP DEBUG — tanggalin mo ito pagkatapos
console.log('Gemini raw response:', JSON.stringify(data));

const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.status(200).json({ text });

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
