import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return new NextResponse("Usuário não encontrado", { status: 404 })
    }

    const campaignId = params.id
    const { searchParams } = new URL(req.url)
    const format = searchParams.get("format") || "md"

    const campaign = await prisma.socialNetworkCampaign.findFirst({
      where: {
        id: campaignId,
        project: {
          userId: user.id
        }
      },
      include: {
        project: true,
        contents: {
          orderBy: { createdAt: "asc" }
        }
      }
    })

    if (!campaign) {
      return new NextResponse("Campanha não encontrada", { status: 404 })
    }

    const project = campaign.project
    const contents = campaign.contents

    let fileContent = ""
    let contentType = "text/plain"
    let extension = format

    // UTF-8 BOM para garantir acentuação correta no Windows/Office
    const BOM = "\uFEFF"

    if (format === "md") {
      contentType = "text/markdown; charset=utf-8"
      
      fileContent = `# Dossiê de Copywriting: EasySocial - Network Studio\n`
      fileContent += `**Projeto/Negócio:** ${project.projectName}\n`
      fileContent += `**Público-Alvo:** ${project.targetAudience}\n`
      fileContent += `**Campanha de Mês:** ${campaign.month}/${campaign.year}\n\n`
      
      fileContent += `## 1. O Canvas da Oferta 11 Estrelas\n`
      fileContent += `* **Dor Principal:** ${campaign.dorPrincipal}\n`
      fileContent += `* **Medo Profundo:** ${campaign.medo}\n`
      fileContent += `* **Sonho de Consumo:** ${campaign.sonho}\n`
      fileContent += `* **Solução:** ${campaign.promessa}\n`
      fileContent += `* **Prova Social:** ${campaign.provaSocial}\n`
      fileContent += `* **Escassez Real:** ${campaign.escassez}\n\n`
      
      fileContent += `---\n\n`
      
      fileContent += `## 2. Headlines / Ganchos Rápidos\n`
      const headlines = contents.filter(c => c.contentType === "headline")
      headlines.forEach((h, i) => {
        fileContent += `${i + 1}. *"${h.body}"*\n`
      })
      
      fileContent += `\n---\n\n`
      
      fileContent += `## 3. Postagens de Redes Sociais\n`
      const posts = contents.filter(c => c.contentType === "post")
      posts.forEach((p, i) => {
        fileContent += `### Post ${i + 1} (${p.channel.toUpperCase()})\n`
        fileContent += `* **Título:** ${p.title}\n`
        fileContent += `* **Estrutura:** ${p.framework}\n`
        fileContent += `* **Legibilidade Flesch:** ${p.readability || 80}/100\n`
        fileContent += `* **Pronomes:** ${p.pronomesOk ? "OK (Foco no Singular)" : "Aviso de Pronomes"}\n\n`
        fileContent += `\`\`\`text\n${p.body}\n\`\`\`\n\n`
      })

      fileContent += `\n---\n\n`

      fileContent += `## 4. E-mails de Vendas\n`
      const emails = contents.filter(c => c.contentType === "email")
      emails.forEach((e, i) => {
        fileContent += `### E-mail ${i + 1}\n`
        fileContent += `* **Assunto:** ${e.title}\n\n`
        fileContent += `\`\`\`text\n${e.body}\n\`\`\`\n\n`
      })

    } else if (format === "doc") {
      contentType = "application/msword; charset=utf-8"
      extension = "doc"

      fileContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>EasySocial Copywriting Pack</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    h1 { color: #FF3D57; font-size: 24pt; border-bottom: 2px solid #ccc; padding-bottom: 10px; }
    h2 { color: #FF8C00; font-size: 18pt; margin-top: 30px; }
    h3 { font-size: 14pt; margin-top: 20px; }
    .canvas-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #FF8C00; margin-bottom: 20px; }
    .copy-box { background: #f5f5f5; padding: 15px; border: 1px solid #ddd; margin: 10px 0; font-family: monospace; white-space: pre-wrap; }
    .badge { font-weight: bold; color: #555; font-size: 9pt; }
  </style>
</head>
<body>
  <h1>EasySocial - Dossiê de Copywriting</h1>
  <p><strong>Projeto/Negócio:</strong> ${project.projectName}</p>
  <p><strong>Público-Alvo:</strong> ${project.targetAudience}</p>
  <p><strong>Mês de Referência:</strong> ${campaign.month}/${campaign.year}</p>

  <div class="canvas-box">
    <h2>1. O Canvas da Oferta 11 Estrelas</h2>
    <p><strong>Dor Principal:</strong> ${campaign.dorPrincipal}</p>
    <p><strong>Medo Profundo:</strong> ${campaign.medo}</p>
    <p><strong>Sonho de Consumo:</strong> ${campaign.sonho}</p>
    <p><strong>Solução:</strong> ${campaign.promessa}</p>
    <p><strong>Prova Social:</strong> ${campaign.provaSocial}</p>
    <p><strong>Escassez Real:</strong> ${campaign.escassez}</p>
  </div>

  <h2>2. Headlines / Ganchos Rápidos</h2>
  <ul>
    ${contents.filter(c => c.contentType === "headline").map(h => `<li><em>"${h.body}"</em></li>`).join("")}
  </ul>

  <h2>3. Postagens de Redes Sociais</h2>
  ${contents.filter(c => c.contentType === "post").map((p, i) => `
    <h3>Post ${i + 1} (${p.channel.toUpperCase()})</h3>
    <p class="badge">Estrutura: ${p.framework} | Legibilidade: ${p.readability}/100 | Pronomes: ${p.pronomesOk ? "OK" : "Aviso"}</p>
    <p><strong>Título:</strong> ${p.title}</p>
    <div class="copy-box">${p.body}</div>
  `).join("")}

  <h2>4. E-mails de Vendas</h2>
  ${contents.filter(c => c.contentType === "email").map((e, i) => `
    <h3>E-mail ${i + 1}</h3>
    <p><strong>Assunto:</strong> ${e.title}</p>
    <div class="copy-box">${e.body}</div>
  `).join("")}
</body>
</html>`
    } else if (format === "csv") {
      contentType = "text/csv; charset=utf-8"
      extension = "csv"

      // Cabeçalhos CSV
      fileContent = "Tipo de Conteúdo;Canal;Framework;Título/Assunto;Texto da Copy;Legibilidade;Pronomes Validados\n"

      // Headlines
      contents.filter(c => c.contentType === "headline").forEach(h => {
        fileContent += `Headline;Instagram;Atenção;Gancho Curto;"${h.body.replace(/"/g, '""')}";100;Sim\n`
      })

      // Posts
      contents.filter(c => c.contentType === "post").forEach(p => {
        fileContent += `Post;${p.channel};${p.framework};"${(p.title || "").replace(/"/g, '""')}";"${p.body.replace(/"/g, '""')}";${p.readability || 80};${p.pronomesOk ? "Sim" : "Não"}\n`
      })

      // E-mails
      contents.filter(c => c.contentType === "email").forEach(e => {
        fileContent += `Email;E-mail;PAS;"${(e.title || "").replace(/"/g, '""')}";"${e.body.replace(/"/g, '""')}";${e.readability || 80};${e.pronomesOk ? "Sim" : "Não"}\n`
      })
    }

    const filename = `easysocial-export-${campaignId}.${extension}`
    const fileBuffer = Buffer.from(BOM + fileContent, "utf-8")

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    })
  } catch (err: any) {
    return new NextResponse(err.message || "Erro na exportação", { status: 500 })
  }
}
