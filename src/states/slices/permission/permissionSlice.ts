import { createAppSlice } from "@/states/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface Detail {
  id: string
  name: string
  description: string
}

export interface Permission {
  id: string
  resource: Detail
  action: Detail
  updated_at: string
  created_at: string
}

export interface PermissionState {
  permission?: {
    allPermissions?: Permission[]
  }
}

const initialState: PermissionState = {
  permission: {
    allPermissions: []
  },
}

export const permissionSlice = createAppSlice({
  name: "permission",
  initialState,
  reducers: create => ({
    setAllPermission: create.reducer((state, action: PayloadAction<PermissionState>) => {
      if (state.permission) state.permission.allPermissions = action.payload.permission?.allPermissions
    })
  }),
  selectors: {
    selectAllPermission: p => p.permission?.allPermissions
  }
})

export const {
  setAllPermission,
} = permissionSlice.actions

export const { selectAllPermission } = permissionSlice.selectors