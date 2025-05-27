/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import {
  BlackholeFormDataProvider,
  useBuiltinResources,
  useCrdResources,
  TJSON,
  TFormsPrefillsData,
  TFormsOverridesData,
} from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { BASE_API_GROUP, BASE_API_VERSION } from 'constants/customizationApiGroupAndVersion'

type TBlackholeFormProps = {
  data:
    | {
        type: 'builtin'
        typeName: string
        prefillValuesSchema?: TJSON
        prefillValueNamespaceOnly?: string
      }
    | {
        type: 'apis'
        apiGroup: string
        apiVersion: string
        typeName: string
        prefillValuesSchema?: TJSON
        prefillValueNamespaceOnly?: string
      }
  isCreate?: boolean
  backlink?: string | null
  modeData?: {
    current: string
    onChange: (value: string) => void
    onDisabled: () => void
  }
}

export const BlackholeForm: FC<TBlackholeFormProps> = ({ data, isCreate, backlink, modeData }) => {
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)
  const cluster = useSelector((state: RootState) => state.cluster.cluster)
  const swagger = useSelector((state: RootState) => state.swagger.swagger)
  const params = useParams()

  const urlParams = {
    clusterName: params.clusterName,
    namespace: params.namespace,
    syntheticProject: params.syntheticProject,
    entryName: params.entryName,
  }

  const urlParamsForPermissions = {
    apiGroup: params.apiGroup,
    typeName: params.typeName,
  }

  const namespacesData = useBuiltinResources({
    clusterName: cluster,
    typeName: 'namespaces',
    refetchInterval: false,
    limit: null,
  })

  const formsPrefillsData = useCrdResources<TFormsPrefillsData['items']>({
    clusterName: cluster,
    crdName: 'customformsprefills',
    apiGroup: BASE_API_GROUP,
    apiVersion: BASE_API_VERSION,
    refetchInterval: false,
  })

  const formsOverridesData = useCrdResources<TFormsOverridesData['items']>({
    clusterName: cluster,
    crdName: 'customformsoverrides',
    apiGroup: BASE_API_GROUP,
    apiVersion: BASE_API_VERSION,
    refetchInterval: false,
  })

  return (
    <BlackholeFormDataProvider
      theme={theme}
      cluster={cluster}
      urlParams={urlParams}
      urlParamsForPermissions={urlParamsForPermissions}
      formsPrefillsData={formsPrefillsData.data}
      swagger={swagger}
      namespacesData={namespacesData.data}
      formsOverridesData={formsOverridesData.data}
      data={data}
      isCreate={isCreate}
      backlink={backlink}
      modeData={modeData}
    />
  )
}
