// ------------------------------------------------------------
// Simple, self-contained React component implementing:
// - WebSocket connection to your events endpoint
// - Handling of INITIAL, PAGE, ADDED, MODIFIED, DELETED, PAGE_ERROR
// - Infinite scroll via IntersectionObserver (sends { type: "SCROLL" })
// - Lightweight CSS-in-JS styling
// - Minimal reconnection logic (bounded exponential backoff)
// - Small initials avatar (derived from a name/kind)
// ------------------------------------------------------------

import React, { FC, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { TScrollMsg, TServerFrame } from './types'
import { eventKey } from './utils'
import { reducer } from './reducer'
import { EventRow } from './molecules'
import { Styled } from './styled'

type TEventsProps = {
  wsUrl: string // e.g. ws://localhost:3000/api/events?namespace=default&limit=40
  pageSize?: number // SCROLL page size (optional)
  height?: number // optional override
  title?: string
}

export const Events: FC<TEventsProps> = ({ wsUrl, pageSize = 50, height, title = 'Cluster Events' }) => {
  // Reducer-backed store of events
  const [state, dispatch] = useReducer(reducer, { order: [], byKey: {} })

  // Pagination/bookmarking state returned by server
  const [contToken, setContToken] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(false)

  // Connection state & errors for small status UI
  const [connStatus, setConnStatus] = useState<'connecting' | 'open' | 'closed'>('connecting')
  const [lastError, setLastError] = useState<string | undefined>(undefined)

  // ------------------ Refs (mutable, do not trigger render) ------------------
  const wsRef = useRef<WebSocket | null>(null) // current WebSocket instance
  const listRef = useRef<HTMLDivElement | null>(null) // scrollable list element
  const sentinelRef = useRef<HTMLDivElement | null>(null) // bottom sentinel for IO
  const wantMoreRef = useRef(false) // whether sentinel is currently visible
  const fetchingRef = useRef(false) // guard: avoid parallel PAGE requests
  const backoffRef = useRef(750) // ms; increases on failures up to a cap
  const urlRef = useRef(wsUrl) // latest wsUrl (stable inside callbacks)

  // Keep urlRef in sync so connect() uses the latest wsUrl
  useEffect(() => {
    urlRef.current = wsUrl
  }, [wsUrl])

  // Close current WS safely
  const closeWS = useCallback(() => {
    try {
      wsRef.current?.close()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    wsRef.current = null
  }, [])

  // Attempt to request the next page of older events
  const sendScroll = useCallback(() => {
    const token = contToken
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    if (!token || fetchingRef.current) return
    fetchingRef.current = true
    const msg: TScrollMsg = { type: 'SCROLL', continue: token, limit: pageSize }
    wsRef.current.send(JSON.stringify(msg))
  }, [contToken, pageSize])

  // Handle all incoming frames from the server
  const onMessage = useCallback((ev: MessageEvent) => {
    let frame: TServerFrame | undefined
    try {
      frame = JSON.parse(String(ev.data))
    } catch {
      // Ignore malformed frames; you could surface these in UI if desired
      return
    }
    if (!frame) return

    if (frame.type === 'INITIAL') {
      // Replace current list with newest set; set pagination token
      dispatch({ type: 'RESET', items: frame.items })
      setContToken(frame.continue)
      setHasMore(Boolean(frame.continue))
      setLastError(undefined)
      return
    }

    if (frame.type === 'PAGE') {
      // Append older items to the end; clear fetching guard
      dispatch({ type: 'APPEND_PAGE', items: frame.items })
      setContToken(frame.continue)
      setHasMore(Boolean(frame.continue))
      fetchingRef.current = false
      return
    }

    if (frame.type === 'PAGE_ERROR') {
      // Keep live stream but surface pagination error
      setLastError(frame.error || 'Failed to load next page')
      fetchingRef.current = false
      return
    }

    if (frame.type === 'ADDED' || frame.type === 'MODIFIED') {
      // Live update: insert or replace
      dispatch({ type: 'UPSERT', item: frame.item })
      return
    }

    if (frame.type === 'DELETED') {
      // Live delete
      dispatch({ type: 'REMOVE', key: eventKey(frame.item) })
    }
  }, [])

  // Establish and maintain the WebSocket connection with bounded backoff
  const connect = useCallback(() => {
    setConnStatus('connecting')
    setLastError(undefined)

    // Accept absolute ws(s) URLs; otherwise resolve relative to current origin
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
      // Only clear if we're still looking at this instance
      if (wsRef.current === ws) wsRef.current = null
      setConnStatus('closed')
      const wait = Math.min(backoffRef.current, 8000)
      const next = Math.min(wait * 2, 12000)
      backoffRef.current = next
      // Reconnect after a short delay; preserves component mount semantics
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

  // Kick off initial connection on mount; clean up on unmount
  useEffect(() => {
    connect()
    return () => closeWS()
  }, [connect, closeWS])

  // IntersectionObserver to trigger SCROLL when sentinel becomes visible
  useEffect(() => {
    // Get the current DOM element referenced by sentinelRef
    const el = sentinelRef.current

    // If the sentinel element is not mounted yet, exit early
    if (!el) return undefined

    // Create a new IntersectionObserver to watch visibility changes of the sentinel
    const io = new IntersectionObserver(entries => {
      // Determine if any observed element is currently visible in the viewport
      const visible = entries.some(e => e.isIntersecting)

      // Store the current visibility status in a ref (no re-render triggered)
      wantMoreRef.current = visible

      // If sentinel is visible and there are more pages available, request the next page
      if (visible && hasMore) sendScroll()
    })

    // Start observing the sentinel element for intersection events
    io.observe(el)

    // Cleanup: disconnect the observer when component unmounts or dependencies change
    return () => io.disconnect()

    // Dependencies: re-run this effect if hasMore or sendScroll changes
  }, [hasMore, sendScroll])

  // Fallback: if user scrolls near bottom manually, also try to fetch
  const onScroll = useCallback(() => {
    if (!listRef.current) return
    const nearBottom = listRef.current.scrollTop + listRef.current.clientHeight >= listRef.current.scrollHeight - 24
    if (nearBottom && hasMore) sendScroll()
  }, [hasMore, sendScroll])

  const total = state.order.length

  return (
    <Styled.Root $maxHeight={height || 640}>
      <Styled.Header>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Status>
          {connStatus === 'connecting' && 'Connecting…'}
          {connStatus === 'open' && 'Live'}
          {connStatus === 'closed' && 'Reconnecting…'}
          {typeof total === 'number' ? ` · ${total} items` : ''}
        </Styled.Status>
      </Styled.Header>

      {/* Scrollable list of event rows */}
      <Styled.List ref={listRef} onScroll={onScroll}>
        {state.order.map(k => (
          <EventRow key={k} e={state.byKey[k]} />
        ))}
        {/* Infinite scroll sentinel */}
        <Styled.Sentinel ref={sentinelRef} />
      </Styled.List>

      <Styled.Footer>
        {hasMore ? <span>Scroll to load older events…</span> : <span>No more events.</span>}
        {lastError && <span aria-live="polite">· {lastError}</span>}
      </Styled.Footer>
    </Styled.Root>
  )
}
