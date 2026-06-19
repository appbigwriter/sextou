import { existsSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-")
}

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}

const outputDir = join(process.cwd(), "backups", "project")
ensureDir(outputDir)

const archiveName = `project-backup-${timestamp()}`
const includeEnv = process.env.INCLUDE_ENV === "1"

const includePaths = [
  "app",
  "components",
  "docs",
  "lib",
  "prisma",
  "public",
  "scripts",
  "styles",
  "types",
  "src",
  ".wwebjs_auth",
  ".wwebjs_cache",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.js",
  "tailwind.config.js",
  "postcss.config.js",
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.easypanel.yml",
  "start.sh",
  "build.sh",
  ".env.example",
  "README.md",
  "DEPLOY.md",
  "DEPLOY_EASYPANEL.md",
]

if (includeEnv) {
  includePaths.push(".env", ".env.local")
}

const existingPaths = includePaths.filter((item) => existsSync(join(process.cwd(), item)))

if (existingPaths.length === 0) {
  console.error("No project paths found to archive.")
  process.exit(1)
}

let result

if (process.platform === "win32") {
  const outputFile = join(outputDir, `${archiveName}.zip`)
  const list = existingPaths.map((item) => `'${item.replace(/'/g, "''")}'`).join(", ")
  const command = `Compress-Archive -Path ${list} -DestinationPath '${outputFile}' -Force`

  result = spawnSync("powershell.exe", ["-NoProfile", "-Command", command], {
    stdio: "inherit",
  })

  if (result.status !== 0) {
    console.error("Project backup failed.")
    process.exit(result.status ?? 1)
  }

  console.log(`Project backup created at ${outputFile}`)
} else {
  const outputFile = join(outputDir, `${archiveName}.tar.gz`)
  result = spawnSync("tar", ["-czf", outputFile, ...existingPaths], {
    stdio: "inherit",
  })

  if (result.status !== 0) {
    console.error("Project backup failed.")
    process.exit(result.status ?? 1)
  }

  console.log(`Project backup created at ${outputFile}`)
}
