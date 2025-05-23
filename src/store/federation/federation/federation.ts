/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type TState = {
  isFederation?: boolean
}

const initialState: TState = {
  isFederation: undefined,
}

export const federationSlice = createSlice({
  name: 'isFederation',
  initialState,
  reducers: {
    setIsFederation: (state, action: PayloadAction<boolean>) => {
      state.isFederation = action.payload
    },
  },
})

export const { setIsFederation } = federationSlice.actions
