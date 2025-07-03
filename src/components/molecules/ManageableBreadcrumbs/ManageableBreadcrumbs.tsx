import React, { FC } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ManageableBreadcrumbsWithDataProvider } from '@prorobotech/openapi-k8s-toolkit'
import { BASE_API_GROUP, BASE_API_VERSION } from 'constants/customizationApiGroupAndVersion'

type TManageableBreadCrumbsProps = {
  idToCompare: string
  inside?: boolean
}

export const ManageableBreadcrumbs: FC<TManageableBreadCrumbsProps> = ({ idToCompare, inside }) => {
  const { pathname } = useLocation()
  const params = useParams()
  const clusterName = params?.clusterName || ''
  const namespace = params?.namespace || ''
  const syntheticProject = params?.syntheticProject || ''
  const apiGroup = params?.apiGroup || ''
  const apiVersion = params?.apiVersion || ''
  const typeName = params?.typeName || ''
  const entryName = params?.entryName || ''
  const apiExtensionVersion = params?.apiExtensionVersion || ''
  const crdName = params?.crdName || ''

  return (
    <ManageableBreadcrumbsWithDataProvider
      idToCompare={idToCompare}
      uri={`/api/clusters/${clusterName}/k8s/apis/${BASE_API_GROUP}/${BASE_API_VERSION}/${
        inside ? 'breadcrumbsinside' : 'breadcrumbs'
      }/`}
      refetchInterval={5000}
      isEnabled={clusterName !== undefined}
      replaceValues={{
        clusterName,
        projectName: '',
        instanceName: '',
        namespace,
        syntheticProject,
        entryType: '',
        apiGroup,
        apiVersion,
        typeName,
        entryName,
        apiExtensionVersion,
        crdName,
      }}
      pathname={pathname}
    />
  )
}
