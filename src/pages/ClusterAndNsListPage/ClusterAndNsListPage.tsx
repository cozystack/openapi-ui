import React, { FC } from 'react'
import { ClusterAndNsList } from 'components'
import { BaseTemplate } from 'templates'

type TClusterAndNsListPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const ClusterAndNsListPage: FC<TClusterAndNsListPageProps> = ({ forcedTheme }) => (
  <BaseTemplate withNoCluster forcedTheme={forcedTheme}>
    <ClusterAndNsList />
  </BaseTemplate>
)
