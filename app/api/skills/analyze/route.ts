import { groq, MODELS } from "@/lib/groq";
import { SKILLS_GAP_ANALYSIS_PROMPT } from "@/lib/prompts";
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

    const prompt = SKILLS_GAP_ANALYSIS_PROMPT(resumeText, jobDescription);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert skills analyst. Always return valid JSON only, no additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODELS.INSTANT, // Free tier compatible
      temperature: 0.2, // Lower for more structured output
      max_tokens: 1000, // Structured JSON response
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysis = {
        resumeSkills: [],
        requiredSkills: [],
        missingSkills: [],
        matchingSkills: [],
        skillGaps: [],
        learningPath: [],
        matchPercentage: 0,
      };
    }

    // Ensure matchPercentage is between 0-100
    analysis.matchPercentage = Math.max(0, Math.min(100, analysis.matchPercentage || 0));

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in skills analysis route:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze skills gap",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

