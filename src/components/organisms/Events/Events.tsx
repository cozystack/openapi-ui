import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'

// ------------------------------------------------------------
// Simple, self-contained React component implementing:
// - WebSocket connection to your events endpoint
// - Handling of INITIAL, PAGE, ADDED, MODIFIED, DELETED, PAGE_ERROR
// - Infinite scroll via IntersectionObserver (sends { type: "SCROLL" })
// - Lightweight CSS-in-JS styling
// - Minimal reconnection logic
// - Small initials avatar (derived from a name/kind)
// ------------------------------------------------------------

// Types for messages coming from the server
// (Kept permissive to avoid bringing in k8s types.)

type TWatchPhase = 'ADDED' | 'MODIFIED' | 'DELETED' | 'BOOKMARK'

type EventsV1Event = {
  metadata?: {
    name?: string
    namespace?: string
    resourceVersion?: string
    creationTimestamp?: string
  }
  type?: string // Normal | Warning
  reason?: string
  note?: string // message text in events.k8s.io/v1
  message?: string // legacy fallback
  reportingController?: string
  reportingInstance?: string
  deprecatedCount?: number
  action?: string
  eventTime?: string
  regarding?: {
    kind?: string
    name?: string
    namespace?: string
  }
  deprecatedSource?: {
    component?: string
    host?: string
  }
}

// Incoming frames from the server

type InitialFrame = {
  type: 'INITIAL'
  items: EventsV1Event[]
  continue?: string
  remainingItemCount?: number
  resourceVersion?: string
}

type PageFrame = {
  type: 'PAGE'
  items: EventsV1Event[]
  continue?: string
  remainingItemCount?: number
}

type PageErrorFrame = {
  type: 'PAGE_ERROR'
  error: string
}

type DeltaFrame = {
  type: TWatchPhase // ADDED | MODIFIED | DELETED
  item: EventsV1Event
}

type ServerFrame = InitialFrame | PageFrame | PageErrorFrame | DeltaFrame

// Outgoing scroll request to server

type ScrollMsg = {
  type: 'SCROLL'
  continue: string
  limit?: number
}

// ------------------------------------------------------------
// Styling (CSS-in-JS)
// ------------------------------------------------------------

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    height: '100%',
    maxHeight: 640,
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    background: '#fff',
  },
  header: {
    padding: '12px 16px',
    borderBottom: '1px solid #f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fafafa',
  },
  title: { fontSize: 14, fontWeight: 600, color: '#111827' },
  status: { fontSize: 12, color: '#6b7280' },
  list: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: 8,
  },
  card: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr',
    gap: 12,
    padding: 10,
    margin: '6px 4px',
    border: '1px solid #eef1f4',
    borderRadius: 10,
    background: '#ffffff',
    boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    background: '#eef2ff',
    color: '#3730a3',
    userSelect: 'none' as const,
    letterSpacing: 0.3,
  },
  primary: { fontSize: 14, fontWeight: 600, color: '#0f172a' },
  secondary: { fontSize: 12, color: '#334155' },
  meta: { fontSize: 11, color: '#64748b' },
  sentinel: { height: 1 },
  footer: {
    borderTop: '1px solid #f0f2f5',
    padding: '8px 12px',
    fontSize: 12,
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  badge: (tone: 'warning' | 'normal') => ({
    fontSize: 10,
    padding: '2px 6px',
    borderRadius: 6,
    background: tone === 'warning' ? '#fef3c7' : '#e5f4ff',
    color: tone === 'warning' ? '#92400e' : '#0b5394',
    border: `1px solid ${tone === 'warning' ? '#fde68a' : '#cfe8ff'}`,
    fontWeight: 600,
  }),
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

const getInitials = (s?: string) => {
  if (!s) return '?'
  const parts = s
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase() || s.slice(0, 2).toUpperCase()
}

const eventKey = (e: EventsV1Event) => {
  const n = e.metadata?.name ?? ''
  const ns = e.metadata?.namespace ?? ''
  return `${ns}/${n}`
}

const eventText = (e: EventsV1Event) => e.note || e.message || ''

const eventKindName = (e: EventsV1Event) => e.regarding?.kind || e.metadata?.name || e.regarding?.name || 'event'

const timeAgo = (iso?: string) => {
  if (!iso) return ''
  const dt = new Date(iso).getTime()
  const diff = Date.now() - dt
  if (diff < 60_000) return `${Math.max(0, Math.floor(diff / 1000))}s ago`
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return new Date(iso).toLocaleString()
}

// ------------------------------------------------------------
// Reducer to maintain a keyed list of events, supporting ADDED/MODIFIED/DELETED
// ------------------------------------------------------------

type State = {
  order: string[] // list of keys (newest first)
  byKey: Record<string, EventsV1Event>
}

type Action =
  | { type: 'RESET'; items: EventsV1Event[] }
  | { type: 'APPEND_PAGE'; items: EventsV1Event[] } // for older pages (append to end)
  | { type: 'UPSERT'; item: EventsV1Event } // ADDED/MODIFIED
  | { type: 'REMOVE'; key: string } // DELETED

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'RESET': {
      const order = action.items.map(eventKey)
      const byKey: State['byKey'] = {}
      // eslint-disable-next-line no-return-assign
      action.items.forEach(it => (byKey[eventKey(it)] = it))
      return { order, byKey }
    }
    case 'APPEND_PAGE': {
      const next = { ...state.byKey }
      const addKeys: string[] = []
      action.items.forEach(it => {
        const k = eventKey(it)
        if (!next[k]) addKeys.push(k)
        next[k] = it
      })
      return { order: [...state.order, ...addKeys], byKey: next }
    }
    case 'UPSERT': {
      const k = eventKey(action.item)
      const exists = Boolean(state.byKey[k])
      const byKey = { ...state.byKey, [k]: action.item }
      const order = exists ? state.order : [k, ...state.order]
      return { order, byKey }
    }
    case 'REMOVE': {
      if (!state.byKey[action.key]) return state
      const byKey = { ...state.byKey }
      delete byKey[action.key]
      return { order: state.order.filter(k => k !== action.key), byKey }
    }
    default:
      return state
  }
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

type Props = {
  wsUrl: string // e.g. ws://localhost:3000/api/events?namespace=default&limit=40
  pageSize?: number // SCROLL page size (optional)
  height?: number | string // optional override
  title?: string
}

const EventRow: React.FC<{ e: EventsV1Event }> = ({ e }) => {
  const initials = useMemo(() => getInitials(eventKindName(e)), [e])
  const tone = (e.type || '').toLowerCase() === 'warning' ? 'warning' : 'normal'
  return (
    <div style={styles.card}>
      <div style={styles.avatar} aria-hidden>
        {initials}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={styles.primary}>{e.reason || e.action || 'Event'}</div>
          <span style={styles.badge(tone)}>{e.type || 'Normal'}</span>
          {e.regarding?.kind && (
            <span style={styles.meta}>
              {e.regarding.kind}
              {e.regarding.name ? ` · ${e.regarding.name}` : ''}
            </span>
          )}
        </div>
        {eventText(e) && <div style={styles.secondary}>{eventText(e)}</div>}
        <div style={styles.meta}>
          {e.metadata?.namespace ? `${e.metadata.namespace} · ` : ''}
          {e.metadata?.name || ''}
          {e.metadata?.creationTimestamp ? ` · ${timeAgo(e.metadata.creationTimestamp)}` : ''}
        </div>
      </div>
    </div>
  )
}

export const Events: React.FC<Props> = ({ wsUrl, pageSize = 50, height, title = 'Cluster Events' }) => {
  const [state, dispatch] = useReducer(reducer, { order: [], byKey: {} })
  const [contToken, setContToken] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [connStatus, setConnStatus] = useState<'connecting' | 'open' | 'closed'>('connecting')
  const [lastError, setLastError] = useState<string | undefined>(undefined)

  const wsRef = useRef<WebSocket | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const wantMoreRef = useRef(false)
  const fetchingRef = useRef(false)
  const backoffRef = useRef(750)
  const urlRef = useRef(wsUrl)

  useEffect(() => {
    urlRef.current = wsUrl
  }, [wsUrl])

  const closeWS = useCallback(() => {
    try {
      wsRef.current?.close()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    wsRef.current = null
  }, [])

  const sendScroll = useCallback(() => {
    const token = contToken
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    if (!token || fetchingRef.current) return
    fetchingRef.current = true
    const msg: ScrollMsg = { type: 'SCROLL', continue: token, limit: pageSize }
    wsRef.current.send(JSON.stringify(msg))
  }, [contToken, pageSize])

  const onMessage = useCallback((ev: MessageEvent) => {
    let frame: ServerFrame | undefined
    try {
      frame = JSON.parse(String(ev.data))
    } catch {
      return
    }
    if (!frame) return

    if (frame.type === 'INITIAL') {
      dispatch({ type: 'RESET', items: frame.items })
      setContToken(frame.continue)
      setHasMore(Boolean(frame.continue))
      setLastError(undefined)
      return
    }

    if (frame.type === 'PAGE') {
      dispatch({ type: 'APPEND_PAGE', items: frame.items })
      setContToken(frame.continue)
      setHasMore(Boolean(frame.continue))
      fetchingRef.current = false
      return
    }

    if (frame.type === 'PAGE_ERROR') {
      setLastError(frame.error || 'Failed to load next page')
      fetchingRef.current = false
      return
    }

    if (frame.type === 'ADDED' || frame.type === 'MODIFIED') {
      dispatch({ type: 'UPSERT', item: frame.item })
      return
    }

    if (frame.type === 'DELETED') {
      dispatch({ type: 'REMOVE', key: eventKey(frame.item) })
    }
  }, [])

  const connect = useCallback(() => {
    setConnStatus('connecting')
    setLastError(undefined)

    const buildWsUrl = (raw: string) => {
      if (/^wss?:/i.test(raw)) return raw // already absolute ws(s)
      const origin = window.location.origin.replace(/^http/i, 'ws')
      if (raw.startsWith('/')) return `${origin}${raw}`
      return `${origin}/${raw}`
    }

    const ws = new WebSocket(buildWsUrl(urlRef.current))
    wsRef.current = ws

    ws.addEventListener('open', () => {
      setConnStatus('open')
      backoffRef.current = 750 // reset backoff on success
    })

    ws.addEventListener('message', onMessage)

    const scheduleReconnect = () => {
      if (wsRef.current === ws) wsRef.current = null
      setConnStatus('closed')
      const wait = Math.min(backoffRef.current, 8000)
      const next = Math.min(wait * 2, 12000)
      backoffRef.current = next
      // reconnection timer
      setTimeout(() => {
        connect()
      }, wait)
    }

    ws.addEventListener('close', scheduleReconnect)
    ws.addEventListener('error', () => {
      setLastError('WebSocket error')
      scheduleReconnect()
    })
  }, [onMessage])

  useEffect(() => {
    connect()
    return () => closeWS()
  }, [connect, closeWS])

  // IntersectionObserver to trigger SCROLL when sentinel becomes visible
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return undefined

    const io = new IntersectionObserver(entries => {
      const visible = entries.some(e => e.isIntersecting)
      wantMoreRef.current = visible
      if (visible && hasMore) sendScroll()
    })

    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, sendScroll])

  // If user scrolls manually and hits bottom, attempt to fetch
  const onScroll = useCallback(() => {
    if (!listRef.current) return
    const nearBottom = listRef.current.scrollTop + listRef.current.clientHeight >= listRef.current.scrollHeight - 24
    if (nearBottom && hasMore) sendScroll()
  }, [hasMore, sendScroll])

  const total = state.order.length

  return (
    <div style={{ ...styles.root, maxHeight: height ?? styles.root.maxHeight }}>
      <div style={styles.header}>
        <div style={styles.title}>{title}</div>
        <div style={styles.status}>
          {connStatus === 'connecting' && 'Connecting…'}
          {connStatus === 'open' && 'Live'}
          {connStatus === 'closed' && 'Reconnecting…'}
          {typeof total === 'number' ? ` · ${total} items` : ''}
        </div>
      </div>

      <div style={styles.list} ref={listRef} onScroll={onScroll}>
        {state.order.map(k => (
          <EventRow key={k} e={state.byKey[k]} />
        ))}
        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} style={styles.sentinel} />
      </div>

      <div style={styles.footer}>
        {hasMore ? <span>Scroll to load older events…</span> : <span>No more events.</span>}
        {lastError && <span aria-live="polite">· {lastError}</span>}
      </div>
    </div>
  )
}
