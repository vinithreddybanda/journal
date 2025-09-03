import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export interface MoodAnalysis {
  summary: string
  mood: 'happy' | 'sad' | 'peaceful' | 'anxious' | 'excited' | 'thoughtful' | 'neutral'
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      )
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a compassionate AI friend and emotional guide. When someone shares their journal entry with you

Remember: You're having a conversation, not giving clinical analysis. Be genuine and caring.`
        },
        {
          role: 'user',
          content: `Here's my journal entry for today: "${content}"

What do you think? How am I feeling? answer in one line poetic genuie humanly very short`
        }
      ],
      model: 'openai/gpt-oss-20b',
      temperature: 0.7,
      max_tokens: 120,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from Groq API')
    }

    // Return the conversational response
    return NextResponse.json({
      summary: response.trim(),
      mood: 'neutral' // Default mood since we're not categorizing strictly
    })
  } catch (error) {
    console.error('Error analyzing mood:', error)

    // Return a fallback response
    return NextResponse.json({
      summary: 'I\'m here to listen whenever you\'re ready to share more. Take care of yourself! 💙',
      mood: 'neutral'
    } as MoodAnalysis)
  }
}
