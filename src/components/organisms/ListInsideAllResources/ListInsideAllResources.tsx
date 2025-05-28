import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getGroupsByCategory,
  groupsToTreeData,
  getBuiltinTreeData,
  TreeWithSearch,
  useApisResourceTypes,
  useBuiltinResourceTypes,
} from '@prorobotech/openapi-k8s-toolkit'
import { Spin, Alert } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { Styled } from './styled'

type TListInsideAllResourcesProps = {
  namespace?: string
}

export const ListInsideAllResources: FC<TListInsideAllResourcesProps> = ({ namespace }) => {
  const navigate = useNavigate()
  const cluster = useSelector((state: RootState) => state.cluster.cluster)
  const swagger = useSelector((state: RootState) => state.swagger.swagger)
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const apiGroupList = useApisResourceTypes({
    clusterName: cluster,
  })

  const builtInData = useBuiltinResourceTypes({
    clusterName: cluster,
  })

  const { crdGroups, nonCrdGroups, builtinGroups, apiExtensionVersion } = getGroupsByCategory({
    swagger,
    namespace,
    apiGroupListData: apiGroupList.data,
    builtinResourceTypesData: builtInData.data,
  })

  return (
    <Styled.Grid>
      {apiGroupList.error && <Alert message={`An error has occurred: ${apiGroupList.error?.message} `} type="error" />}

      <Styled.FullHeighCard title="CRD Groups">
        {apiGroupList.isPending && <Spin />}
        {apiGroupList.error && (
          <Alert message={`An error has occurred: ${apiGroupList.error?.message} `} type="error" />
        )}
        {!apiGroupList.error && crdGroups && (
          <TreeWithSearch
            treeData={groupsToTreeData(
              crdGroups.map(({ versions, preferredVersion }) => ({
                apis: versions.map(({ groupVersion }) => groupVersion),
                highlightString: preferredVersion.groupVersion,
              })),
            )}
            onSelect={(_, info) => {
              if (info.node.isLeaf) {
                navigate(
                  `${baseprefix}/inside/${cluster}${namespace ? `/${namespace}` : ''}/crds-by-api/${
                    info.node.key
                  }/${apiExtensionVersion}`,
                )
              }
            }}
          />
        )}
      </Styled.FullHeighCard>

      <Styled.FullHeighCard title="API Groups">
        {apiGroupList.isPending && <Spin />}
        {apiGroupList.error && (
          <Alert message={`An error has occurred: ${apiGroupList.error?.message} `} type="error" />
        )}
        {!apiGroupList.error && nonCrdGroups && (
          <TreeWithSearch
            treeData={groupsToTreeData(
              nonCrdGroups.map(({ versions, preferredVersion }) => ({
                apis: versions.map(({ groupVersion }) => groupVersion),
                highlightString: preferredVersion.groupVersion,
              })),
            )}
            onSelect={(_, info) => {
              if (info.node.isLeaf) {
                navigate(
                  `${baseprefix}/inside/${cluster}${namespace ? `/${namespace}` : ''}/apis-by-api/${info.node.key}`,
                )
              }
            }}
          />
        )}
      </Styled.FullHeighCard>

      <Styled.FullHeighCard title="Builtin Groups">
        {builtInData.isPending && <Spin />}
        {builtInData.error && <Alert message={`An error has occurred: ${builtInData.error?.message} `} type="error" />}
        {!builtInData.error && builtinGroups && (
          <TreeWithSearch
            treeData={getBuiltinTreeData(
              builtinGroups.filter(({ name }) => !name.includes('/')).map(({ name }) => name),
            )}
            onSelect={(_, info) => {
              if (info.node.isLeaf) {
                navigate(`${baseprefix}/${cluster}${namespace ? `/${namespace}` : ''}/builtin-table/${info.node.key}`)
              }
            }}
          />
        )}
      </Styled.FullHeighCard>
    </Styled.Grid>
  )
}
