import React, { FC } from 'react'
import { To } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { TitleWithNoMargin } from '../TitleWithNoMargin'
import { Styled } from './styled'

type TBackLinkProps = {
  title?: string
  className?: string
  to?: To
}

export const BackLink: FC<TBackLinkProps> = ({ to, title }) => {
  return (
    <Styled.Container>
      {to && (
        <Styled.CustomLink to={to}>
          <TitleWithNoMargin level={5}>
            <ArrowLeftOutlined />
          </TitleWithNoMargin>
        </Styled.CustomLink>
      )}
      <TitleWithNoMargin level={5}>{title}</TitleWithNoMargin>
    </Styled.Container>
  )
}
