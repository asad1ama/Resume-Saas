"use client"
import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{ fontSize: "13px", color: "#9ca3af", background: "none", border: "1px solid #e5e7eb", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}
    >
      Sign out
    </button>
  )
}