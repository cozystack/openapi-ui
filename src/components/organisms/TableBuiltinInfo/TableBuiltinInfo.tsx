import React, { FC, useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Spin, Alert, Button, Flex } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import {
  EnrichedTableProvider,
  useDirectUnknownResource,
  usePermissions,
  DeleteModal,
  DeleteModalMany,
  checkIfBuiltInInstanceNamespaceScoped,
  TTableMappingResponse,
  useCrdResources,
  prepareTableMappings,
  parseCustomOverrides,
  TAdditionalPrinterColumns,
  useBuiltinResources,
} from '@prorobotech/openapi-k8s-toolkit'
import { BASE_API_GROUP, BASE_API_VERSION } from 'constants/customizationApiGroupAndVersion'
import { FlexGrow } from 'components'
import { TABLE_PROPS } from 'constants/tableProps'

type TTableBuiltinInfoProps = {
  namespace?: string
  typeName: string
  limit: string | null
  inside?: boolean
}

export const TableBuiltinInfo: FC<TTableBuiltinInfoProps> = ({ namespace, typeName, limit, inside }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const params = useParams()

  const cluster = useSelector((state: RootState) => state.cluster.cluster)
  const swagger = useSelector((state: RootState) => state.swagger.swagger)
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<false | { name: string; endpoint: string }>(false)
  const [isDeleteModalManyOpen, setIsDeleteModalManyOpen] = useState<false | { name: string; endpoint: string }[]>(
    false,
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRowsData, setSelectedRowsData] = useState<{ name: string; endpoint: string }[]>([])
  const [isNamespaced, setIsNamespaced] = useState<boolean>()

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
    if (swagger) {
      const { isNamespaceScoped } = checkIfBuiltInInstanceNamespaceScoped({
        typeName,
        swagger,
      })
      if (isNamespaceScoped) {
        setIsNamespaced(isNamespaceScoped)
      }
    }
  }, [swagger, typeName])

  const { isPending, error, data } = useBuiltinResources({
    clusterName: cluster,
    namespace,
    typeName,
    limit,
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

  const columnsOverrides = useCrdResources({
    clusterName: cluster,
    crdName: 'customcolumnsoverrides',
    apiGroup: BASE_API_GROUP,
    apiVersion: BASE_API_VERSION,
  })

  const {
    ensuredCustomOverrides,
    ensuredCustomOverridesUndefinedValues,
    ensuredCustomOverridesTrimLengths,
    ensuredCustomOverridesColWidths,
  } = parseCustomOverrides({ columnsOverridesData: columnsOverrides.data, overrideType: `v1/${typeName}` })

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
