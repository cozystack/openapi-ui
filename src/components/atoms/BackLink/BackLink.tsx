import React, { FC } from 'react'
import { To } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { TitleWithNoTopMargin } from '../TitleWithNoTopMargin'
import { Styled } from './styled'

type TBackLinkProps = {
  title?: string
  className?: string
  to: To
}

export const BackLink: FC<TBackLinkProps> = ({ to, title }) => {
  return (
    <Styled.Container>
      <Styled.CustomLink to={to}>
        <TitleWithNoTopMargin level={4}>
          <ArrowLeftOutlined />
        </TitleWithNoTopMargin>
      </Styled.CustomLink>
      <TitleWithNoTopMargin level={4}>{title}</TitleWithNoTopMargin>
    </Styled.Container>
  )
}
