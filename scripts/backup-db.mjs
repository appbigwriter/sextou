import { mkdirSync, existsSync } from "node:fs"
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

const backupUrl = process.env.BACKUP_DATABASE_URL || process.env.DATABASE_URL

if (!backupUrl) {
  console.error("Missing BACKUP_DATABASE_URL or DATABASE_URL.")
  process.exit(1)
}

const dumpBinary = process.env.PG_DUMP_PATH || "pg_dump"
const outputDir = join(process.cwd(), "backups", "db")
ensureDir(outputDir)

const outputFile = join(outputDir, `db-backup-${timestamp()}.dump`)

const args = [
  "--format=custom",
  "--no-owner",
  "--no-privileges",
  `--file=${outputFile}`,
  backupUrl,
]

const result = spawnSync(dumpBinary, args, {
  stdio: "inherit",
  shell: process.platform === "win32",
})

if (result.status !== 0) {
  console.error("Database backup failed.")
  process.exit(result.status ?? 1)
}

console.log(`Database backup created at ${outputFile}`)
