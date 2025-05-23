/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TClusterList } from '@prorobotech/openapi-k8s-toolkit'

export type TState = {
  clusterList: TClusterList | undefined
}

const initialState: TState = {
  clusterList: undefined,
}

export const clusterListSlice = createSlice({
  name: 'clusterList',
  initialState,
  reducers: {
    setClusterList: (state, action: PayloadAction<TClusterList | undefined>) => {
      state.clusterList = action.payload
    },
  },
})

export const { setClusterList } = clusterListSlice.actions
