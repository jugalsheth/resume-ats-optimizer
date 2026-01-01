import { groq, MODELS } from "@/lib/groq";
import { RESUME_OPTIMIZATION_PROMPT } from "@/lib/prompts";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, missingKeywords } = await request.json();

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Resume text and job description are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = RESUME_OPTIMIZATION_PROMPT(
      resumeText,
      jobDescription,
      missingKeywords || []
    );

    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer specializing in ATS optimization. Return only the optimized resume text, no explanations or metadata.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODELS.INSTANT, // Use INSTANT model for free tier compatibility and faster responses
      temperature: 0.3,
      max_tokens: 2000, // Reduced for free tier (6,000 TPM limit) and faster generation
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
    console.error("Error in optimize route:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to optimize resume",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

