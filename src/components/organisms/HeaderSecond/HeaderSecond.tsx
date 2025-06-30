import React, { FC } from 'react'
import { theme } from 'antd'
import { useParams } from 'react-router-dom'
import { HEAD_SECOND_ROW } from 'constants/blocksSizes'
import { Selector, SelectorInside } from './organisms'
import { Styled } from './styled'

type THeaderProps = {
  inside?: boolean
}

export const HeaderSecond: FC<THeaderProps> = ({ inside }) => {
  // const { projectName, instanceName, clusterName, entryType, namespace, syntheticProject } = useParams()
  const { projectName, instanceName, clusterName, namespace, syntheticProject } = useParams()
  const { token } = theme.useToken()

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  return (
    <Styled.BackgroundContainer $bgColor={token.colorFillSecondary} $borderRadius={token.borderRadius}>
      <Styled.PaddingContainer $height={HEAD_SECOND_ROW}>
        {inside ? (
          <SelectorInside clusterName={clusterName} namespace={namespace} />
        ) : (
          <Selector
            clusterName={clusterName}
            projectName={projectName || possibleProject}
            instanceName={instanceName || possibleInstance}
          />
        )}
      </Styled.PaddingContainer>
    </Styled.BackgroundContainer>
  )
}
