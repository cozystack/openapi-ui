import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams } from 'react-router-dom'
import { TableCrdInfo, BackLink, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'

type TTableCrdPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const TableCrdPage: FC<TTableCrdPageProps> = ({ forcedTheme }) => {
  const { clusterName, namespace, syntheticProject, apiGroup, apiVersion, apiExtensionVersion, crdName } = useParams()

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
        title={`${apiGroup}/${apiVersion}/${crdName}`}
      />
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
