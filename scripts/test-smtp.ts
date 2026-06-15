import fs from "node:fs"
import path from "node:path"
import nodemailer from "nodemailer"

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return
  }

  const content = fs.readFileSync(filePath, "utf8")
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const equalsIndex = trimmed.indexOf("=")
    if (equalsIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, equalsIndex).trim()
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^"(.*)"$/, "$1")

    if (!process.env[key] && value) {
      process.env[key] = value
    }
  }
}

function loadProjectEnv() {
  const root = process.cwd()
  loadEnvFile(path.join(root, ".env.local"))
  loadEnvFile(path.join(root, ".env"))
}

function getArg(name: string) {
  const index = process.argv.indexOf(name)
  if (index === -1 || index + 1 >= process.argv.length) {
    return null
  }

  const value = process.argv[index + 1]
  return value.startsWith("--") ? null : value
}

async function main() {
  loadProjectEnv()

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || "587")
  const secure = process.env.SMTP_SECURE === "true"
  const user = process.env.SMTP_USER
  const password = process.env.SMTP_PASSWORD
  const from = process.env.SMTP_FROM
  const to = getArg("--to")

  if (!host || !user || !password || !from) {
    console.error("SMTP config incomplete.")
    console.error("Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM")
    process.exitCode = 1
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password,
    },
  })

  console.log(`Verifying SMTP: ${host}:${port} secure=${secure}`)

  try {
    await transporter.verify()
    console.log("SMTP connection OK")
  } catch (error) {
    console.error("SMTP verify failed:")
    console.error(error)
    process.exitCode = 1
    return
  }

  if (!to) {
    console.log("No --to provided. Verification only.")
    return
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "SMTP Test - Sextou Tools",
      text: `SMTP test OK at ${new Date().toISOString()}`,
      html: `<p>SMTP test OK at <strong>${new Date().toISOString()}</strong>.</p>`,
      replyTo: to,
    })

    console.log(`Test email sent to ${to}`)
    console.log(`Message ID: ${info.messageId}`)
  } catch (error) {
    console.error("SMTP send test failed:")
    console.error(error)
    process.exitCode = 1
  }
}

void main()
