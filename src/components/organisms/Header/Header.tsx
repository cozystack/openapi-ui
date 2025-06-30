import React, { FC } from 'react'
import { Flex } from 'antd'
import { HEAD_FIRST_ROW } from 'constants/blocksSizes'
import { Logo, Documentation, ThemeSelector, User } from './organisms'
import { Styled } from './styled'

export const Header: FC = () => {
  return (
    <Styled.PaddingContainer $height={HEAD_FIRST_ROW}>
      <Flex justify="space-between">
        <div>
          <Logo />
        </div>
        <div>
          <Flex gap={10}>
            <Documentation key="SidebarDocumentation" />
            <ThemeSelector />
            <User key="SidebarUser" />
          </Flex>
        </div>
      </Flex>
    </Styled.PaddingContainer>
  )
}
