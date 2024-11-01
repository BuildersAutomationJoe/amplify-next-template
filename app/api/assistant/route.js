import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  // Debugging log to confirm API key is loaded (Do NOT log actual API key for security reasons)
  if (!process.env.OPENAI_API_KEY) {
    console.error("API key is missing.");
    return NextResponse.json({ error: 'API key is missing' }, { status: 401 });
  }

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: message,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure this matches the exact environment variable name
        },
      }
    );

    const reply = openaiResponse.data.choices[0].text.trim();
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Error communicating with OpenAI' }, { status: 500 });
  }
}
