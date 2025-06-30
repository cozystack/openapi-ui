import React, { FC } from 'react'
import { ManageableBreadcrumbs, Factory, NavigationContainer } from 'components'
import { BaseTemplate } from 'templates'

type TFactoryPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const FactoryPage: FC<TFactoryPageProps> = ({ forcedTheme }) => {
  return (
    <BaseTemplate forcedTheme={forcedTheme} withNoCluster>
      <NavigationContainer>
        <ManageableBreadcrumbs />
      </NavigationContainer>
      <Factory />
    </BaseTemplate>
  )
}
