import React, { FC, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Spin, Alert, Button, Flex } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  EnrichedTableProvider,
  useDirectUnknownResource,
  usePermissions,
  DeleteModal,
  DeleteModalMany,
  TTableMappingResponse,
  TAdditionalPrinterColumns,
  prepareTableMappings,
  useApiResources,
  useCrdResources,
  parseCustomOverrides,
} from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { BASE_API_GROUP, BASE_API_VERSION, BASE_RPROJECTS_VERSION } from 'constants/customizationApiGroupAndVersion'
import { FlexGrow } from 'components'
import { TABLE_PROPS } from 'constants/tableProps'

export const ListProjects: FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const { clusterName } = useParams()
  const path = pathname
  const cluster = clusterName || ''
  const apiGroup = BASE_API_GROUP
  const apiVersion = BASE_RPROJECTS_VERSION
  const typeName = 'projects'
  const isNamespaced = false

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<false | { name: string; endpoint: string }>(false)
  const [isDeleteModalManyOpen, setIsDeleteModalManyOpen] = useState<false | { name: string; endpoint: string }[]>(
    false,
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRowsData, setSelectedRowsData] = useState<{ name: string; endpoint: string }[]>([])

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
    namespace: '',
    apiGroup,
    apiVersion,
    typeName,
    limit: null,
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
        clusterName,
        pathname: path,
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
      {!error && data && (
        <EnrichedTableProvider
          theme={theme}
          baseprefix={baseprefix}
          dataItems={data.items}
          additionalPrinterColumns={ensuredCustomOverrides || additionalPrinterColumns}
          additionalPrinterColumnsUndefinedValues={ensuredCustomOverridesUndefinedValues}
          additionalPrinterColumnsTrimLengths={ensuredCustomOverridesTrimLengths}
          additionalPrinterColumnsColWidths={ensuredCustomOverridesColWidths}
          dataForControls={{
            cluster,
            syntheticProject: undefined,
            pathPrefix: 'forms/apis',
            typeName,
            apiVersion: `${apiGroup}/${apiVersion}`,
            backlink: `${baseprefix}/clusters/${cluster}`,
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
      <FlexGrow />
      <Flex justify="space-between">
        <Button
          type="primary"
          onClick={() =>
            navigate(
              `${baseprefix}/${cluster}/forms/apis/${apiGroup}/${apiVersion}/${typeName}?backlink=${baseprefix}/clusters/${cluster}`,
            )
          }
          loading={isNamespaced ? false : createPermission.isPending}
          disabled={isNamespaced ? false : !createPermission.data?.status.allowed}
        >
          <PlusOutlined />
          Add
        </Button>
        {selectedRowKeys.length > 0 && (
          <Flex gap={8}>
            <Button onClick={clearSelected}>Clear</Button>
            <Button onClick={() => setIsDeleteModalManyOpen(selectedRowsData)} danger>
              Delete
            </Button>
          </Flex>
        )}
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
