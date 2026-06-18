import { NextResponse } from "next/server"
import { requireSextouToolsPremiumApiUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const proUser = await requireSextouToolsPremiumApiUser()
    if (proUser === null) {
      return new NextResponse("Não autorizado", { status: 401 })
    }
    if (proUser === false) {
      return new NextResponse("Acesso restrito ao Pacote PRO Premium", { status: 403 })
    }
    const user = proUser

    const channelId = params.channelId
    const { searchParams } = new URL(req.url)
    const format = searchParams.get("format") || "md"
    const planId = searchParams.get("planId")

    if (!planId) {
      return new NextResponse("planId é obrigatório", { status: 400 })
    }

    const plan = await prisma.youtubeContentPlan.findFirst({
      where: { id: planId, userId: user.id, channelId },
      include: { channel: true }
    })

    if (!plan) {
      return new NextResponse("Plano editorial não encontrado", { status: 404 })
    }

    const items = await prisma.youtubeContentItem.findMany({
      where: { planId: plan.id },
      orderBy: { scheduledDate: "asc" }
    })

    let fileContent = ""
    let contentType = "text/plain"
    let filename = `plano-youtube-${plan.channel.channelName.toLowerCase().replace(/\s+/g, "-")}.${format}`

    if (format === "md") {
      contentType = "text/markdown; charset=utf-8"
      fileContent = `# Plano Editorial YouTube Growth Studio - ${plan.channel.channelName}

## Visão Geral da Estratégia
${plan.strategySummary || "Sem resumo estratégico."}

## Calendário de Conteúdo de 30 Dias

`
      items.forEach((item, idx) => {
        fileContent += `### Dia ${idx + 1}: [${item.itemType.toUpperCase()}] - ${item.title || "Pendente"}
* **Agendado:** ${item.scheduledDate.toLocaleDateString("pt-BR")}
* **Gancho:** ${item.hook || "N/A"}
* **Chamada de Ação (CTA):** ${item.cta || "N/A"}

`
        if (item.scriptJson) {
          const script = item.scriptJson as any
          fileContent += `#### Roteiro
* **Introdução:** ${script.intro || "N/A"}
* **Desenvolvimento:**
${script.sections?.map((s: any) => `  - **${s.title}:** ${s.talking_points?.join(", ")}`).join("\n") || "  - N/A"}
* **Fechamento:** ${script.closing || "N/A"}

`
        }

        if (item.seoPack) {
          const seo = item.seoPack as any
          fileContent += `#### SEO Pack
* **Sugestões de Título:**
${seo.titles?.map((t: any) => `  - [${t.variant}] ${t.text}`).join("\n") || "  - N/A"}
* **Tags/Palavras-chave:** ${seo.description?.keywords?.join(", ") || "N/A"}
* **Hashtags:** ${seo.hashtags?.primary?.concat(seo.hashtags?.local || []).join(", ") || "N/A"}

`
        }
        fileContent += `---\n\n`
      })

    } else if (format === "csv") {
      contentType = "text/csv; charset=utf-8"
      filename = `calendario-youtube-${plan.channel.channelName.toLowerCase().replace(/\s+/g, "-")}.csv`
      // UTF-8 BOM
      fileContent = "\ufeffDia,Tipo,Titulo,Data,Gancho,CTA\n"
      items.forEach((item, idx) => {
        const cleanTitle = (item.title || "").replace(/"/g, '""')
        const cleanHook = (item.hook || "").replace(/"/g, '""')
        const cleanCta = (item.cta || "").replace(/"/g, '""')
        fileContent += `${idx + 1},${item.itemType},"${cleanTitle}",${item.scheduledDate.toLocaleDateString("pt-BR")},"${cleanHook}","${cleanCta}"\n`
      })

    } else if (format === "html") {
      contentType = "text/html; charset=utf-8"
      fileContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Plano Editorial - ${plan.channel.channelName}</title>
  <style>
    body { font-family: sans-serif; background: #0D0D0D; color: #F0EDE6; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { color: #FF3D57; }
    .card { background: #171717; border: 1px solid #222; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>Plano Editorial YouTube - ${plan.channel.channelName}</h1>
  <p>${plan.strategySummary}</p>
  <h2>Conteúdos Programados</h2>
  ${items.map((item, idx) => `
    <div class="card">
      <h3>Dia ${idx + 1}: [${item.itemType}] ${item.title}</h3>
      <p><strong>Data:</strong> ${item.scheduledDate.toLocaleDateString("pt-BR")}</p>
      <p><strong>Gancho:</strong> ${item.hook}</p>
      <p><strong>CTA:</strong> ${item.cta}</p>
    </div>
  `).join("")}
</body>
</html>`

    } else if (format === "docx") {
      contentType = "application/msword; charset=utf-8"
      filename = `plano-youtube-${plan.channel.channelName.toLowerCase().replace(/\s+/g, "-")}.doc`
      // MS Word HTML format com UTF-8 BOM
      fileContent = `\ufeff<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Plano Editorial - ${plan.channel.channelName}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.5; }
    h1 { color: #FF3D57; font-size: 24pt; }
    h2 { color: #333333; font-size: 18pt; border-bottom: 1px solid #ccc; }
    h3 { color: #555555; font-size: 14pt; }
    .item-block { border: 1px solid #eee; padding: 10px; margin-bottom: 15px; }
  </style>
</head>
<body>
  <h1>Plano Editorial YouTube - ${plan.channel.channelName}</h1>
  <p>${plan.strategySummary}</p>
  
  <h2>Calendário Editorial</h2>
  ${items.map((item, idx) => `
    <div class="item-block">
      <h3>Dia ${idx + 1}: [${item.itemType.toUpperCase()}] ${item.title || "Pendente"}</h3>
      <p><strong>Data de Postagem:</strong> ${item.scheduledDate.toLocaleDateString("pt-BR")}</p>
      <p><strong>Gancho de Vídeo:</strong> ${item.hook || "N/A"}</p>
      <p><strong>CTA da Oferta:</strong> ${item.cta || "N/A"}</p>
      
      ${item.scriptJson ? `
        <h4>Estrutura do Roteiro</h4>
        <p><strong>Intro:</strong> ${(item.scriptJson as any).intro || "N/A"}</p>
        <p><strong>Fechamento:</strong> ${(item.scriptJson as any).closing || "N/A"}</p>
      ` : ""}
    </div>
  `).join("")}
</body>
</html>`
    }

    // Registrar auditoria
    await prisma.toolExecution.create({
      data: {
        userId: user.id,
        toolSlug: "youtube-growth-studio",
        inputJson: { channelId, format, planId },
        outputJson: { success: true }
      }
    })

    return new Response(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    })

  } catch (err: any) {
    console.error("[EXPORT] Error:", err)
    return new NextResponse(err.message || "Erro ao exportar", { status: 500 })
  }
}
