import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { HomeOutlined } from '@ant-design/icons'
import { TableBuiltinInfo, BackLink, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TTableBuiltinPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const TableBuiltinPage: FC<TTableBuiltinPageProps> = ({ forcedTheme }) => {
  const { clusterName, namespace, syntheticProject, typeName } = useParams()
  const [searchParams] = useSearchParams()
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
      key: 'apis',
    },
    {
      title: 'Builtin Resources',
      key: 'builtin-types',
    },
    {
      title: typeName,
      key: 'builtin-type',
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
          title={typeName}
        />
      )}
      <Spacer $space={16} $samespace />
      {typeName && <TableBuiltinInfo namespace={namespace} typeName={typeName} limit={searchParams.get('limit')} />}
    </BaseTemplate>
  )
}
