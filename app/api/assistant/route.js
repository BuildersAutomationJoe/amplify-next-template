import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/completions', // Assistant API endpoint
      {
        model: 'text-davinci-003', // Choose an appropriate model for the Assistant API
        prompt: message, // Assistant API uses a single prompt field
        max_tokens: 100, // Adjust based on desired response length
        temperature: 0.7, // Controls randomness; adjust as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use your environment variable here
        },
      }
    );

    const reply = openaiResponse.data.choices[0].text.trim();
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return NextResponse.json({ error: 'Error communicating with OpenAI' }, { status: 500 });
  }
}
