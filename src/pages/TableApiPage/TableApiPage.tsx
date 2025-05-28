import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams } from 'react-router-dom'
import { TableNonCrdInfo, BackLink, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TTableApiPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const TableApiPage: FC<TTableApiPageProps> = ({ forcedTheme }) => {
  const { clusterName, namespace, syntheticProject, apiGroup, apiVersion, typeName } = useParams()
  const [searchParams] = useSearchParams()

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <ManageableBreadcrumbs />
      <BackLink
        to={
          possibleInstance
            ? `/instances-federation/clusters/${clusterName}/projects/${possibleProject}/${possibleInstance}`
            : `/core/clusters/${clusterName}/projects/${possibleProject}`
        }
        title={`${apiGroup}/${apiVersion}/${typeName}`}
      />
      <Spacer $space={16} $samespace />
      {typeName && apiGroup && apiVersion && (
        <TableNonCrdInfo
          namespace={namespace}
          apiGroup={apiGroup}
          apiVersion={apiVersion}
          typeName={typeName}
          limit={searchParams.get('limit')}
        />
      )}
    </BaseTemplate>
  )
}
