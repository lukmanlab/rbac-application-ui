import { createAppSlice } from "@/states/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface Login {
  code?: string
  access_token?: string
  refresh_token?: string
}

export interface LoginState {
  login: {
    code?: string
    access_token?: string
    refresh_token?: string
  }
}

const initialState: LoginState = {
  login: {
    code: undefined,
    access_token: undefined,
    refresh_token: undefined
  },
}

export const loginSlice = createAppSlice({
  name: "login",
  initialState,
  reducers: create => ({
    setLogin: create.reducer((state, action: PayloadAction<LoginState>) => {
      if (state.login) {
        state.login.code = action.payload.login?.code
        state.login.access_token = action.payload.login?.access_token
        state.login.refresh_token = action.payload.login?.refresh_token
      }
    })
  }),
  selectors: {
    selectLogin: l => l.login
  }
})

export const {
  setLogin,
} = loginSlice.actions

export const { selectLogin } = loginSlice.selectors