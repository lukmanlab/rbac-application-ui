import { createAppSlice } from "@/states/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Detail } from "../permission/permissionSlice"

// export type Detail<Type extends string> = {
//   [key in Type]: string[]
// }

// export interface RolePermission<Detail> {
//   role: string
//   permission: Detail
// }

// export interface RolePermissionState<Detail> {
//   rolePermission?: {
//     allRolePermissions?: RolePermission<Detail>[]
//   }
// }

// const initialState: RolePermissionState<Detail<string>> = {
//   rolePermission: {
//     allRolePermissions: [
//       {
//         role: "",
//         permission: {
//           test: [""]
//         }
//       },
//     ]
//   },
// }

export type RoleMeta = {
  id: string
  name: string
}

export type PermissionMeta = {
  id: string
  resource: Detail
  action: Detail
}

export interface RolePermission {
  id: string
  role: RoleMeta
  permission: PermissionMeta
  created_at: string
  updated_at: string
}

export interface RolePermissionState {
  rolePermission?: {
    allRolePermissions?: RolePermission[]
  }
}

const initialState: RolePermissionState = {
  rolePermission: {
    allRolePermissions: []
  }
}

export const rolePermissionSlice = createAppSlice({
  name: "rolePermission",
  initialState,
  reducers: create => ({
    // setAllRolePermission: create.reducer((state, action: PayloadAction<RolePermissionState<Detail<string>>>) => {
    setAllRolePermission: create.reducer((state, action: PayloadAction<RolePermissionState>) => {
      if (state.rolePermission) state.rolePermission.allRolePermissions = action.payload.rolePermission?.allRolePermissions
    })
  }),
  selectors: {
    selectAllRolePermission: p => p.rolePermission?.allRolePermissions
  }
})

export const {
  setAllRolePermission,
} = rolePermissionSlice.actions

export const { selectAllRolePermission } = rolePermissionSlice.selectors