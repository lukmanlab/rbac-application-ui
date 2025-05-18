import { createAppSlice } from "@/states/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface Role {
  id: string
  tenant_id: string
  name: string
  description?: string
  updated_at: string
  created_at: string
}

export interface RoleState {
  role?: {
    allRoles?: Role[]
  }
}

const initialState: RoleState = {
  role: {
    allRoles: []
  },
}

export const roleSlice = createAppSlice({
  name: "role",
  initialState,
  reducers: create => ({
    setAllRole: create.reducer((state, action: PayloadAction<RoleState>) => {
      if (state.role) state.role.allRoles = action.payload.role?.allRoles
    })
  }),
  selectors: {
    selectAllRole: t => t.role?.allRoles
  }
})

export const {
  setAllRole,
} = roleSlice.actions

export const { selectAllRole } = roleSlice.selectors