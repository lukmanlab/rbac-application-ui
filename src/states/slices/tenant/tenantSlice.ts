import { createAppSlice } from "@/states/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface Tenant {
  id: string,
  name: string
  updated_at: string,
  created_at: string
}

export interface TenantState {
  tenant?: {
    allTenants?: Tenant[]
  }
}

const initialState: TenantState = {
  tenant: {
    allTenants: []
  },
}

export const tenantSlice = createAppSlice({
  name: "tenant",
  initialState,
  reducers: create => ({
    setAllTenant: create.reducer((state, action: PayloadAction<TenantState>) => {
      if (state.tenant) state.tenant.allTenants = action.payload.tenant?.allTenants
    })
  }),
  selectors: {
    selectAllTenant: t => t.tenant?.allTenants
  }
})

export const {
  setAllTenant,
} = tenantSlice.actions

export const { selectAllTenant } = tenantSlice.selectors