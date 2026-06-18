import { NextResponse } from "next/server"
import { requireSextouToolsPremiumApiUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proUser = await requireSextouToolsPremiumApiUser()
    if (proUser === null) {
      return new NextResponse("Não autorizado", { status: 401 })
    }
    if (proUser === false) {
      return new NextResponse("Acesso restrito ao Pacote Premium (anúncio ativo + assinatura)", { status: 403 })
    }
    const user = proUser

    const projectId = params.id
    const { searchParams } = new URL(req.url)
    const format = searchParams.get("format") || "md"
    const versionParam = searchParams.get("version")
    const versionQuery = versionParam ? parseInt(versionParam, 10) : undefined

    const project = await prisma.sb7Project.findFirst({
      where: { id: projectId, userId: user.id }
    })

    if (!project) {
      return new NextResponse("Projeto não encontrado", { status: 404 })
    }

    const brandScript = await prisma.sb7BrandScript.findFirst({
      where: {
        projectId,
        ...(versionQuery !== undefined ? { version: versionQuery } : { isCurrent: true })
      },
      include: {
        collaterals: true
      }
    })

    if (!brandScript || !brandScript.collaterals[0]) {
      return new NextResponse("Estratégia não encontrada", { status: 404 })
    }

    const collateral = brandScript.collaterals[0]

    // Formata o conteúdo
    const planSteps = Array.isArray(brandScript.planProcess) ? (brandScript.planProcess as string[]) : []
    const planAgreements = Array.isArray(brandScript.planAgreement) ? (brandScript.planAgreement as string[]) : []
    const stakesList = Array.isArray(brandScript.stakes) ? (brandScript.stakes as string[]) : []
    const authList = Array.isArray(brandScript.authority) ? (brandScript.authority as any[]) : []
    const successData = typeof brandScript.success === "object" && brandScript.success ? (brandScript.success as any) : { concrete: "", identity: "" }
    
    const wireframeList = Array.isArray(collateral.wireframe) ? collateral.wireframe : []
    const leadGen = typeof collateral.leadGenerator === "object" && collateral.leadGenerator ? collateral.leadGenerator as any : { title: "", format: "", outline: [] }
    const nurtureEmails = Array.isArray(collateral.nurtureEmails) ? collateral.nurtureEmails : []
    const salesEmails = Array.isArray(collateral.salesEmails) ? collateral.salesEmails : []

    let fileContent = ""
    let contentType = "text/plain"
    let filename = `estrategia-sb7-${project.name.toLowerCase().replace(/\s+/g, "-")}.${format}`

    if (format === "md") {
      contentType = "text/markdown; charset=utf-8"
      fileContent = `# Estratégia de Marketing StoryBrand SB7 - ${project.name} (Versão ${brandScript.version})

## 1. One-Liner da Marca
> "${brandScript.oneLiner}"

---

## 2. BrandScript Completo (Os 7 Elementos)

### 1. O Herói (Desejo Único)
${brandScript.heroWant}

### 2. O Problema
- **Vilão:** ${brandScript.villain || "Não definido"}
- **Problema Externo:** ${brandScript.problemExternal}
- **Problema Interno:** ${brandScript.problemInternal}
- **Problema Filosófico:** ${brandScript.problemPhilosophical}

### 3. O Guia
- **Empatia:** ${brandScript.empathy}
- **Autoridade:**
${authList.map((a: any) => `  * **${a.type}:** ${a.value}`).join("\n")}

### 4. O Plano
- **Passos do Processo:**
${planSteps.map((step: string, i: number) => `  ${i + 1}. ${step}`).join("\n")}
- **Acordos/Promessas:**
${planAgreements.map((agreement: string) => `  * ${agreement}`).join("\n")}

### 5. Chamada para Ação (CTA)
- **CTA Direto:** ${brandScript.ctaDirect}
- **CTA Transicional:** ${brandScript.ctaTransitional || "Não definido"}

### 6. As Apostas (O Fracasso/Perda)
${stakesList.map((stake: string) => `* ${stake}`).join("\n")}

### 7. O Sucesso
- **Resultados Concretos:** ${successData.concrete}
- **Transformação de Identidade:** ${successData.identity}

---

## 3. Wireframe da Homepage (Estrutura de Conversão)
${wireframeList.map((sec: any) => `### Seção: ${sec.section}\n${sec.copy}\n`).join("\n")}

---

## 4. Isca Digital (Lead Generator)
* **Título:** "${leadGen.title}"
* **Formato:** ${leadGen.format}
* **Estrutura sugerida:**
${Array.isArray(leadGen.outline) ? leadGen.outline.map((out: string) => `  - ${out}`).join("\n") : ""}

---

## 5. Sequência de E-mails de Vendas
${salesEmails.map((email: any, idx: number) => `### E-mail ${idx + 1}: ${email.subject}\n\n${email.body}\n`).join("\n---\n\n")}

---

## 6. Sequência de E-mails de Nutrição
${nurtureEmails.map((email: any, idx: number) => `### E-mail ${idx + 1}: ${email.subject}\n\n${email.body}\n`).join("\n---\n\n")}
`
    } else if (format === "html" || format === "pdf") {
      // Retorna HTML amigável para leitura ou para impressão direta em PDF
      contentType = format === "pdf" ? "application/pdf" : "text/html; charset=utf-8"
      
      fileContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Estratégia SB7 - ${project.name}</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: #0D0D0D;
      color: #F0EDE6;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      line-height: 1.6;
    }
    h1, h2, h3 {
      color: #FF3D57;
      font-weight: 800;
    }
    h1 {
      font-size: 2.5em;
      border-bottom: 2px solid #1F1F1F;
      padding-bottom: 15px;
    }
    h2 {
      font-size: 1.8em;
      margin-top: 40px;
      border-bottom: 1px solid #1F1F1F;
      padding-bottom: 8px;
    }
    .one-liner {
      background: #171717;
      border-left: 4px solid #FF8C00;
      padding: 20px;
      border-radius: 12px;
      font-size: 1.2em;
      font-style: italic;
      margin: 20px 0;
    }
    .card {
      background: #171717;
      border: 1px solid #1F1F1F;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 15px;
    }
    .mono {
      font-family: monospace;
      color: #A09D97;
    }
    ul {
      padding-left: 20px;
    }
    @media print {
      body {
        background: white;
        color: black;
        margin: 20px;
      }
      .card {
        background: white;
        border: 1px solid #ddd;
        page-break-inside: avoid;
      }
      h1, h2, h3 {
        color: black;
      }
    }
  </style>
</head>
<body>
  <h1>Estratégia de Marketing: ${project.name}</h1>
  <p class="mono">Versão ${brandScript.version} · Criada em ${brandScript.createdAt.toLocaleDateString("pt-BR")}</p>
  
  <div class="one-liner">
    <strong>One-Liner da Marca:</strong><br>
    "${brandScript.oneLiner}"
  </div>

  <h2>1. BrandScript SB7</h2>
  <div class="card">
    <h3>O Herói</h3>
    <p><strong>Desejo Único:</strong> ${brandScript.heroWant}</p>
  </div>
  
  <div class="card">
    <h3>O Problema</h3>
    <p><strong>Vilão:</strong> ${brandScript.villain || "Não definido"}</p>
    <p><strong>Problema Externo:</strong> ${brandScript.problemExternal}</p>
    <p><strong>Problema Interno:</strong> ${brandScript.problemInternal}</p>
    <p><strong>Problema Filosófico:</strong> ${brandScript.problemPhilosophical}</p>
  </div>

  <div class="card">
    <h3>O Guia</h3>
    <p><strong>Empatia:</strong> ${brandScript.empathy}</p>
    <p><strong>Autoridade:</strong></p>
    <ul>
      ${authList.map((a: any) => `<li><strong>${a.type}:</strong> ${a.value}</li>`).join("")}
    </ul>
  </div>

  <div class="card">
    <h3>O Plano</h3>
    <p><strong>Processo de 3 Passos:</strong></p>
    <ol>
      ${planSteps.map((step: string) => `<li>${step}</li>`).join("")}
    </ol>
    <p><strong>Acordos/Promessas:</strong></p>
    <ul>
      ${planAgreements.map((agreement: string) => `<li>${agreement}</li>`).join("")}
    </ul>
  </div>

  <div class="card">
    <h3>Chamada de Ação (CTA)</h3>
    <p><strong>CTA Direto:</strong> ${brandScript.ctaDirect}</p>
    <p><strong>CTA Transicional:</strong> ${brandScript.ctaTransitional || "Não definido"}</p>
  </div>

  <div class="card">
    <h3>As Apostas</h3>
    <ul>
      ${stakesList.map((stake: string) => `<li>${stake}</li>`).join("")}
    </ul>
  </div>

  <div class="card">
    <h3>O Sucesso</h3>
    <p><strong>Resultados Concretos:</strong> ${successData.concrete}</p>
    <p><strong>Transformação de Identidade:</strong> ${successData.identity}</p>
  </div>

  <h2>2. Wireframe da Homepage</h2>
  ${wireframeList.map((sec: any) => `
    <div class="card">
      <h3 style="color:#FF8C00;">${sec.section}</h3>
      <p style="white-space: pre-line;">${sec.copy}</p>
    </div>
  `).join("")}

  <h2>3. Isca Digital (Lead Generator)</h2>
  <div class="card">
    <h3>${leadGen.title}</h3>
    <p><strong>Formato:</strong> ${leadGen.format}</p>
    <p><strong>Outline dos Capítulos:</strong></p>
    <ul>
      ${Array.isArray(leadGen.outline) ? leadGen.outline.map((out: string) => `<li>${out}</li>`).join("") : ""}
    </ul>
  </div>

  <h2>4. E-mails de Vendas</h2>
  ${salesEmails.map((email: any, idx: number) => `
    <div class="card">
      <h3>E-mail ${idx + 1}: ${email.subject}</h3>
      <p style="white-space: pre-line;">${email.body}</p>
    </div>
  `).join("")}

  <h2>5. E-mails de Nutrição</h2>
  ${nurtureEmails.map((email: any, idx: number) => `
    <div class="card">
      <h3>E-mail ${idx + 1}: ${email.subject}</h3>
      <p style="white-space: pre-line;">${email.body}</p>
    </div>
  `).join("")}

  <script>
    if (window.location.search.includes('format=pdf')) {
      window.onload = function() {
        window.print();
      }
    }
  </script>
</body>
</html>`
    } else if (format === "docx") {
      contentType = "application/msword; charset=utf-8"
      filename = `estrategia-sb7-${project.name.toLowerCase().replace(/\s+/g, "-")}.doc`
      fileContent = `\ufeff<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Estratégia SB7 - ${project.name}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.5; }
    h1 { color: #FF3D57; font-size: 24pt; }
    h2 { color: #333333; font-size: 18pt; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
    h3 { color: #666666; font-size: 14pt; }
    .card { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <h1>Estratégia de Marketing StoryBrand SB7 - ${project.name}</h1>
  <p>Versão ${brandScript.version} · Criada em ${brandScript.createdAt.toLocaleDateString("pt-BR")}</p>
  
  <h2>1. One-Liner da Marca</h2>
  <p><em>"${brandScript.oneLiner}"</em></p>

  <h2>2. BrandScript SB7</h2>
  <h3>O Herói (Desejo Único)</h3>
  <p>${brandScript.heroWant}</p>

  <h3>O Problema</h3>
  <p><strong>Vilão:</strong> ${brandScript.villain || "Não definido"}</p>
  <p><strong>Problema Externo:</strong> ${brandScript.problemExternal}</p>
  <p><strong>Problema Interno:</strong> ${brandScript.problemInternal}</p>
  <p><strong>Problema Filosófico:</strong> ${brandScript.problemPhilosophical}</p>

  <h3>O Guia (Empatia e Autoridade)</h3>
  <p><strong>Empatia:</strong> ${brandScript.empathy}</p>
  <p><strong>Autoridade:</strong></p>
  <ul>
    ${authList.map((a: any) => `<li><strong>${a.type}:</strong> ${a.value}</li>`).join("")}
  </ul>

  <h3>O Plano</h3>
  <ol>
    ${planSteps.map((step: string) => `<li>${step}</li>`).join("")}
  </ol>
  <p><strong>Acordos:</strong> ${planAgreements.join(", ")}</p>

  <h3>Chamada de Ação</h3>
  <p><strong>Direta:</strong> ${brandScript.ctaDirect}</p>
  <p><strong>Transicional:</strong> ${brandScript.ctaTransitional || "Não definido"}</p>

  <h3>As Apostas (Fracasso)</h3>
  <ul>
    ${stakesList.map((stake: string) => `<li>${stake}</li>`).join("")}
  </ul>

  <h3>O Sucesso</h3>
  <p><strong>Concreto:</strong> ${successData.concrete}</p>
  <p><strong>Identidade:</strong> ${successData.identity}</p>

  <h2>3. Homepage Wireframe</h2>
  ${wireframeList.map((sec: any) => `
    <div>
      <h3>Seção: ${sec.section}</h3>
      <p style="white-space: pre-line;">${sec.copy}</p>
    </div>
  `).join("")}

  <h2>4. Isca Digital</h2>
  <p><strong>Título:</strong> ${leadGen.title}</p>
  <p><strong>Formato:</strong> ${leadGen.format}</p>
  <p><strong>Outline:</strong> ${Array.isArray(leadGen.outline) ? leadGen.outline.join(" | ") : ""}</p>

  <h2>5. E-mails de Vendas</h2>
  ${salesEmails.map((email: any, idx: number) => `
    <div>
      <h3>E-mail ${idx + 1}: ${email.subject}</h3>
      <p style="white-space: pre-line;">${email.body}</p>
    </div>
  `).join("")}

  <h2>6. E-mails de Nutrição</h2>
  ${nurtureEmails.map((email: any, idx: number) => `
    <div>
      <h3>E-mail ${idx + 1}: ${email.subject}</h3>
      <p style="white-space: pre-line;">${email.body}</p>
    </div>
  `).join("")}
</body>
</html>`
    }

    // Registra o evento de auditoria no ledger
    await prisma.toolExecution.create({
      data: {
        userId: user.id,
        toolSlug: "storybrand-strategy-generator",
        inputJson: { projectId, format, version: brandScript.version },
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
