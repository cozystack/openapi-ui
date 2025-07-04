import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { ManageableBreadcrumbs, Factory, NavigationContainer } from 'components'
import { getBreadcrumbsIdPrefix } from 'utils/getBreadcrumbsIdPrefix'
import { BaseTemplate } from 'templates'

type TFactoryPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const FactoryPage: FC<TFactoryPageProps> = ({ forcedTheme }) => {
  const { namespace, syntheticProject, key } = useParams()

  const breadcrumbsId = `${getBreadcrumbsIdPrefix({
    instance: !!syntheticProject,
    project: !!namespace,
  })}factory-${key}`

  return (
    <BaseTemplate forcedTheme={forcedTheme} withNoCluster>
      <NavigationContainer>
        <ManageableBreadcrumbs idToCompare={breadcrumbsId} />
      </NavigationContainer>
      <Factory />
    </BaseTemplate>
  )
}
