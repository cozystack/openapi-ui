import React, { FC } from 'react'
import { Typography } from 'antd'
import { Styled } from './styled'

export const Footer: FC = () => {
  return (
    <Styled.Container>
      <Typography.Text type="secondary">Cozystack © {new Date().getFullYear()}</Typography.Text>
    </Styled.Container>
  )
}
