import { NextResponse } from "next/server"
import { whatsappEngine } from "@/lib/whatsapp"

export const dynamic = "force-dynamic"

export async function GET() {
  if (whatsappEngine.status === "DISCONNECTED") {
    // Inicia a engine apenas quando o usuário pedir o QR Code
    whatsappEngine.initialize()
  }

  return NextResponse.json({
    status: whatsappEngine.status,
    qrCodeUrl: whatsappEngine.qrCodeUrl,
  })
}
