import { createAppSlice } from "@/states/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface Resource {
  id: string
  name: string
  description?: string
  updated_at: string
  created_at: string
}

export interface ResourceState {
  resource?: {
    allResources?: Resource[]
  }
}

const initialState: ResourceState = {
  resource: {
    allResources: []
  },
}

export const resourceSlice = createAppSlice({
  name: "resource",
  initialState,
  reducers: create => ({
    setAllResource: create.reducer((state, action: PayloadAction<ResourceState>) => {
      if (state.resource) state.resource.allResources = action.payload.resource?.allResources
    })
  }),
  selectors: {
    selectAllResource: r => r.resource?.allResources
  }
})

export const {
  setAllResource,
} = resourceSlice.actions

export const { selectAllResource } = resourceSlice.selectors