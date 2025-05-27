import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { HomeOutlined } from '@ant-design/icons'
import { TableCrdInfo, BackLink, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TTableCrdPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const TableCrdPage: FC<TTableCrdPageProps> = ({ forcedTheme }) => {
  const { clusterName, namespace, syntheticProject, apiGroup, apiVersion, apiExtensionVersion, crdName } = useParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)
  const isFederation = useSelector((state: RootState) => state.federation.isFederation)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const breadcrumbItems = [
    {
      title: (
        <Link to={`${baseprefix}/cluster-list`}>
          <HomeOutlined />
        </Link>
      ),
      key: 'home',
    },
    {
      title: <Link to={`${baseprefix}/${clusterName}${namespace ? `/${namespace}` : ''}/apis`}>API Resources</Link>,
      key: 'list-api',
    },
    {
      title: 'CRD by Group',
      key: 'crd-by-group',
    },
    {
      title: (
        <Link
          to={`${baseprefix}/${clusterName}${
            namespace ? `/${namespace}` : ''
          }/crds-by-api/${apiGroup}/${apiVersion}/${apiExtensionVersion}`}
        >
          {apiGroup}
        </Link>
      ),
      key: 'list-crd-by-api-group',
    },
    {
      title: crdName,
      key: 'crd',
    },
  ]

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      {isFederation ? <ManageableBreadcrumbs /> : <Breadcrumb items={breadcrumbItems} separator=">" />}
      {isFederation && (
        <BackLink
          to={
            possibleInstance
              ? `/instances-federation/clusters/${clusterName}/projects/${possibleProject}/${possibleInstance}`
              : `/core/clusters/${clusterName}/projects/${possibleProject}`
          }
          title={`${apiGroup}/${apiVersion}/${crdName}`}
        />
      )}
      <Spacer $space={16} $samespace />
      {crdName && apiGroup && apiVersion && apiExtensionVersion && (
        <TableCrdInfo
          namespace={namespace}
          apiGroup={apiGroup}
          apiVersion={apiVersion}
          crdName={crdName}
          apiExtensionVersion={apiExtensionVersion}
        />
      )}
    </BaseTemplate>
  )
}
