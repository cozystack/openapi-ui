import React, { FC, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Spin, Alert, Button, Flex } from 'antd'
import { PlusOutlined, ClearOutlined, MinusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import {
  EnrichedTableProvider,
  usePermissions,
  DeleteModal,
  DeleteModalMany,
  checkIfBuiltInInstanceNamespaceScoped,
  useBuiltinResources,
} from '@prorobotech/openapi-k8s-toolkit'
import { FlexGrow, OverflowMaxHeightContainer } from 'components'
import { TABLE_PROPS } from 'constants/tableProps'
import {
  HEAD_FIRST_ROW,
  HEAD_SECOND_ROW,
  FOOTER_HEIGHT,
  NAV_HEIGHT,
  CONTENT_CARD_PADDING,
  TABLE_ADD_BUTTON_HEIGHT,
} from 'constants/blocksSizes'

type TTableBuiltinInfoProps = {
  namespace?: string
  typeName: string
  limit: string | null
  inside?: boolean
}

export const TableBuiltinInfo: FC<TTableBuiltinInfoProps> = ({ namespace, typeName, limit, inside }) => {
  const navigate = useNavigate()
  const params = useParams()
  const cluster = useSelector((state: RootState) => state.cluster.cluster)
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<false | { name: string; endpoint: string }>(false)
  const [isDeleteModalManyOpen, setIsDeleteModalManyOpen] = useState<false | { name: string; endpoint: string }[]>(
    false,
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRowsData, setSelectedRowsData] = useState<{ name: string; endpoint: string }[]>([])
  const [isNamespaced, setIsNamespaced] = useState<boolean>()

  const [height, setHeight] = useState(0)

  useEffect(() => {
    const height =
      window.innerHeight -
      HEAD_FIRST_ROW -
      HEAD_SECOND_ROW -
      NAV_HEIGHT -
      CONTENT_CARD_PADDING * 2 -
      FOOTER_HEIGHT -
      TABLE_ADD_BUTTON_HEIGHT
    setHeight(height)

    const handleResize = () => {
      setHeight(height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const createPermission = usePermissions({
    apiGroup: '',
    typeName,
    namespace: '',
    clusterName: cluster,
    verb: 'create',
    refetchInterval: false,
  })

  const updatePermission = usePermissions({
    apiGroup: '',
    typeName,
    namespace: '',
    clusterName: cluster,
    verb: 'update',
    refetchInterval: false,
  })

  const deletePermission = usePermissions({
    apiGroup: '',
    typeName,
    namespace: '',
    clusterName: cluster,
    verb: 'delete',
    refetchInterval: false,
  })

  useEffect(() => {
    checkIfBuiltInInstanceNamespaceScoped({
      typeName,
      clusterName: cluster,
    }).then(({ isNamespaceScoped }) => {
      if (isNamespaceScoped) {
        setIsNamespaced(isNamespaceScoped)
      }
    })
  }, [cluster, typeName])

  const { isPending, error, data } = useBuiltinResources({
    clusterName: cluster,
    namespace,
    typeName,
    limit,
  })

  const onDeleteHandle = (name: string, endpoint: string) => {
    setIsDeleteModalOpen({ name, endpoint })
  }

  const clearSelected = () => {
    setSelectedRowKeys([])
    setSelectedRowsData([])
  }

  return (
    <>
      {isPending && <Spin />}
      {error && <Alert message={`An error has occurred: ${error?.message} `} type="error" />}
      <OverflowMaxHeightContainer $maxHeight={height}>
        {!error && data && (
          <EnrichedTableProvider
            key={`/v1/${typeName}`}
            customizationId={`default-/v1/${typeName}`}
            tableMappingsReplaceValues={{
              clusterName: params.clusterName,
              projectName: params.projectName,
              instanceName: params.instanceName,
              namespace: params.namespace,
              syntheticProject: params.syntheticProject,
              entryType: params.entryType,
              apiGroup: params.apiGroup,
              apiVersion: params.apiVersion,
              typeName: params.typeName,
              entryName: params.entryName,
              apiExtensionVersion: params.apiExtensionVersion,
              crdName: params.crdName,
            }}
            cluster={cluster}
            theme={theme}
            baseprefix={inside ? `${baseprefix}/inside` : baseprefix}
            dataItems={data.items}
            dataForControls={{
              cluster,
              syntheticProject: params.syntheticProject,
              pathPrefix: 'forms/builtin',
              typeName,
              apiVersion: 'v1',
              backlink: `${baseprefix}${inside ? '/inside' : ''}/${cluster}${namespace ? `/${namespace}` : ''}${
                params.syntheticProject ? `/${params.syntheticProject}` : ''
              }/builtin-table/${typeName}`,
              deletePathPrefix: `/api/clusters/${cluster}/k8s/api`,
              onDeleteHandle,
              permissions: {
                canUpdate: isNamespaced ? true : updatePermission.data?.status.allowed,
                canDelete: isNamespaced ? true : deletePermission.data?.status.allowed,
              },
            }}
            selectData={{
              selectedRowKeys,
              onChange: (selectedRowKeys: React.Key[], selectedRowsData: { name: string; endpoint: string }[]) => {
                setSelectedRowKeys(selectedRowKeys)
                setSelectedRowsData(selectedRowsData)
              },
            }}
            tableProps={{ ...TABLE_PROPS, disablePagination: true }}
            // maxHeight={height - 65}
          />
        )}
        {/* {selectedRowKeys.length > 0 && (
          <MarginTopContainer $top={-40}>
            <Flex gap={16}>
              <Button type="primary" onClick={clearSelected}>
                <ClearOutlined />
                Clear
              </Button>
              <Button type="primary" onClick={() => setIsDeleteModalManyOpen(selectedRowsData)}>
                <MinusOutlined />
                Delete
              </Button>
            </Flex>
          </MarginTopContainer>
        )} */}
      </OverflowMaxHeightContainer>
      <FlexGrow />
      <Flex justify="space-between">
        <Button
          type="primary"
          onClick={() =>
            navigate(
              `${baseprefix}${inside ? '/inside' : ''}/${cluster}${namespace ? `/${namespace}` : ''}${
                params.syntheticProject ? `/${params.syntheticProject}` : ''
              }/forms/builtin/v1/${typeName}?backlink=${baseprefix}${inside ? '/inside' : ''}/${cluster}${
                namespace ? `/${namespace}` : ''
              }${params.syntheticProject ? `/${params.syntheticProject}` : ''}/builtin-table/${typeName}`,
            )
          }
          loading={isNamespaced ? false : createPermission.isPending}
          disabled={isNamespaced ? false : !createPermission.data?.status.allowed}
        >
          <PlusOutlined />
          Add
        </Button>

        {selectedRowKeys.length > 0 && (
          <Flex gap={16}>
            <Button type="primary" onClick={clearSelected}>
              <ClearOutlined />
              Clear
            </Button>
            <Button type="primary" onClick={() => setIsDeleteModalManyOpen(selectedRowsData)}>
              <MinusOutlined />
              Delete
            </Button>
          </Flex>
        )}
      </Flex>
      {isDeleteModalOpen && (
        <DeleteModal
          name={isDeleteModalOpen.name}
          onClose={() => {
            setIsDeleteModalOpen(false)
            clearSelected()
          }}
          endpoint={isDeleteModalOpen.endpoint}
        />
      )}
      {isDeleteModalManyOpen !== false && (
        <DeleteModalMany
          data={isDeleteModalManyOpen}
          onClose={() => {
            setIsDeleteModalManyOpen(false)
            clearSelected()
          }}
        />
      )}
    </>
  )
}
