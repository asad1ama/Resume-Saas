import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import NextAuthProvider from "@/components/shared/SessionProvider"
import Script from "next/script"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ResumeAI — Get Your Resume Reviewed by AI",
  description: "Upload your resume and get instant AI-powered feedback, ATS score, and improvement suggestions.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}