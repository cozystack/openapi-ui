/* eslint-disable no-param-reassign */
import { OpenAPIV2 } from 'openapi-types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type TState = {
  swagger: OpenAPIV2.Document | undefined
}

const initialState: TState = {
  swagger: undefined,
}

export const swaggerSlice = createSlice({
  name: 'swagger',
  initialState,
  reducers: {
    setSwagger: (state, action: PayloadAction<OpenAPIV2.Document>) => {
      state.swagger = action.payload
    },
  },
})

export const { setSwagger } = swaggerSlice.actions
