import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a flashcard creator. Your job is to generate flashcards that effectively help users learn and retain information. 
Each flashcard should have a clear and concise question on one side and a detailed, accurate answer on the other. 
The content should be tailored to the user's subject of interest, ensuring relevance and educational value.
Focus on clarity, accuracy, and engagement. Use simple language where possible, and ensure that each flashcard encourages active recall and understanding.
Only generate 9 flashcards. Make answer simple.
Return in the following JSON format.
{
  "flashcards": [
    {
      "front":str,
      "back": str
    }
  ]
}`;

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.text();

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });
  const flashcards = JSON.parse(completion.choices[0].message.content);
  return NextResponse.json(flashcards.flashcards);
}
