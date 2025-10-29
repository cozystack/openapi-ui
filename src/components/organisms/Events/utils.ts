import { TEventsV1Event } from './types'

// Unique key per event for stable list rendering and updates
export const eventKey = (e: TEventsV1Event) => {
  const n = e.metadata?.name ?? ''
  const ns = e.metadata?.namespace ?? ''
  return `${ns}/${n}`
}
