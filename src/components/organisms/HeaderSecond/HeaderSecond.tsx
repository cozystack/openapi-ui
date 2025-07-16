import React, { FC } from 'react'
import { theme } from 'antd'
import { useParams } from 'react-router-dom'
import { HEAD_SECOND_ROW } from 'constants/blocksSizes'
import { BASE_USE_NAMESPACE_NAV } from 'constants/customizationApiGroupAndVersion'
import { Selector, SelectorInside, SelectorNamespace } from './organisms'
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
        {inside && BASE_USE_NAMESPACE_NAV !== 'true' && (
          <SelectorInside clusterName={clusterName} namespace={namespace} />
        )}
        {!inside && BASE_USE_NAMESPACE_NAV !== 'true' && (
          <Selector
            clusterName={clusterName}
            projectName={projectName || possibleProject}
            instanceName={instanceName || possibleInstance}
          />
        )}
        {BASE_USE_NAMESPACE_NAV === 'true' && <SelectorNamespace clusterName={clusterName} namespace={namespace} />}
      </Styled.PaddingContainer>
    </Styled.BackgroundContainer>
  )
}
