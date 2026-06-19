import { spawnSync } from "node:child_process"

function run(script) {
  const result = spawnSync(process.execPath, [script], {
    stdio: "inherit",
    env: process.env,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run("scripts/backup-db.mjs")
run("scripts/backup-project.mjs")

console.log("Backup completo finalizado.")
