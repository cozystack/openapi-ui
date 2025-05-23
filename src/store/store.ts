import { configureStore } from '@reduxjs/toolkit'
import { themeSlice } from './theme/theme/theme'
import { federationSlice } from './federation/federation/federation'
import { baseprefixSlice } from './federation/federation/baseprefix'
import { swaggerSlice } from './swagger/swagger/swagger'
import { clusterListSlice } from './clusterList/clusterList/clusterList'
import { clusterSlice } from './cluster/cluster/cluster'

export const store = configureStore({
  reducer: {
    openapiTheme: themeSlice.reducer,
    federation: federationSlice.reducer,
    baseprefix: baseprefixSlice.reducer,
    swagger: swaggerSlice.reducer,
    clusterList: clusterListSlice.reducer,
    cluster: clusterSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
