import { TEventsV1Event } from '../../types'

// Derive two-letter initials from a string (e.g., "Deployment/my-app" -> "DM")
export const getInitials = (s?: string) => {
  if (!s) return '?'
  const parts = s
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase() || s.slice(0, 2).toUpperCase()
}

// Prefer modern `note`, fallback to legacy `message`
export const eventText = (e: TEventsV1Event) => e.note || e.message || ''

// Prefer `regarding.kind`, fallback to metadata/name; used for avatar initials
export const eventKindName = (e: TEventsV1Event) =>
  e.regarding?.kind || e.metadata?.name || e.regarding?.name || 'event'

// Friendly relative time formatter; returns locale string for >24h
export const timeAgo = (iso?: string) => {
  if (!iso) {
    return ''
  }
  const dt = new Date(iso).getTime()

  const diff = Date.now() - dt

  if (diff < 60_000) {
    return `${Math.max(0, Math.floor(diff / 1000))}s ago`
  }
  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)}m ago`
  }
  if (diff < 86_400_000) {
    return `${Math.floor(diff / 3_600_000)}h ago`
  }

  return new Date(iso).toLocaleString()
}
