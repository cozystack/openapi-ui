/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type TState = {
  cluster: string
}

const initialState: TState = {
  cluster: '',
}

export const clusterSlice = createSlice({
  name: 'cluster',
  initialState,
  reducers: {
    setCluster: (state, action: PayloadAction<string>) => {
      state.cluster = action.payload
    },
  },
})

export const { setCluster } = clusterSlice.actions
