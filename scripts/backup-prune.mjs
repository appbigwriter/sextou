import { readdirSync, rmSync, statSync, existsSync } from "node:fs"
import { join } from "node:path"

function pruneDirectory(dir, keepCount) {
  if (!existsSync(dir)) {
    return []
  }

  const files = readdirSync(dir)
    .map((name) => {
      const path = join(dir, name)
      const stat = statSync(path)
      return { path, time: stat.mtimeMs, isFile: stat.isFile() }
    })
    .filter((item) => item.isFile)
    .sort((a, b) => b.time - a.time)

  const removed = files.slice(keepCount)

  for (const file of removed) {
    rmSync(file.path, { force: true })
  }

  return removed.map((item) => item.path)
}

const keepDb = Number.parseInt(process.env.BACKUP_KEEP_DB || "14", 10)
const keepProject = Number.parseInt(process.env.BACKUP_KEEP_PROJECT || "14", 10)

const removedDb = pruneDirectory(join(process.cwd(), "backups", "db"), keepDb)
const removedProject = pruneDirectory(join(process.cwd(), "backups", "project"), keepProject)

console.log(`Prune complete. Removed ${removedDb.length} DB backups and ${removedProject.length} project backups.`)
