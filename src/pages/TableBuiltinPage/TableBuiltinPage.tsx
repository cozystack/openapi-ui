import React, { FC } from 'react'
import { ContentCard, Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { TableBuiltinInfo, BackLink, ManageableBreadcrumbs } from 'components'
import { BaseTemplate } from 'templates'
import {
  BASE_INSTANCES_API_GROUP,
  BASE_INSTANCES_VERSION,
  BASE_INSTANCES_RESOURCE_NAME,
} from 'constants/customizationApiGroupAndVersion'

type TTableBuiltinPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const TableBuiltinPage: FC<TTableBuiltinPageProps> = ({ forcedTheme }) => {
  const { clusterName, namespace, syntheticProject, typeName } = useParams()
  const [searchParams] = useSearchParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const customBacklink = possibleInstance
    ? `${baseprefix}/${clusterName}/${possibleProject}/api-table/${BASE_INSTANCES_API_GROUP}/${BASE_INSTANCES_VERSION}/${BASE_INSTANCES_RESOURCE_NAME}`
    : `${baseprefix}/clusters/${clusterName}/projects/${possibleProject}`

  const clustererBacklink = `${baseprefix}/clusters`

  return (
    <BaseTemplate forcedTheme={forcedTheme}>
      <ManageableBreadcrumbs />
      <BackLink to={namespace ? customBacklink : clustererBacklink} title={typeName} />
      <Spacer $space={20} $samespace />
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        {typeName && <TableBuiltinInfo namespace={namespace} typeName={typeName} limit={searchParams.get('limit')} />}
      </ContentCard>
    </BaseTemplate>
  )
}
