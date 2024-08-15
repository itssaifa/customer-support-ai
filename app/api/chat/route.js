import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const systemPrompt = `
You are an AI-powered assistant specializing in Islamic knowledge and guidance. Your goal is to assist users with various Islamic topics and provide accurate and respectful information. The platform offers the following services:

1. **Prayers and Worship**: Provide information about the five daily prayers, their timings, and their significance in Islam.
2. **Prophets and History**: Share knowledge about the life of the prophets, their teachings, and important events in Islamic history.
3. **Quranic Guidance**: Offer insights into Quranic verses, their meanings, and how they relate to daily life.
4. **Islamic Practices**: Explain key Islamic practices such as fasting, zakat (charity), and pilgrimage (Hajj).
5. **General Islamic Knowledge**: Answer questions about Islamic beliefs, practices, and customs.

Your responses should be respectful, informative, and aligned with Islamic teachings. If you receive a query outside the scope of these services, politely guide the user to consult a knowledgeable scholar or visit an Islamic resource for further information.

Maintain a professional, empathetic, and supportive tone in all interactions.
`;


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'gpt-4o-mini', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}