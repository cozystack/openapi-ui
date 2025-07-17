import React, { FC, ReactNode } from 'react'
import { theme } from 'antd'
import { useParams } from 'react-router-dom'
import { Selector, SelectorInside } from './organisms'
import { Styled } from './styled'

type TSidebarProps = {
  inside?: boolean
  sidebar?: ReactNode
}

export const Sidebar: FC<TSidebarProps> = ({ inside, sidebar }) => {
  const { clusterName } = useParams()
  const { token } = theme.useToken()

  return (
    <Styled.BackgroundContainer $borderRadius={token.borderRadius} $borderColor={token.colorBorder}>
      <Styled.ClusterSelectorContainer>
        {inside ? <SelectorInside clusterName={clusterName} /> : <Selector clusterName={clusterName} />}
      </Styled.ClusterSelectorContainer>
      {sidebar}
    </Styled.BackgroundContainer>
  )
}
