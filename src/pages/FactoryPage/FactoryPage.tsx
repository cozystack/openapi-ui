import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { ManageableBreadcrumbs, ManageableSidebar, Factory, NavigationContainer } from 'components'
import { getBreadcrumbsIdPrefix } from 'utils/getBreadcrumbsIdPrefix'
import { getSidebarIdPrefix } from 'utils/getSidebarIdPrefix'
import { BaseTemplate } from 'templates'

type TFactoryPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const FactoryPage: FC<TFactoryPageProps> = ({ forcedTheme }) => {
  const { namespace, syntheticProject, key } = useParams()

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
      forcedTheme={forcedTheme}
      sidebar={
        <ManageableSidebar instanceName={possibleInstance} projectName={possibleProject} idToCompare={sidebarId} />
      }
      withNoCluster
    >
      <NavigationContainer>
        <ManageableBreadcrumbs idToCompare={breadcrumbsId} />
      </NavigationContainer>
      <Factory />
    </BaseTemplate>
  )
}
