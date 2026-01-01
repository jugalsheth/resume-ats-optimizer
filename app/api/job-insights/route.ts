import { groq, MODELS } from "@/lib/groq";
import { JOB_INSIGHTS_PROMPT } from "@/lib/prompts";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const prompt = JOB_INSIGHTS_PROMPT(jobDescription);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert job market analyst. Always return valid JSON only, no additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODELS.INSTANT, // Free tier compatible
      temperature: 0.2, // Lower for more structured output
      max_tokens: 1500, // Structured JSON response
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    let insights;
    try {
      insights = JSON.parse(content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      insights = {
        mustHave: [],
        niceToHave: [],
        salaryEstimate: "Not specified",
        requiredQualifications: [],
        preferredQualifications: [],
        redFlags: [],
        companyCulture: "Unable to analyze",
        competitorProfile: "Unable to analyze",
      };
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error in job insights route:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze job description",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

