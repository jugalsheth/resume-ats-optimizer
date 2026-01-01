import { groq, MODELS } from "@/lib/groq";
import { COVER_LETTER_PROMPT } from "@/lib/prompts";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, tone } = await request.json();

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Resume text and job description are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const validTones = ['professional', 'enthusiastic', 'concise'];
    const selectedTone = validTones.includes(tone) ? tone : 'professional';

    const prompt = COVER_LETTER_PROMPT(resumeText, jobDescription, selectedTone as 'professional' | 'enthusiastic' | 'concise');

    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert cover letter writer. Return only the cover letter text, no subject line, no signatures, no explanations or metadata.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODELS.INSTANT, // Free tier compatible
      temperature: 0.7, // Slightly higher for more natural writing
      max_tokens: 1200, // Medium length cover letters
      stream: true,
    });

    // Create a readable stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in cover letter route:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate cover letter",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

