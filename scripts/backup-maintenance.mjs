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

run("scripts/backup-all.mjs")
run("scripts/backup-prune.mjs")

if (process.env.BACKUP_S3_BUCKET) {
  run("scripts/backup-upload-s3.mjs")
}

console.log("Backup maintenance completed.")
