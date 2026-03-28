import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) redirect("/login")

  const review = await prisma.review.findFirst({
    where: { id, userId: user.id },
  })

  if (!review) notFound()

  const issues = review.issues as Array<{ title: string; description: string }> ?? []
  const rewrites = review.rewrites as Array<{ original: string; improved: string }> ?? []
  const keywords = review.keywords as string[] ?? []
  const score = review.atsScore ?? 0

  const scoreColor = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626"
  const scoreBg = score >= 80 ? "#f0fdf4" : score >= 60 ? "#fffbeb" : "#fef2f2"
  const scoreLabel = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Needs Work" : "Poor"

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "system-ui, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #f3f4f6", padding: "0 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", backgroundColor: "#7c3aed", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>R</span>
            </div>
            <span style={{ fontWeight: "600", color: "#111827", fontSize: "18px" }}>ResumeAI</span>
          </div>
          <Link href="/dashboard" style={{ fontSize: "14px", color: "#6b7280", textDecoration: "none" }}>
            ← Back to dashboard
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>Your Resume Review</h1>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>
            {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* ATS Score */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f3f4f6", marginBottom: "20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "32px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: scoreBg, border: `4px solid ${scoreColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "36px", fontWeight: "800", color: scoreColor }}>{score}</span>
              <span style={{ fontSize: "11px", color: scoreColor, fontWeight: "600" }}>/100</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ display: "inline-block", backgroundColor: scoreBg, color: scoreColor, fontSize: "13px", fontWeight: "600", padding: "4px 12px", borderRadius: "999px", marginBottom: "10px" }}>
              {scoreLabel}
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>ATS Score</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
              {score >= 80
                ? "Your resume is well-optimized for ATS systems. Minor improvements could push it higher."
                : score >= 60
                ? "Your resume passes most ATS checks but has room for improvement in key areas."
                : "Your resume needs significant work to pass ATS screening. Focus on the issues below."}
            </p>
          </div>
          {/* Score bar */}
          <div style={{ width: "100%", height: "8px", backgroundColor: "#f3f4f6", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${score}%`, backgroundColor: scoreColor, borderRadius: "999px", transition: "width 1s ease" }} />
          </div>
        </div>

        {/* Issues */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f3f4f6", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>
            🎯 Issues Found ({issues.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {issues.map((issue, i) => (
              <div key={i} style={{ borderLeft: "3px solid #7c3aed", paddingLeft: "16px", paddingTop: "4px", paddingBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ width: "22px", height: "22px", backgroundColor: "#7c3aed", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "white", fontWeight: "700", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#111827" }}>{issue.title}</h3>
                </div>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>{issue.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rewritten bullets */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f3f4f6", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
            ✍️ Rewritten Bullet Points
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>Here's how your bullet points could be improved:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {rewrites.map((rw, i) => (
              <div key={i} style={{ border: "1px solid #f3f4f6", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ backgroundColor: "#fef2f2", padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <p style={{ fontSize: "11px", fontWeight: "600", color: "#dc2626", marginBottom: "4px" }}>BEFORE</p>
                  <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>{rw.original}</p>
                </div>
                <div style={{ backgroundColor: "#f0fdf4", padding: "12px 16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: "600", color: "#16a34a", marginBottom: "4px" }}>AFTER</p>
                  <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>{rw.improved}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing keywords */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f3f4f6", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
            🔑 Missing Keywords
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>Add these keywords to improve your ATS score:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {keywords.map((kw, i) => (
              <span key={i} style={{ backgroundColor: "#f5f3ff", color: "#6d28d9", fontSize: "13px", fontWeight: "500", padding: "6px 14px", borderRadius: "999px", border: "1px solid #ede9fe" }}>
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <Link href="/review/new" style={{ flex: 1, minWidth: "200px", display: "block", textAlign: "center", backgroundColor: "#7c3aed", color: "white", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>
            Review another resume →
          </Link>
          <Link href="/dashboard" style={{ flex: 1, minWidth: "200px", display: "block", textAlign: "center", border: "1.5px solid #e5e7eb", color: "#374151", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: "500", fontSize: "15px" }}>
            Back to dashboard
          </Link>
        </div>

      </div>
    </main>
  )
}