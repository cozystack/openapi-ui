import React, { FC } from 'react'
import { ListInsideClusterAndNs } from 'components'
import { BaseTemplate } from 'templates'

type TListInsideClustersAndNsPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ListInsideClustersAndNsPage: FC<TListInsideClustersAndNsPageProps> = ({ forcedTheme }) => (
  <BaseTemplate withNoCluster forcedTheme={forcedTheme}>
    <ListInsideClusterAndNs />
  </BaseTemplate>
)
