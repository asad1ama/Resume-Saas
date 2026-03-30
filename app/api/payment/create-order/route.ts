import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import Razorpay from "razorpay"
import { prisma } from "@/lib/prisma"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { plan } = await req.json()
    const amount = plan === "starter" ? 2900 : 4900
    const credits = plan === "starter" ? 5 : 10

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    })

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.payment.create({
      data: {
        userId: user.id,
        razorpayOrderId: order.id,
        amount,
        credits,
        status: "PENDING",
      }
    })

    return NextResponse.json({
      orderId: order.id,
      amount,
      credits,
      keyId: process.env.RAZORPAY_KEY_ID,
    })

  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}