import { readdirSync, readFileSync, statSync, existsSync } from "node:fs"
import { join, basename } from "node:path"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const bucket = process.env.BACKUP_S3_BUCKET

if (!bucket) {
  console.error("Missing BACKUP_S3_BUCKET.")
  process.exit(1)
}

const client = new S3Client({
  region: process.env.BACKUP_S3_REGION || "us-east-1",
  endpoint: process.env.BACKUP_S3_ENDPOINT || undefined,
  forcePathStyle: process.env.BACKUP_S3_FORCE_PATH_STYLE === "1",
})

function listFiles(dir) {
  if (!existsSync(dir)) {
    return []
  }

  return readdirSync(dir)
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isFile())
}

const prefix = (process.env.BACKUP_S3_PREFIX || "sextou-backups").replace(/\/+$/, "")
const sources = [
  { dir: join(process.cwd(), "backups", "db"), kind: "db" },
  { dir: join(process.cwd(), "backups", "project"), kind: "project" },
]

for (const source of sources) {
  for (const file of listFiles(source.dir)) {
    const key = `${prefix}/${source.kind}/${basename(file)}`

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: readFileSync(file),
      }),
    )

    console.log(`Uploaded ${file} to s3://${bucket}/${key}`)
  }
}

console.log("S3 upload complete.")
