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

export function getSentMessagesMap(input: unknown) {
  const metadata = asMetadataRecord(input)
  const value = metadata.sentMessages

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, boolean] => typeof entry[0] === "string" && typeof entry[1] === "boolean"
    )
  )
}

export function getRecommendedNextApp(input: unknown) {
  const metadata = asMetadataRecord(input)
  const value = asMetadataRecord(metadata.recommendedNextApp)

  if (Object.keys(value).length === 0) {
    return null
  }

  const slug = typeof value.slug === "string" ? value.slug : null
  const label = typeof value.label === "string" ? value.label : null
  const reason = typeof value.reason === "string" ? value.reason : null

  if (!slug || !label || !reason) {
    return null
  }

  return { slug, label, reason }
}

function getBooleanMap(input: unknown, field: string) {
  const metadata = asMetadataRecord(input)
  const value = metadata[field]

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, boolean] => typeof entry[0] === "string" && typeof entry[1] === "boolean"
    )
  )
}

export function getLaunchPlanChecklistMap(input: unknown) {
  return getBooleanMap(input, "launchPlanChecklist")
}

export function getLaunchPlanTimelineMap(input: unknown) {
  return getBooleanMap(input, "launchPlanTimeline")
}

export function getLocalPartnershipStatusMap(input: unknown) {
  const metadata = asMetadataRecord(input)
  const value = metadata.localPartnershipStatus

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[0] === "string" && typeof entry[1] === "string"
    )
  )
}
