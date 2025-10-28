import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { ManageableBreadcrumbs, ManageableSidebar, Events, NavigationContainer } from 'components'
import { getBreadcrumbsIdPrefix } from 'utils/getBreadcrumbsIdPrefix'
import { getSidebarIdPrefix } from 'utils/getSidebarIdPrefix'
import { BaseTemplate } from 'templates'

export const EventsPage: FC = () => {
  const { clusterName, namespace, syntheticProject, key } = useParams()

  const possibleProject = syntheticProject && namespace ? syntheticProject : namespace
  const possibleInstance = syntheticProject && namespace ? namespace : undefined

  const breadcrumbsId = `${getBreadcrumbsIdPrefix({
    instance: !!syntheticProject,
    project: !!namespace,
  })}factory-${key}`

  const sidebarId = `${getSidebarIdPrefix({
    instance: !!syntheticProject,
    project: !!namespace,
  })}factory-${key}`

  return (
    <BaseTemplate
      sidebar={
        <ManageableSidebar
          instanceName={possibleInstance}
          projectName={possibleProject}
          idToCompare={sidebarId}
          currentTags={['events']}
        />
      }
      // withNoCluster
    >
      <NavigationContainer>
        <ManageableBreadcrumbs idToCompare={breadcrumbsId} />
      </NavigationContainer>
      <Events wsUrl={`/api/clusters/${clusterName}/openapi-bff-ws/events/eventsWs?limit=40`} />
    </BaseTemplate>
  )
}
