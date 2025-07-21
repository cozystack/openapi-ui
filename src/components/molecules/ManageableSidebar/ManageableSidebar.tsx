import React, { FC, useState, useEffect } from 'react'
import { theme as antdtheme } from 'antd'
import { useLocation, useParams } from 'react-router-dom'
import { ManageableSidebarWithDataProvider } from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { HEAD_FIRST_ROW, SIDEBAR_CLUSTER_HEIGHT } from 'constants/blocksSizes'
import { BASE_API_GROUP, BASE_API_VERSION } from 'constants/customizationApiGroupAndVersion'
import { Styled } from './styled'

type TManageableSidebarProps = {
  instanceName?: string
  projectName?: string
  idToCompare: string
  currentTags?: string[]
}

export const ManageableSidebar: FC<TManageableSidebarProps> = ({
  projectName,
  instanceName,
  idToCompare,
  currentTags,
}) => {
  const location = useLocation()
  const { pathname } = useLocation()
  const params = useParams()
  const clusterName = params?.clusterName || ''
  const namespace = params?.namespace || ''
  const syntheticProject = params?.syntheticProject || ''
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)
  const { token } = antdtheme.useToken()

  const [height, setHeight] = useState(0)

  useEffect(() => {
    const height = window.innerHeight - HEAD_FIRST_ROW - SIDEBAR_CLUSTER_HEIGHT - 2
    setHeight(height)

    const handleResize = () => {
      setHeight(height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const replaceValuesPartsOfUrls = location.pathname
    .split('/')
    .reduce<Record<string, string | undefined>>((acc, value, index) => {
      acc[index.toString()] = value
      return acc
    }, {})

  return (
    <Styled.Container
      $isDark={theme === 'dark'}
      $colorInfoBg={token.colorInfoBg}
      $colorBgContainer={token.colorBgContainer}
      $colorFillQuaternary={token.colorFillQuaternary}
      $colorPrimaryHover={token.colorPrimaryHover}
      $colorBorder={token.colorBorder}
      $maxHeight={height}
    >
      <ManageableSidebarWithDataProvider
        uri={`/api/clusters/${clusterName}/k8s/apis/${BASE_API_GROUP}/${BASE_API_VERSION}/sidebars/`}
        refetchInterval={5000}
        isEnabled={clusterName !== undefined}
        replaceValues={{
          clusterName,
          projectName,
          instanceName,
          namespace,
          syntheticProject,
          ...replaceValuesPartsOfUrls,
        }}
        pathname={pathname}
        idToCompare={idToCompare}
        currentTags={currentTags}
        noMarginTop
      />
    </Styled.Container>
  )
}
