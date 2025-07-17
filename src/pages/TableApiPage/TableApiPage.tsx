import React, { FC } from 'react'
import { ContentCard } from '@prorobotech/openapi-k8s-toolkit'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { TableNonCrdInfo, BackLink, ManageableBreadcrumbs, ManageableSidebar, NavigationContainer } from 'components'
import { getSidebarIdPrefix } from 'utils/getSidebarIdPrefix'
import { getBreadcrumbsIdPrefix } from 'utils/getBreadcrumbsIdPrefix'
import { getTablesBackLink } from 'utils/getBacklink'
import { BaseTemplate } from 'templates'
import {
  BASE_USE_NAMESPACE_NAV,
  BASE_PROJECTS_API_GROUP,
  BASE_PROJECTS_VERSION,
  BASE_PROJECTS_RESOURCE_NAME,
} from 'constants/customizationApiGroupAndVersion'

type TTableApiPageProps = {
  forcedTheme?: 'light' | 'dark'
  inside?: boolean
}

export const TableApiPage: FC<TTableApiPageProps> = ({ forcedTheme, inside }) => {
  const { clusterName, namespace, syntheticProject, apiGroup, apiVersion, typeName } = useParams()
  const [searchParams] = useSearchParams()
  const baseprefix = useSelector((state: RootState) => state.baseprefix.baseprefix)

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const backlink = getTablesBackLink({
    clusterName,
    possibleProject,
    possibleInstance,
    namespace,
    baseprefix,
    inside,
    namespacesMode: BASE_USE_NAMESPACE_NAV === 'true',
  })

  const sidebarId = `${getSidebarIdPrefix({ instance: !!syntheticProject, project: !!namespace, inside })}api-table`
  const breadcrumbsId = `${getBreadcrumbsIdPrefix({
    instance: !!syntheticProject,
    project: !!namespace,
    inside,
  })}api-table`

  const isProjectList =
    !namespace &&
    apiGroup === BASE_PROJECTS_API_GROUP &&
    apiVersion === BASE_PROJECTS_VERSION &&
    typeName === BASE_PROJECTS_RESOURCE_NAME
  const sidebarIdProjectList = `${getSidebarIdPrefix({})}projects-list`
  const breadcrumbsIdProjectList = `${getBreadcrumbsIdPrefix({})}projects-list`

  return (
    <BaseTemplate
      forcedTheme={forcedTheme}
      inside={inside}
      sidebar={
        <ManageableSidebar
          instanceName={possibleInstance}
          projectName={possibleProject}
          idToCompare={isProjectList ? sidebarIdProjectList : sidebarId}
          currentTags={[`${apiGroup}/${apiVersion}/${typeName}`]}
        />
      }
    >
      <NavigationContainer>
        <ManageableBreadcrumbs idToCompare={isProjectList ? breadcrumbsIdProjectList : breadcrumbsId} inside={inside} />
        <BackLink to={backlink} title={`${apiGroup}/${apiVersion}/${typeName}`} />
      </NavigationContainer>
      <ContentCard flexGrow={1} displayFlex flexFlow="column">
        {typeName && apiGroup && apiVersion && (
          <TableNonCrdInfo
            namespace={namespace}
            apiGroup={apiGroup}
            apiVersion={apiVersion}
            typeName={typeName}
            limit={searchParams.get('limit')}
            inside={inside}
          />
        )}
      </ContentCard>
    </BaseTemplate>
  )
}
