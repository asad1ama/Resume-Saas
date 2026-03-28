import Link from "next/link"

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: "system-ui, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ borderBottom: "1px solid #f3f4f6", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1152px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", backgroundColor: "#7c3aed", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>R</span>
          </div>
          <span style={{ fontWeight: "600", color: "#111827", fontSize: "18px" }}>ResumeAI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/login" style={{ fontSize: "14px", color: "#6b7280", textDecoration: "none" }}>Sign in</Link>
          <Link href="/login" style={{ fontSize: "14px", backgroundColor: "#7c3aed", color: "white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "500" }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: "1152px", margin: "0 auto", padding: "64px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#f5f3ff", color: "#6d28d9", fontSize: "13px", padding: "6px 16px", borderRadius: "999px", marginBottom: "24px" }}>
          <span>✨</span>
          <span>AI-powered resume feedback in seconds</span>
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: "800", color: "#111827", marginBottom: "20px", lineHeight: "1.2" }}>
          Get your resume reviewed <span style={{ color: "#7c3aed" }}>by AI</span>
        </h1>
        <p style={{ fontSize: "clamp(15px, 2vw, 20px)", color: "#6b7280", marginBottom: "36px", maxWidth: "600px", margin: "0 auto 36px", lineHeight: "1.7" }}>
          Upload your resume and instantly get your ATS score, specific improvement suggestions, and rewritten bullet points. Land more interviews.
        </p>
        <Link href="/login" style={{ display: "inline-block", backgroundColor: "#7c3aed", color: "white", padding: "14px 32px", borderRadius: "12px", fontSize: "17px", fontWeight: "600", textDecoration: "none", boxShadow: "0 10px 25px rgba(124,58,237,0.3)" }}>
          Review my resume free →
        </Link>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "12px" }}>3 free reviews • No credit card required</p>
      </section>

      {/* How it works */}
      <section style={{ backgroundColor: "#f9fafb", padding: "64px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: "48px" }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {[
              { step: "1", title: "Upload your resume", desc: "Drag and drop your PDF resume. We support all standard formats.", icon: "📄" },
              { step: "2", title: "AI analyses it", desc: "Our AI reads every line and compares it against thousands of job descriptions.", icon: "🤖" },
              { step: "3", title: "Get your feedback", desc: "Receive your ATS score, issues list, and rewritten bullet points instantly.", icon: "📊" },
            ].map((item) => (
              <div key={item.step} style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", backgroundColor: "#f5f3ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px" }}>
                  {item.icon}
                </div>
                <div style={{ width: "28px", height: "28px", backgroundColor: "#7c3aed", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <span style={{ color: "white", fontSize: "12px", fontWeight: "700" }}>{item.step}</span>
                </div>
                <h3 style={{ fontWeight: "600", color: "#111827", fontSize: "17px", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: "1152px", margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: "48px" }}>Everything you need</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {[
            { icon: "📊", title: "ATS Score", desc: "Find out if your resume passes automated screening systems used by top companies." },
            { icon: "🎯", title: "Specific Feedback", desc: "Get actionable improvement points — not vague advice. Know exactly what to fix." },
            { icon: "✍️", title: "Rewritten Bullets", desc: "See how your bullet points could be stronger, more impactful, and results-focused." },
            { icon: "🔑", title: "Keyword Analysis", desc: "Discover which keywords are missing from your resume for your target role." },
            { icon: "📈", title: "Score History", desc: "Track how your resume score improves over time as you make changes." },
            { icon: "⚡", title: "Instant Results", desc: "Get your full review in under 30 seconds. No waiting, no scheduling." },
          ].map((f) => (
            <div key={f.title} style={{ backgroundColor: "#f9fafb", borderRadius: "16px", padding: "28px" }}>
              <div style={{ width: "44px", height: "44px", backgroundColor: "#f5f3ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", fontSize: "22px" }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: "600", color: "#111827", fontSize: "16px", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ backgroundColor: "#f9fafb", padding: "64px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: "48px" }}>Simple pricing</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "32px" }}>
              <h3 style={{ fontWeight: "600", color: "#111827", fontSize: "18px", marginBottom: "8px" }}>Free</h3>
              <div style={{ fontSize: "40px", fontWeight: "800", color: "#111827", marginBottom: "24px" }}>₹0</div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "32px" }}>
                {["3 resume reviews", "ATS score", "Improvement suggestions"].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px", marginBottom: "12px" }}>
                    <span style={{ color: "#22c55e", fontWeight: "700" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" style={{ display: "block", textAlign: "center", border: "1.5px solid #7c3aed", color: "#7c3aed", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: "500", fontSize: "15px" }}>
                Get started
              </Link>
            </div>
            <div style={{ backgroundColor: "white", border: "2px solid #7c3aed", borderRadius: "20px", padding: "32px", position: "relative" }}>
              <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#7c3aed", color: "white", fontSize: "11px", padding: "4px 12px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                Most popular
              </div>
              <h3 style={{ fontWeight: "600", color: "#111827", fontSize: "18px", marginBottom: "8px" }}>Pro</h3>
              <div style={{ fontSize: "40px", fontWeight: "800", color: "#111827", marginBottom: "24px" }}>
                ₹49<span style={{ fontSize: "16px", fontWeight: "400", color: "#9ca3af" }}>/month</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "32px" }}>
                {["10 reviews per month", "ATS score", "Improvement suggestions", "Rewritten bullet points", "Priority support"].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px", marginBottom: "12px" }}>
                    <span style={{ color: "#22c55e", fontWeight: "700" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" style={{ display: "block", textAlign: "center", backgroundColor: "#7c3aed", color: "white", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: "500", fontSize: "15px" }}>
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #f3f4f6", padding: "32px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "24px", height: "24px", backgroundColor: "#7c3aed", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: "bold", fontSize: "11px" }}>R</span>
            </div>
            <span style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>ResumeAI</span>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "13px" }}>© 2024 ResumeAI. Built with Next.js and OpenAI.</p>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="#" style={{ color: "#9ca3af", fontSize: "13px", textDecoration: "none" }}>Privacy</Link>
            <Link href="#" style={{ color: "#9ca3af", fontSize: "13px", textDecoration: "none" }}>Terms</Link>
          </div>
        </div>
      </footer>

    </main>
  )
}