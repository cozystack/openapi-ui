import React, { FC } from 'react'
import { ContentCard, Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { TableNonCrdInfo, BackLink, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'
import {
  BASE_INSTANCES_API_GROUP,
  BASE_INSTANCES_VERSION,
  BASE_INSTANCES_RESOURCE_NAME,
} from 'constants/customizationApiGroupAndVersion'

type TTableApiPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const TableApiPage: FC<TTableApiPageProps> = ({ forcedTheme }) => {
  const { clusterName, namespace, syntheticProject, apiGroup, apiVersion, typeName } = useParams()
  const [searchParams] = useSearchParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const customBacklink = possibleInstance
    ? // ? `${baseprefix}/${clusterName}/${possibleInstance}/${possibleProject}/api-table/apps/v1/deployments`
      `${baseprefix}/${clusterName}/${possibleProject}/api-table/${BASE_INSTANCES_API_GROUP}/${BASE_INSTANCES_VERSION}/${BASE_INSTANCES_RESOURCE_NAME}`
    : `${baseprefix}/clusters/${clusterName}/projects/${possibleProject}`

  const clustererBacklink = `${baseprefix}/clusters`

  // const instancesBacklink =
  //   apiGroup === 'apps' && apiVersion === 'v1' && typeName === 'deployments'
  //     ? `${baseprefix}/${clusterName}/${possibleProject}/api-table/${BASE_INSTANCES_API_GROUP}/${BASE_INSTANCES_VERSION}/${BASE_INSTANCES_RESOURCE_NAME}`
  //     : undefined

  // const nonInstanceBackLink = namespace ? customBacklink : clustererBacklink

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <ManageableBreadcrumbs />
      <BackLink to={namespace ? customBacklink : clustererBacklink} title={`${apiGroup}/${apiVersion}/${typeName}`} />
      <Spacer $space={20} $samespace />
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        {typeName && apiGroup && apiVersion && (
          <TableNonCrdInfo
            namespace={namespace}
            apiGroup={apiGroup}
            apiVersion={apiVersion}
            typeName={typeName}
            limit={searchParams.get('limit')}
          />
        )}
      </ContentCard>
    </BaseTemplate>
  )
}
