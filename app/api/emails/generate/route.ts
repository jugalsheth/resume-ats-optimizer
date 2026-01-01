import { groq, MODELS } from "@/lib/groq";
import { EMAIL_TEMPLATE_PROMPT } from "@/lib/prompts";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, emailType } = await request.json();

    if (!resumeText || !jobDescription || !emailType) {
      return NextResponse.json(
        { error: "Resume text, job description, and email type are required" },
        { status: 400 }
      );
    }

    if (!['application', 'follow-up', 'thank-you'].includes(emailType)) {
      return NextResponse.json(
        { error: "Invalid email type. Must be 'application', 'follow-up', or 'thank-you'" },
        { status: 400 }
      );
    }

    const prompt = EMAIL_TEMPLATE_PROMPT(resumeText, jobDescription, emailType as 'application' | 'follow-up' | 'thank-you');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert professional email writer. Return only the email body text, no subject line, no signatures, no explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODELS.INSTANT, // Free tier compatible
      temperature: 0.7, // Slightly higher for more natural tone
      max_tokens: 800, // Short emails for speed
    });

    const emailText = completion.choices[0]?.message?.content;
    if (!emailText) {
      throw new Error("No response from AI");
    }

    return NextResponse.json({
      email: emailText.trim(),
      type: emailType,
    });
  } catch (error) {
    console.error("Error in email generation route:", error);
    return NextResponse.json(
      {
        error: "Failed to generate email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

