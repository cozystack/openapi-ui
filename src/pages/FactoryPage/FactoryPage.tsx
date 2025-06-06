import React, { FC } from 'react'
import { Spacer } from '@prorobotech/openapi-k8s-toolkit'
import { ManageableBreadcrumbs, Factory } from 'components'
import { BaseTemplate } from 'templates'

type TFactoryPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const FactoryPage: FC<TFactoryPageProps> = ({ forcedTheme }) => {
  return (
    <BaseTemplate forcedTheme={forcedTheme} withNoCluster>
      <ManageableBreadcrumbs />
      <Spacer $space={20} $samespace />
      <Factory />
    </BaseTemplate>
  )
}
