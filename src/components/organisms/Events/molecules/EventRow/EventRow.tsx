import React, { FC, useMemo } from 'react'
import { Flex } from 'antd'
import { TEventsV1Event } from '../../types'
import { getInitials, eventKindName, eventText, timeAgo } from './utils'
import { Styled } from './styled'

type TEventRowProps = {
  e: TEventsV1Event
}

export const EventRow: FC<TEventRowProps> = ({ e }) => {
  const initials = useMemo(() => getInitials(eventKindName(e)), [e])
  const tone = (e.type || '').toLowerCase() === 'warning' ? 'warning' : 'normal'

  return (
    <Styled.Card>
      <Styled.Avatar aria-hidden>{initials}</Styled.Avatar>
      <div>
        <Flex align="center" gap={8} wrap>
          <Styled.Primary>{e.reason || e.action || 'Event'}</Styled.Primary>
          <Styled.Badge $tone={tone}>{e.type || 'Normal'}</Styled.Badge>
          {e.regarding?.kind && (
            <Styled.Meta>
              {e.regarding.kind}
              {e.regarding.name ? ` · ${e.regarding.name}` : ''}
            </Styled.Meta>
          )}
        </Flex>
        {eventText(e) && <Styled.Secondary>{eventText(e)}</Styled.Secondary>}
        <Styled.Meta>
          {e.metadata?.namespace ? `${e.metadata.namespace} · ` : ''}
          {e.metadata?.name || ''}
          {e.metadata?.creationTimestamp ? ` · ${timeAgo(e.metadata.creationTimestamp)}` : ''}
        </Styled.Meta>
      </div>
    </Styled.Card>
  )
}
