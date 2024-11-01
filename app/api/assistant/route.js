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
<<<<<<< HEAD
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure this matches the exact environment variable name
=======
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
>>>>>>> d772505ed27734ce4e18314d625279e15724d74a
        },
      }
    );

    const reply = openaiResponse.data.choices[0].text.trim();
    console.log("Reply from OpenAI:", reply);

    return NextResponse.json({ reply });
  } catch (error) {
<<<<<<< HEAD
    console.error("Error communicating with OpenAI:", error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Error communicating with OpenAI' }, { status: 500 });
=======
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
>>>>>>> d772505ed27734ce4e18314d625279e15724d74a
  }
}