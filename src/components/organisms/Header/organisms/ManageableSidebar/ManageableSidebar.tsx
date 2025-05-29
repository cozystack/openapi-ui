import React, { FC } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ManageableSidebarWithDataProvider } from '@prorobotech/openapi-k8s-toolkit'
import { BASE_API_GROUP, BASE_API_VERSION } from 'constants/customizationApiGroupAndVersion'

type TManageableSidebarProps = {
  clusterName?: string
  entryType?: string
  instanceName?: string
  projectName?: string
}

export const ManageableSidebar: FC<TManageableSidebarProps> = ({
  clusterName,
  projectName,
  instanceName,
  entryType,
}) => {
  const { pathname } = useLocation()
  const params = useParams()
  const namespace = params?.namespace || ''
  const syntheticProject = params?.syntheticProject || ''

  const creating = projectName === 'create' || instanceName === 'create'
  const updating = entryType === 'update'
  const visible = !creating && !updating

  return (
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
      }}
      pathname={pathname}
      hidden={!visible}
    />
  )
}
