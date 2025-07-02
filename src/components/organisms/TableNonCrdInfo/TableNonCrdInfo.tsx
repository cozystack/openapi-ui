/* eslint-disable max-lines-per-function */
import React, { FC, useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Spin, Alert, Button, Flex } from 'antd'
import { PlusOutlined, ClearOutlined, MinusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import {
  EnrichedTableProvider,
  useDirectUnknownResource,
  usePermissions,
  DeleteModal,
  DeleteModalMany,
  checkIfApiInstanceNamespaceScoped,
  TTableMappingResponse,
  TAdditionalPrinterColumns,
  prepareTableMappings,
  useApiResources,
  useCrdResources,
  parseCustomOverrides,
} from '@prorobotech/openapi-k8s-toolkit'
import { BASE_API_GROUP, BASE_API_VERSION } from 'constants/customizationApiGroupAndVersion'
import { FlexGrow, OverflowMaxHeightContainer, MarginTopContainer } from 'components'
import { TABLE_PROPS } from 'constants/tableProps'
import {
  HEAD_FIRST_ROW,
  HEAD_SECOND_ROW,
  FOOTER_HEIGHT,
  NAV_HEIGHT,
  CONTENT_CARD_PADDING,
  TABLE_ADD_BUTTON_HEIGHT,
} from 'constants/blocksSizes'

type TTableNonCrdInfoProps = {
  namespace?: string
  apiGroup: string
  apiVersion: string
  typeName: string
  limit: string | null
  inside?: boolean
}

export const TableNonCrdInfo: FC<TTableNonCrdInfoProps> = ({
  namespace,
  apiGroup,
  apiVersion,
  typeName,
  limit,
  inside,
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
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

  useEffect(() => {
    checkIfApiInstanceNamespaceScoped({
      apiGroup,
      apiVersion,
      typeName,
      clusterName: cluster,
    }).then(({ isNamespaceScoped }) => {
      if (isNamespaceScoped) {
        setIsNamespaced(true)
      }
    })
  }, [cluster, typeName, apiGroup, apiVersion])

  const createPermission = usePermissions({
    apiGroup,
    typeName,
    namespace: '',
    clusterName: cluster,
    verb: 'create',
    refetchInterval: false,
  })

  const updatePermission = usePermissions({
    apiGroup,
    typeName,
    namespace: '',
    clusterName: cluster,
    verb: 'update',
    refetchInterval: false,
  })

  const deletePermission = usePermissions({
    apiGroup,
    typeName,
    namespace: '',
    clusterName: cluster,
    verb: 'delete',
    refetchInterval: false,
  })

  const { isPending, error, data } = useApiResources({
    clusterName: cluster,
    namespace,
    apiGroup,
    apiVersion,
    typeName,
    limit,
  })

  const columnsOverrides = useCrdResources({
    clusterName: cluster,
    crdName: 'customcolumnsoverrides',
    apiGroup: BASE_API_GROUP,
    apiVersion: BASE_API_VERSION,
  })

  const additionalPrinterColumns: TAdditionalPrinterColumns = [
    {
      name: 'Name',
      type: 'string',
      jsonPath: '.metadata.name',
    },
    {
      name: 'Timestamp',
      type: 'string',
      jsonPath: '.metadata.creationTimestamp',
    },
  ]

  const {
    ensuredCustomOverrides,
    ensuredCustomOverridesUndefinedValues,
    ensuredCustomOverridesTrimLengths,
    ensuredCustomOverridesColWidths,
  } = parseCustomOverrides({
    columnsOverridesData: columnsOverrides.data,
    overrideType: `${apiGroup}/${apiVersion}/${typeName}`,
  })

  const { data: tableMappingsData } = useDirectUnknownResource<TTableMappingResponse>({
    uri: `/api/clusters/${cluster}/k8s/apis/${BASE_API_GROUP}/${BASE_API_VERSION}/tableurimappings/`,
    refetchInterval: 5000,
    queryKey: ['tableMappings', cluster || 'no-cluster'],
    isEnabled: cluster !== undefined,
  })

  const tableMappingsDataSpecs = tableMappingsData?.items.map(({ spec }) => spec)
  const tableMappingSpecific = tableMappingsDataSpecs
    ? prepareTableMappings({
        data: tableMappingsDataSpecs,
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
        pathname,
      })
    : undefined

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
            theme={theme}
            baseprefix={inside ? `${baseprefix}/inside` : baseprefix}
            dataItems={data.items}
            additionalPrinterColumns={ensuredCustomOverrides || additionalPrinterColumns}
            additionalPrinterColumnsUndefinedValues={ensuredCustomOverridesUndefinedValues}
            additionalPrinterColumnsTrimLengths={ensuredCustomOverridesTrimLengths}
            additionalPrinterColumnsColWidths={ensuredCustomOverridesColWidths}
            dataForControls={{
              cluster,
              syntheticProject: params.syntheticProject,
              pathPrefix: 'forms/apis',
              typeName,
              apiVersion: `${apiGroup}/${apiVersion}`,
              backlink: `${baseprefix}${inside ? '/inside' : ''}/${cluster}${namespace ? `/${namespace}` : ''}${
                params.syntheticProject ? `/${params.syntheticProject}` : ''
              }/api-table/${apiGroup}/${apiVersion}/${typeName}`,
              deletePathPrefix: `/api/clusters/${cluster}/k8s/apis`,
              onDeleteHandle,
              permissions: {
                canUpdate: isNamespaced ? true : updatePermission.data?.status.allowed,
                canDelete: isNamespaced ? true : deletePermission.data?.status.allowed,
              },
            }}
            pathToNavigate={tableMappingSpecific?.pathToNavigate}
            recordKeysForNavigation={tableMappingSpecific?.keysToParse}
            selectData={{
              selectedRowKeys,
              onChange: (selectedRowKeys: React.Key[], selectedRowsData: { name: string; endpoint: string }[]) => {
                setSelectedRowKeys(selectedRowKeys)
                setSelectedRowsData(selectedRowsData)
              },
            }}
            tableProps={TABLE_PROPS}
          />
        )}
        {selectedRowKeys.length > 0 && (
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
        )}
      </OverflowMaxHeightContainer>
      <FlexGrow />
      <Flex justify="space-between">
        <Button
          type="primary"
          onClick={() =>
            navigate(
              `${baseprefix}${inside ? '/inside' : ''}/${cluster}${namespace ? `/${namespace}` : ''}${
                params.syntheticProject ? `/${params.syntheticProject}` : ''
              }/forms/apis/${apiGroup}/${apiVersion}/${typeName}?backlink=${baseprefix}${
                inside ? '/inside' : ''
              }/${cluster}${namespace ? `/${namespace}` : ''}${
                params.syntheticProject ? `/${params.syntheticProject}` : ''
              }/api-table/${apiGroup}/${apiVersion}/${typeName}`,
            )
          }
          loading={isNamespaced ? false : createPermission.isPending}
          disabled={isNamespaced ? false : !createPermission.data?.status.allowed}
        >
          <PlusOutlined />
          Add
        </Button>
      </Flex>
      {isDeleteModalOpen && (
        <DeleteModal
          name={isDeleteModalOpen.name}
          onClose={() => setIsDeleteModalOpen(false)}
          endpoint={isDeleteModalOpen.endpoint}
        />
      )}
      {isDeleteModalManyOpen !== false && (
        <DeleteModalMany data={isDeleteModalManyOpen} onClose={() => setIsDeleteModalManyOpen(false)} />
      )}
    </>
  )
}
