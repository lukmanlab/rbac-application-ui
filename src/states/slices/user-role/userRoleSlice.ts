import { createAppSlice } from "@/states/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export type AddUserRoleResponse = {
  user_id: string
  tenant_id: string
  assigned_roles: string[]
}

// export type RoleMeta = {
//   id: string
//   name: string
// }

// export type TenantInfo = {
//   id: string,
//   name: string,
//   roles: RoleMeta[]
// }

export interface UserRole {
  user_id: string
  user_email: string
  tenant_id: string
  tenant_name: string
  role_id: string
  role_name: string
  // tenants: TenantInfo[]
}

export interface UserRoleState {
  userRole?: {
    allUserRoles?: UserRole[]
  }
}

const initialState: UserRoleState = {
  userRole: {
    allUserRoles: []
  }
}

export const userRoleSlice = createAppSlice({
  name: "userRole",
  initialState,
  reducers: create => ({
    setAllUserRole: create.reducer((state, action: PayloadAction<UserRoleState>) => {
      if (state.userRole) state.userRole.allUserRoles = action.payload.userRole?.allUserRoles
    })
  }),
  selectors: {
    selectAllUserRole: p => p.userRole?.allUserRoles
  }
})

export const {
  setAllUserRole,
} = userRoleSlice.actions

export const { selectAllUserRole } = userRoleSlice.selectors