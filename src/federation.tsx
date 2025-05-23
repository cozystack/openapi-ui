import React, { FC } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store/store'
import { App } from './App'

type TFederationAppProps = {
  forcedTheme?: 'dark' | 'light'
}

const FederationApp: FC<TFederationAppProps> = ({ forcedTheme }) => (
  <Provider store={store}>
    <App isFederation forcedTheme={forcedTheme} />
  </Provider>
)

// eslint-disable-next-line import/no-default-export
export default FederationApp
