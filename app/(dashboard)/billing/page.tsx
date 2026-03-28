import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  })
  if (!dbUser) redirect("/login")

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #f3f4f6", padding: "0 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", backgroundColor: "#7c3aed", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>R</span>
            </div>
            <span style={{ fontWeight: "600", color: "#111827" }}>ResumeAI</span>
          </div>
          <Link href="/dashboard" style={{ fontSize: "14px", color: "#6b7280", textDecoration: "none" }}>← Back</Link>
        </div>
      </nav>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>Billing</h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "32px" }}>Manage your credits and subscription</p>

        {/* Current balance */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "28px", border: "1px solid #f3f4f6", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>Credits remaining</p>
          <div style={{ fontSize: "48px", fontWeight: "800", color: "#7c3aed", marginBottom: "4px" }}>{dbUser.credits}</div>
          <p style={{ fontSize: "13px", color: "#9ca3af" }}>Each resume review uses 1 credit</p>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "28px" }}>
            <h3 style={{ fontWeight: "600", color: "#111827", fontSize: "17px", marginBottom: "4px" }}>Starter</h3>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#111827", marginBottom: "16px" }}>₹29</div>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>5 resume review credits</p>
            <button style={{ width: "100%", padding: "12px", backgroundColor: "#f5f3ff", color: "#7c3aed", border: "1.5px solid #7c3aed", borderRadius: "12px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              Buy 5 credits
            </button>
          </div>
          <div style={{ backgroundColor: "white", border: "2px solid #7c3aed", borderRadius: "20px", padding: "28px", position: "relative" }}>
            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#7c3aed", color: "white", fontSize: "11px", padding: "4px 12px", borderRadius: "999px", whiteSpace: "nowrap" }}>Best value</div>
            <h3 style={{ fontWeight: "600", color: "#111827", fontSize: "17px", marginBottom: "4px" }}>Pro</h3>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#111827", marginBottom: "16px" }}>₹49</div>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>10 resume review credits</p>
            <button style={{ width: "100%", padding: "12px", backgroundColor: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              Buy 10 credits
            </button>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "20px" }}>
          Payments coming soon via Razorpay • Credits never expire
        </p>
      </div>
    </main>
  )
}