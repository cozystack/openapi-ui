import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import {
  DynamicComponents,
  DynamicRendererWithProviders,
  TDynamicComponentsAppTypeMap,
  useDirectUnknownResource,
  TFactoryResponse,
} from '@prorobotech/openapi-k8s-toolkit'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { BASE_API_GROUP, BASE_API_VERSION } from 'constants/customizationApiGroupAndVersion'

export const Factory: FC = () => {
  const theme = useSelector((state: RootState) => state.openapiTheme.theme)
  const cluster = useSelector((state: RootState) => state.cluster.cluster)
  const { key } = useParams()

  const { data: factoryData } = useDirectUnknownResource<TFactoryResponse<TDynamicComponentsAppTypeMap>>({
    uri: `/api/clusters/${cluster}/k8s/apis/${BASE_API_GROUP}/${BASE_API_VERSION}/factories/`,
    refetchInterval: false,
    queryKey: ['factories', cluster || 'no-cluster'],
    isEnabled: cluster !== undefined,
  })

  const { spec } = factoryData?.items.find(({ spec }) => spec.key === key) ?? { spec: undefined }

  if (!spec) {
    return null
  }

  return (
    <DynamicRendererWithProviders
      urlsToFetch={spec.urlsToFetch}
      theme={theme}
      items={spec.data}
      components={DynamicComponents}
    />
  )
}
