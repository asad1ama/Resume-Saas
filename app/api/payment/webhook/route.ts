import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-razorpay-signature")

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === "payment.captured") {
      const orderId = event.payload.payment.entity.order_id
      const paymentId = event.payload.payment.entity.id

      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId }
      })

      if (payment && payment.status === "PENDING") {
        await prisma.payment.update({
          where: { razorpayOrderId: orderId },
          data: { status: "SUCCESS", razorpayPaymentId: paymentId }
        })

        await prisma.user.update({
          where: { id: payment.userId },
          data: { credits: { increment: payment.credits } }
        })
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}