import React, { FC } from 'react'
import { ContentCard } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { TableBuiltinInfo, BackLink, ManageableBreadcrumbs, ManageableSidebar, NavigationContainer } from 'components'
import { getSidebarIdPrefix } from 'utils/getSidebarIdPrefix'
import { getBreadcrumbsIdPrefix } from 'utils/getBreadcrumbsIdPrefix'
import { BaseTemplate } from 'templates'
import {
  BASE_INSTANCES_API_GROUP,
  BASE_INSTANCES_VERSION,
  BASE_INSTANCES_RESOURCE_NAME,
} from 'constants/customizationApiGroupAndVersion'

type TTableBuiltinPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const TableBuiltinPage: FC<TTableBuiltinPageProps> = ({ forcedTheme, inside }) => {
  const { clusterName, namespace, syntheticProject, typeName } = useParams()
  const [searchParams] = useSearchParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const customBacklink = possibleInstance
    ? `${baseprefix}/${clusterName}/${possibleProject}/api-table/${BASE_INSTANCES_API_GROUP}/${BASE_INSTANCES_VERSION}/${BASE_INSTANCES_RESOURCE_NAME}`
    : `${baseprefix}/clusters/${clusterName}/projects/${possibleProject}`

  const customBacklinkWithInside = inside
    ? `${baseprefix}/inside/${clusterName}${namespace ? `/${namespace}` : ''}/apis`
    : customBacklink

  const clustererBacklink = inside ? customBacklinkWithInside : `${baseprefix}/clusters`

  const sidebarId = `${getSidebarIdPrefix({ instance: !!syntheticProject, project: !!namespace, inside })}builtin-table`
  const breadcrumbsId = `${getBreadcrumbsIdPrefix({
    instance: !!syntheticProject,
    project: !!namespace,
    inside,
  })}builtin-table`

  return (
    <BaseTemplate
      forcedTheme={forcedTheme}
      inside={inside}
      sidebar={
        <ManageableSidebar
          instanceName={possibleInstance}
          projectName={possibleProject}
          idToCompare={sidebarId}
          currentTags={[`${typeName}`]}
        />
      }
    >
      <NavigationContainer>
        <ManageableBreadcrumbs idToCompare={breadcrumbsId} inside={inside} />
        <BackLink to={namespace ? customBacklinkWithInside : clustererBacklink} title={typeName} />
      </NavigationContainer>
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        {typeName && (
          <TableBuiltinInfo
            namespace={namespace}
            typeName={typeName}
            limit={searchParams.get('limit')}
            inside={inside}
          />
        )}
      </ContentCard>
    </BaseTemplate>
  )
}
