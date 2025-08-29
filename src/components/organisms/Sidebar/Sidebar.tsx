import React, { FC, ReactNode } from 'react'
import { theme } from 'antd'
import { Styled } from './styled'

type TSidebarProps = {
  sidebar?: ReactNode
}

export const Sidebar: FC<TSidebarProps> = ({ sidebar }) => {
  const { token } = theme.useToken()

  return (
    <Styled.BackgroundContainer $borderRadius={token.borderRadius} $borderColor={token.colorBorder}>
      {sidebar}
    </Styled.BackgroundContainer>
  )
}
