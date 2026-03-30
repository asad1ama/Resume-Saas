"use client"

import { useState } from "react"

interface Props {
  plan: string
  amount: number
  credits: number
  userEmail: string
}

export default function BuyCreditsButton({ plan, amount, credits, userEmail }: Props) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "ResumeAI",
        description: `${credits} Resume Review Credits`,
        order_id: data.orderId,
        prefill: { email: userEmail },
        theme: { color: "#7c3aed" },
        handler: function () {
          window.location.href = "/dashboard?payment=success"
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        width: "100%",
        padding: "12px",
        backgroundColor: plan === "pro" ? "#7c3aed" : "white",
        color: plan === "pro" ? "white" : "#7c3aed",
        border: "1.5px solid #7c3aed",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "14px",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Loading..." : `Buy ${credits} credits — ₹${amount}`}
    </button>
  )
}