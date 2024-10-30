import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("Received POST request in assistant API route");

  const { message } = await req.json();
  console.log("Message received from client:", message);

  if (!message) {
    console.error("No message provided");
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = openaiResponse.data.choices[0].text.trim();
    console.log("Reply from OpenAI:", reply);

    return NextResponse.json({ reply });
  } catch (error) {
    // Log detailed error information
    if (error.response) {
      console.error("OpenAI API Error:", error.response.data);
      return NextResponse.json(
        { error: `OpenAI API Error: ${error.response.data.error.message}` },
        { status: error.response.status }
      );
    } else if (error.request) {
      console.error("No response from OpenAI API:", error.request);
      return NextResponse.json(
        { error: 'No response from OpenAI API' },
        { status: 500 }
      );
    } else {
      console.error("Error setting up OpenAI request:", error.message);
      return NextResponse.json(
        { error: `Error setting up OpenAI request: ${error.message}` },
        { status: 500 }
      );
    }
  }
}