import { createAppSlice } from "@/states/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string,
  email: string
  updated_at: string,
  created_at: string
}

export interface UserState {
  user?: {
    allUsers?: User[]
  }
}

const initialState: UserState = {
  user: {
    allUsers: []
  },
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const userSlice = createAppSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: create => ({
    setAllUser: create.reducer((state, action: PayloadAction<UserState>) => {
      if (state.user) state.user.allUsers = action.payload.user?.allUsers
    })
  }),
  selectors: {
    selectAllUser: u => u.user?.allUsers
  }
})

// Action creators are generated for each case reducer function.
export const {
  setAllUser,
} = userSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAllUser } = userSlice.selectors