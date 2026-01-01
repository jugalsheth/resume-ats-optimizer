import { groq, MODELS } from "@/lib/groq";
import { ATS_ANALYSIS_PROMPT } from "@/lib/prompts";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    const prompt = ATS_ANALYSIS_PROMPT(resumeText, jobDescription);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert ATS analyst. Always return valid JSON only, no additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODELS.INSTANT, // Use faster model for analysis
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    let atsData;
    try {
      atsData = JSON.parse(content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      atsData = {
        score: 50,
        missingKeywords: [],
        suggestions: ["Unable to parse AI response"],
        strengths: [],
        weaknesses: [],
      };
    }

    // Ensure score is between 0-100
    atsData.score = Math.max(0, Math.min(100, atsData.score || 50));

    return NextResponse.json(atsData);
  } catch (error) {
    console.error("Error in analyze route:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

