import { NextResponse } from "next/server"
import { whatsappEngine } from "@/lib/whatsapp"

export const dynamic = "force-dynamic"

export async function GET() {
  const client = whatsappEngine.getClient()
  const connectedPhone = client?.info?.wid?.user || null

  return NextResponse.json({
    status: whatsappEngine.status,
    connectedPhone
  })
}
