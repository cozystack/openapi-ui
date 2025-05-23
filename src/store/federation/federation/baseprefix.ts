/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type TState = {
  baseprefix?: string
}

const initialState: TState = {
  baseprefix: undefined,
}

export const baseprefixSlice = createSlice({
  name: 'baseprefix',
  initialState,
  reducers: {
    setBaseprefix: (state, action: PayloadAction<string>) => {
      state.baseprefix = action.payload
    },
  },
})

export const { setBaseprefix } = baseprefixSlice.actions
