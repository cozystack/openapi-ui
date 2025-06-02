import React, { FC, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Spin, Alert, Button, Flex } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import {
  EnrichedTableProvider,
  useDirectUnknownResource,
  DeleteModal,
  DeleteModalMany,
  TAdditionalPrinterColumns,
  TTableMappingResponse,
  useCrdResources,
  prepareTableMappings,
  parseCustomOverrides,
} from '@prorobotech/openapi-k8s-toolkit'
import { BASE_API_GROUP, BASE_API_VERSION } from 'constants/customizationApiGroupAndVersion'
import { FlexGrow } from 'components'

type TResourceInfoProps = {
  clusterName: string
  namespace?: string
  crdName: string
  crdPluralName: string
  apiGroup: string
  apiVersion: string
  apiExtensionVersion: string
  crdAdditionalPrinterColumns?: TAdditionalPrinterColumns
  permissions: {
    canCreate?: boolean
    canUpdate?: boolean
    canDelete?: boolean
  }
}

export const ResourceInfo: FC<TResourceInfoProps> = ({
  clusterName,
  namespace,
  crdName,
  crdPluralName,
  apiGroup,
  apiVersion,
  apiExtensionVersion,
  crdAdditionalPrinterColumns,
  permissions,
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

  const { isPending, error, data } = useCrdResources({
    clusterName,
    namespace,
    apiGroup,
    apiVersion,
    crdName: crdPluralName,
  })

  let resourceSchema = {}

  if (data && data.items.length > 0) {
    if (
      data.items[0] &&
      typeof data.items[0] === 'object' &&
      !Array.isArray(data.items[0]) &&
      data.items[0] !== null &&
      !Array.isArray(data.items[0].spec) &&
      data.items[0].spec !== null
    ) {
      resourceSchema = data.items[0].spec
    }
  }

  const columnsOverrides = useCrdResources({
    clusterName,
    crdName: 'customcolumnsoverrides',
    apiGroup: BASE_API_GROUP,
    apiVersion: BASE_API_VERSION,
  })

  const {
    ensuredCustomOverrides,
    ensuredCustomOverridesUndefinedValues,
    ensuredCustomOverridesTrimLengths,
    ensuredCustomOverridesColWidths,
  } = parseCustomOverrides({
    columnsOverridesData: columnsOverrides.data,
    overrideType: `${apiGroup}/${apiVersion}/${crdPluralName}`,
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
      {!error && data && (
        <EnrichedTableProvider
          theme={theme}
          baseprefix={baseprefix}
          dataItems={data.items}
          resourceSchema={resourceSchema}
          additionalPrinterColumns={ensuredCustomOverrides || crdAdditionalPrinterColumns}
          additionalPrinterColumnsUndefinedValues={ensuredCustomOverridesUndefinedValues}
          additionalPrinterColumnsTrimLengths={ensuredCustomOverridesTrimLengths}
          additionalPrinterColumnsColWidths={ensuredCustomOverridesColWidths}
          dataForControls={{
            cluster,
            syntheticProject: params.syntheticProject,
            pathPrefix: 'forms/crds',
            typeName: crdPluralName,
            apiVersion: `${apiGroup}/${apiVersion}`,
            backlink: `${baseprefix}/${cluster}${namespace ? `/${namespace}` : ''}${
              params.syntheticProject ? `/${params.syntheticProject}` : ''
            }/crd-table/${apiGroup}/${apiVersion}/${apiExtensionVersion}/${crdName}`,
            deletePathPrefix: `/api/clusters/${clusterName}/k8s/apis`,
            onDeleteHandle,
            permissions: {
              canUpdate: permissions.canUpdate,
              canDelete: permissions.canDelete,
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
        />
      )}
      <FlexGrow />
      <Flex justify="space-between">
        <Button
          type="primary"
          onClick={() =>
            navigate(
              `${baseprefix}/${cluster}${namespace ? `/${namespace}` : ''}${
                params.syntheticProject ? `/${params.syntheticProject}` : ''
              }/forms/crds/${apiGroup}/${apiVersion}/${crdPluralName}?backlink=${baseprefix}/${cluster}${
                namespace ? `/${namespace}` : ''
              }${
                params.syntheticProject ? `/${params.syntheticProject}` : ''
              }/crd-table/${apiGroup}/${apiVersion}/${apiExtensionVersion}/${crdName}`,
            )
          }
          loading={permissions.canCreate === undefined}
          disabled={permissions.canCreate === false}
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
