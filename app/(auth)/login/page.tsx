"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#7c3aed", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>R</span>
            </div>
            <span style={{ fontWeight: "700", color: "#111827", fontSize: "20px" }}>ResumeAI</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px 32px", boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "8px", textAlign: "center" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", textAlign: "center", marginBottom: "32px" }}>
            Sign in to get your AI resume review
          </p>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "13px 24px",
              border: "1.5px solid #e5e7eb",
              borderRadius: "12px",
              backgroundColor: loading ? "#f9fafb" : "white",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "500",
              color: "#374151",
              transition: "all 0.15s",
              marginBottom: "24px",
            }}
          >
            {/* Google SVG Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#f3f4f6" }} />
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#f3f4f6" }} />
          </div>

          {/* What you get */}
          <div style={{ backgroundColor: "#f5f3ff", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6d28d9", marginBottom: "10px" }}>What you get for free:</p>
            {["3 AI resume reviews", "ATS score out of 100", "Specific improvement tips", "Rewritten bullet points"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ color: "#7c3aed", fontSize: "12px" }}>✓</span>
                <span style={{ fontSize: "13px", color: "#4c1d95" }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
            By signing in, you agree to our{" "}
            <Link href="#" style={{ color: "#7c3aed", textDecoration: "none" }}>Terms</Link>
            {" "}and{" "}
            <Link href="#" style={{ color: "#7c3aed", textDecoration: "none" }}>Privacy Policy</Link>
          </p>
        </div>

        {/* Back to home */}
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#9ca3af" }}>
          <Link href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>← Back to home</Link>
        </p>
      </div>
    </main>
  )
}