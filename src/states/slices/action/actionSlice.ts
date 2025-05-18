import { createAppSlice } from "@/states/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface Action {
  id: string
  name: string
  description?: string
  updated_at: string
  created_at: string
}

export interface ActionState {
  action?: {
    allActions?: Action[]
  }
}

const initialState: ActionState = {
  action: {
    allActions: []
  },
}

export const actionSlice = createAppSlice({
  name: "action",
  initialState,
  reducers: create => ({
    setAllAction: create.reducer((state, action: PayloadAction<ActionState>) => {
      if (state.action) state.action.allActions = action.payload.action?.allActions
    })
  }),
  selectors: {
    selectAllAction: a => a.action?.allActions
  }
})

export const {
  setAllAction,
} = actionSlice.actions

export const { selectAllAction } = actionSlice.selectors