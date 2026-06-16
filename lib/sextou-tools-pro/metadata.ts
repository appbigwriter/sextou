type MetadataRecord = Record<string, unknown>

export function asMetadataRecord(input: unknown): MetadataRecord {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {}
  }

  return input as MetadataRecord
}

export function getOperationalStatus(input: unknown) {
  const metadata = asMetadataRecord(input)
  const value = metadata.operationalStatus
  return typeof value === "string" ? value : null
}

export function getPublishedPostsMap(input: unknown) {
  const metadata = asMetadataRecord(input)
  const value = metadata.publishedPosts

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, boolean] => typeof entry[0] === "string" && typeof entry[1] === "boolean"
    )
  )
}
