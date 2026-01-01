export const ATS_ANALYSIS_PROMPT = (resumeText: string, jobDescription: string) => `
You are an expert ATS (Applicant Tracking System) analyst. Analyze the following resume against the job description and provide a comprehensive assessment.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please analyze and return a JSON object with the following structure:
{
  "score": <number between 0-100>,
  "missingKeywords": [<array of important keywords from job description that are missing in resume>],
  "suggestions": [<array of specific improvement suggestions>],
  "strengths": [<array of what the resume does well>],
  "weaknesses": [<array of areas that need improvement>]
}

Focus on:
1. Keyword matching (especially technical skills, tools, and qualifications)
2. Experience relevance
3. Formatting and ATS-friendliness
4. Missing qualifications or skills mentioned in job description

CRITICAL: Return ONLY valid JSON. Do not include any markdown formatting, code blocks, or explanatory text. Start your response with { and end with }.
`;

export const RESUME_OPTIMIZATION_PROMPT = (resumeText: string, jobDescription: string, missingKeywords: string[]) => `
You are an expert resume writer specializing in ATS optimization. Optimize the following resume to better match the job description while maintaining authenticity and truthfulness.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

MISSING KEYWORDS TO INCORPORATE:
${missingKeywords.join(', ')}

Instructions:
1. Naturally incorporate missing keywords into relevant sections
2. Maintain the original achievements and experiences (do not fabricate)
3. Improve formatting for ATS compatibility (use standard section headers, avoid graphics/tables)
4. Enhance bullet points to better align with job requirements
5. Keep professional tone and authenticity
6. Do not add false information or experiences

Return the optimized resume text. Do not include any explanations or metadata, just the resume text itself.
`;

export const EMAIL_TEMPLATE_PROMPT = (
  resumeText: string,
  jobDescription: string,
  emailType: 'application' | 'follow-up' | 'thank-you'
) => {
  const emailTypes = {
    application: 'application email to submit with your resume',
    'follow-up': 'follow-up email to send a week after applying',
    'thank-you': 'thank-you email to send after an interview',
  };

  return `Generate a professional ${emailTypes[emailType]} for the following job application.

RESUME SUMMARY:
${resumeText.substring(0, 500)}...

JOB DESCRIPTION:
${jobDescription.substring(0, 800)}...

Instructions:
1. Keep the email concise (3-4 short paragraphs max)
2. Professional and enthusiastic tone
3. Highlight 2-3 key qualifications from resume that match the job
4. Show genuine interest in the role and company
5. Include a clear call-to-action
6. No placeholders - write complete, ready-to-send email

Return only the email body text (no subject line, no signatures, just the email content).`;
};

export const JOB_INSIGHTS_PROMPT = (jobDescription: string) => `
Analyze the following job description and provide structured insights.

JOB DESCRIPTION:
${jobDescription}

Return a JSON object with this exact structure:
{
  "mustHave": [<array of must-have requirements>],
  "niceToHave": [<array of nice-to-have/preferred qualifications>],
  "salaryEstimate": "<estimated salary range based on role and location, or 'Not specified'>",
  "requiredQualifications": [<array of required qualifications>],
  "preferredQualifications": [<array of preferred qualifications>],
  "redFlags": [<array of potential red flags or concerns>],
  "companyCulture": "<brief insight about company culture from job description>",
  "competitorProfile": "<brief description of what other candidates likely have>"
}

Focus on:
1. Clearly distinguish must-haves vs nice-to-haves
2. Extract salary hints from description or estimate based on role
3. Identify any concerning patterns (high turnover, unrealistic expectations, etc.)
4. Infer company culture from language and benefits
5. Describe typical candidate profile for this role

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanations. Start with { and end with }.
`;

export const COVER_LETTER_PROMPT = (resumeText: string, jobDescription: string, tone: 'professional' | 'enthusiastic' | 'concise') => {
  const toneDescriptions = {
    professional: 'professional and polished',
    enthusiastic: 'enthusiastic and energetic',
    concise: 'concise and direct',
  };

  return `Write a ${toneDescriptions[tone]} cover letter for the following job application.

RESUME:
${resumeText.substring(0, 1000)}...

JOB DESCRIPTION:
${jobDescription.substring(0, 1000)}...

Instructions:
1. Keep it to 3-4 paragraphs (concise version: 2-3 paragraphs)
2. ${tone === 'professional' ? 'Professional, polished tone' : tone === 'enthusiastic' ? 'Enthusiastic, energetic tone showing passion' : 'Concise, direct tone - get to the point quickly'}
3. Highlight 2-3 key qualifications that match the job
4. Show genuine interest in the role
5. Include a strong closing paragraph
6. No placeholders - write complete, ready-to-use cover letter

Return only the cover letter text. No subject line, no signatures, no explanations.`;
};

export const SKILLS_GAP_ANALYSIS_PROMPT = (resumeText: string, jobDescription: string) => `
Analyze the skills gap between the resume and job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return a JSON object with this exact structure:
{
  "resumeSkills": [<array of skills found in resume>],
  "requiredSkills": [<array of skills required by job>],
  "missingSkills": [<array of required skills missing from resume>],
  "matchingSkills": [<array of skills that match between resume and job>],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "importance": "<high|medium|low>",
      "reason": "<why this skill is important for the role>"
    }
  ],
  "learningPath": [
    {
      "skill": "<skill name>",
      "resources": [<array of learning resource suggestions>],
      "timeframe": "<estimated time to learn>"
    }
  ],
  "matchPercentage": <number between 0-100>
}

Focus on:
1. Extract all technical and soft skills from both documents
2. Identify critical missing skills
3. Prioritize skills by importance to the role
4. Suggest practical learning resources
5. Calculate overall skill match percentage

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanations. Start with { and end with }.
`;

