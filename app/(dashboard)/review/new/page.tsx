"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewReviewPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Only PDF files are allowed.")
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.")
      return
    }
    setError("")
    setFile(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("resume", file)

      const res = await fetch("/api/review/create", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        setLoading(false)
        return
      }

      router.push(`/review/${data.reviewId}`)
    } catch {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

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

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
            Upload your resume
          </h1>
          <p style={{ fontSize: "15px", color: "#6b7280" }}>
            We'll analyse it and give you an ATS score, specific issues, and rewritten bullet points.
          </p>
        </div>

        {/* Upload card */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f3f4f6", marginBottom: "20px" }}>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? "#7c3aed" : file ? "#22c55e" : "#e5e7eb"}`,
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: dragging ? "#f5f3ff" : file ? "#f0fdf4" : "#fafafa",
              transition: "all 0.2s",
              marginBottom: "24px",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
            />

            {file ? (
              <>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#166534", marginBottom: "4px" }}>
                  {file.name}
                </p>
                <p style={{ fontSize: "13px", color: "#16a34a" }}>
                  {(file.size / 1024).toFixed(0)} KB • Ready to review
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null) }}
                  style={{ marginTop: "12px", fontSize: "12px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>
                  {dragging ? "Drop your resume here" : "Drag & drop your resume"}
                </p>
                <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "16px" }}>
                  or click to browse files
                </p>
                <span style={{ fontSize: "12px", color: "#9ca3af", backgroundColor: "#f3f4f6", padding: "4px 12px", borderRadius: "999px" }}>
                  PDF only • Max 5MB
                </span>
              </>
            )}
          </div>

          {/* What you'll get */}
          <div style={{ backgroundColor: "#f9fafb", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>You'll receive:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                "📊 ATS score out of 100",
                "🎯 5 specific issues",
                "✍️ Rewritten bullets",
                "🔑 Missing keywords",
              ].map(item => (
                <div key={item} style={{ fontSize: "13px", color: "#4b5563", display: "flex", alignItems: "center", gap: "6px" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", color: "#dc2626" }}>⚠️ {error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: !file || loading ? "#e5e7eb" : "#7c3aed",
              color: !file || loading ? "#9ca3af" : "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: !file || loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Analysing your resume..." : "Get AI Review →"}
          </button>

          {!loading && (
            <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "10px" }}>
              Takes about 20-30 seconds • Uses 1 credit
            </p>
          )}

          {loading && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>🤖 AI is reading your resume...</div>
              <div style={{ height: "4px", backgroundColor: "#f3f4f6", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  backgroundColor: "#7c3aed",
                  borderRadius: "999px",
                  width: "60%",
                  animation: "progress 2s ease-in-out infinite",
                }} />
              </div>
              <style>{`
                @keyframes progress {
                  0% { width: 10%; }
                  50% { width: 80%; }
                  100% { width: 10%; }
                }
              `}</style>
            </div>
          )}
        </div>

        {/* Tips */}
        <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "16px", padding: "20px 24px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#92400e", marginBottom: "10px" }}>💡 Tips for best results</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Use a single-column resume format",
              "Include your work experience with measurable results",
              "Make sure your PDF has selectable text (not a scanned image)",
            ].map(tip => (
              <li key={tip} style={{ fontSize: "13px", color: "#78350f", marginBottom: "6px", display: "flex", gap: "8px" }}>
                <span>→</span> {tip}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  )
}