import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { ingredients } = await request.json();
  console.log('Received ingredients:', ingredients);

  console.log('API Key:', process.env.OPENAI_API_KEY);


  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-turbo",
        messages: [
          {
            role: "system",
            content: "あなたは健康的なダイエットレシピを提案する料理人です。"
          },
          {
            role: "user",
            content: `以下の食材を使った、簡単で健康的なダイエットレシピを1つ提案してください: ${ingredients}`
          }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const recipe = response.data.choices[0].message.content;
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: 'Failed to generate recipe', details: error }, { status: 500 });
  }
}