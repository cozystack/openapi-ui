import React, { FC } from 'react'
import { Factory } from 'components'
import { BaseTemplate } from 'templates'

type TFactoryPageProps = {
  forcedTheme?: 'light' | 'dark'
}

export const FactoryPage: FC<TFactoryPageProps> = ({ forcedTheme }) => {
  return (
    <BaseTemplate forcedTheme={forcedTheme} withNoCluster>
      <Factory />
    </BaseTemplate>
  )
}
