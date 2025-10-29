import React, { FC } from 'react'
import { theme as antdtheme, Flex } from 'antd'
import { EarthIcon, getUppercase, hslFromString, Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { TEventsV1Event } from '../../types'
import { eventText, timeAgo } from './utils'
import { Styled } from './styled'

type TEventRowProps = {
  e: TEventsV1Event
}

export const EventRow: FC<TEventRowProps> = ({ e }) => {
  const { token } = antdtheme.useToken()
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)

  const abbr = e.regarding?.kind ? getUppercase(e.regarding.kind) : undefined
  const bgColor = e.regarding?.kind && abbr ? hslFromString(abbr, theme) : 'initial'
  const bgColorNamespace = hslFromString('NS', theme)

  return (
    <Styled.Card $colorText={token.colorText}>
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={16}>
          <Flex align="center" gap={8}>
            <Styled.Abbr $bgColor={bgColor}>{abbr}</Styled.Abbr>
            {e.regarding?.name}
          </Flex>
          {e.metadata?.namespace && (
            <Flex align="center" gap={8}>
              <Styled.Abbr $bgColor={bgColorNamespace}>NS</Styled.Abbr>
              {e.metadata?.namespace}
            </Flex>
          )}
        </Flex>
        {e.metadata?.creationTimestamp && (
          <Flex gap={4} align="center">
            <div>
              <EarthIcon />
            </div>
            <Styled.TimeStamp>{timeAgo(e.metadata?.creationTimestamp)}</Styled.TimeStamp>
          </Flex>
        )}
      </Flex>
      <Spacer $space={16} $samespace />
      <Flex gap={8} wrap>
        <Styled.Title>{e.reason || e.action || 'Event'}</Styled.Title>
        <Styled.Title>•</Styled.Title>
        <Styled.Title>{e.type || 'Normal'}</Styled.Title>
      </Flex>
      <Spacer $space={16} $samespace />
      {eventText(e) && <div>{eventText(e)}</div>}
    </Styled.Card>
  )
}
