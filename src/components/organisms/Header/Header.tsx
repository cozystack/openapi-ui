import React, { FC } from 'react'
import { Flex, theme } from 'antd'
import { useParams } from 'react-router-dom'
import { Logo, Documentation, ThemeSelector, User, Selector } from './organisms'
import { Styled } from './styled'

export const Header: FC = () => {
  // const { projectName, instanceName, clusterName, entryType, namespace, syntheticProject } = useParams()
  const { projectName, instanceName, clusterName, namespace, syntheticProject } = useParams()
  const { token } = theme.useToken()

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  return (
    <>
      <Styled.PaddingContainer>
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
      <Styled.BackgroundContainer $bgColor={token.colorFillSecondary} $borderColor={token.colorBorder}>
        <Styled.PaddingContainer>
          <Selector
            clusterName={clusterName}
            projectName={projectName || possibleProject}
            instanceName={instanceName || possibleInstance}
          />
        </Styled.PaddingContainer>
      </Styled.BackgroundContainer>
    </>
  )
}
