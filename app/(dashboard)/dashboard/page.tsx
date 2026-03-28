import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import SignOutButton from "@/components/shared/SignOutButton"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { reviews: { orderBy: { createdAt: "desc" }, take: 5 } }
  })

  if (!dbUser) {
    redirect("/login")
  }

  const doneReviews = dbUser.reviews.filter(r => r.status === "DONE")
  const avgScore = doneReviews.length
    ? Math.round(doneReviews.reduce((a, r) => a + (r.atsScore ?? 0), 0) / doneReviews.length)
    : null

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
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {session.user.image && (
              <img src={session.user.image} alt="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
            )}
            <span style={{ fontSize: "14px", color: "#374151" }}>{session.user.name}</span>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Welcome */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>
            Welcome back, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Upload your resume and get instant AI feedback</p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Credits remaining", value: String(dbUser.credits), icon: "⚡", color: "#7c3aed", bg: "#f5f3ff" },
            { label: "Reviews done", value: String(doneReviews.length), icon: "📄", color: "#059669", bg: "#ecfdf5" },
            { label: "Avg ATS score", value: avgScore ? String(avgScore) : "—", icon: "📊", color: "#2563eb", bg: "#eff6ff" },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>{stat.label}</span>
                <div style={{ width: "36px", height: "36px", backgroundColor: stat.bg, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>

          {/* Upload card */}
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f3f4f6" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>New Review</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>Upload your resume and get AI feedback in seconds</p>
            <Link href="/review/new" style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "12px", border: "2px dashed #e5e7eb", borderRadius: "16px", padding: "40px 24px",
              textDecoration: "none", marginBottom: "16px",
            }}>
              <div style={{ width: "56px", height: "56px", backgroundColor: "#f5f3ff", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                📄
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "15px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Upload Resume</p>
                <p style={{ fontSize: "13px", color: "#9ca3af" }}>PDF files only, max 5MB</p>
              </div>
            </Link>
            <Link href="/review/new" style={{ display: "block", textAlign: "center", backgroundColor: "#7c3aed", color: "white", padding: "13px", borderRadius: "12px", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>
              Start Review →
            </Link>
            <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "10px" }}>Uses 1 credit per review</p>
          </div>

          {/* Recent reviews */}
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f3f4f6" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", marginBottom: "24px" }}>Recent Reviews</h2>
            {doneReviews.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                <p style={{ fontSize: "15px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>No reviews yet</p>
                <p style={{ fontSize: "13px", color: "#9ca3af" }}>Your review history will appear here</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {doneReviews.map((review) => {
                  const score = review.atsScore ?? 0
                  const scoreColor = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626"
                  return (
                    <Link key={review.id} href={`/review/${review.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", border: "1px solid #f3f4f6", borderRadius: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", backgroundColor: "#f5f3ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                          📄
                        </div>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "2px" }}>{review.resumeUrl}</p>
                          <p style={{ fontSize: "12px", color: "#9ca3af" }}>{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "700", color: scoreColor }}>{score}</span>
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>/100</span>
                        <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "4px" }}>→</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

        </div>

        {/* Buy credits banner */}
        <div style={{ marginTop: "24px", backgroundColor: "#7c3aed", borderRadius: "20px", padding: "28px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "white", marginBottom: "4px" }}>Need more reviews?</h3>
            <p style={{ fontSize: "14px", color: "#ddd6fe" }}>Get 10 reviews for just ₹49/month</p>
          </div>
          <Link href="/billing" style={{ backgroundColor: "white", color: "#7c3aed", padding: "10px 24px", borderRadius: "10px", textDecoration: "none", fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" }}>
            Upgrade to Pro
          </Link>
        </div>

      </div>
    </main>
  )
}