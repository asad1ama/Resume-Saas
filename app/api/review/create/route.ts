import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { analyzeResume } from "@/lib/openai"
// import pdf from "pdf-parse/lib/pdf-parse"



export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get or create user in DB
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name ?? "",
          image: session.user.image ?? "",
          credits: 3,
        },
      })
    }

    if (user.credits < 1) {
      return NextResponse.json({ error: "No credits remaining. Please upgrade to continue." }, { status: 402 })
    }

    // Parse the uploaded PDF
    const formData = await req.formData()
    const file = formData.get("resume") as File
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 })
    }

    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer())
    const { extractText } = await import("unpdf")
    const { text: resumeText } = await extractText(new Uint8Array(buffer), { mergePages: true })

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Could not extract text from PDF. Make sure your PDF has selectable text." }, { status: 400 })
    }

    // Create review record
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        resumeUrl: file.name,
        status: "PENDING",
      },
    })



    // Call OpenAI
    const feedback = await analyzeResume(resumeText)

        // Deduct credit atomically
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } },
    })

    // Update review with results
    await prisma.review.update({
      where: { id: review.id },
      data: {
        atsScore: feedback.atsScore,
        issues: feedback.issues,
        rewrites: feedback.rewrites,
        keywords: feedback.keywords,
        status: "DONE",
      },
    })

    return NextResponse.json({ reviewId: review.id })

  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}