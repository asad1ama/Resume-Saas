import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function analyzeResume(resumeText: string) {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `You are an expert resume reviewer and ATS specialist.

Analyze the following resume and return a JSON response with this exact structure:
{
  "atsScore": <number 0-100>,
  "issues": [
    { "title": "<issue title>", "description": "<specific explanation and how to fix it>" },
    { "title": "<issue title>", "description": "<specific explanation and how to fix it>" },
    { "title": "<issue title>", "description": "<specific explanation and how to fix it>" },
    { "title": "<issue title>", "description": "<specific explanation and how to fix it>" },
    { "title": "<issue title>", "description": "<specific explanation and how to fix it>" }
  ],
  "rewrites": [
    { "original": "<original bullet point from resume>", "improved": "<improved version>" },
    { "original": "<original bullet point from resume>", "improved": "<improved version>" },
    { "original": "<original bullet point from resume>", "improved": "<improved version>" }
  ],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"]
}

Scoring guide:
- 80-100: Excellent ATS optimization
- 60-79: Good but needs improvements
- 40-59: Moderate - several issues
- 0-39: Poor - major issues

Be specific and reference actual content from the resume.

Resume:
${resumeText}

Return ONLY the JSON object. No markdown, no backticks, no explanation.`
      }
    ],
    temperature: 0.3,
    max_tokens: 2000,
  })

  const content = response.choices[0]?.message?.content ?? ""

  try {
    const clean = content.replace(/```json|```/g, "").trim()
    return JSON.parse(clean)
  } catch {
    throw new Error("Failed to parse AI response")
  }
}