import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { loadingBarReducer } from "react-redux-loading-bar"
import { loadingSlice } from "./slices/loadingSlice"
import { userApiSlice } from "./slices/user/userApiSlice"
import { userSlice } from "./slices/user/userSlice"
import { tenantApiSlice } from "./slices/tenant/tenantApiSlice"
import { tenantSlice } from "./slices/tenant/tenantSlice"
import { roleApiSlice } from "./slices/role/roleApiSlice"
import { roleSlice } from "./slices/role/roleSlice"
import { resourceApiSlice } from "./slices/resource/resourceApiSlice"
import { resourceSlice } from "./slices/resource/resourceSlice"
import { actionSlice } from "./slices/action/actionSlice"
import { actionApiSlice } from "./slices/action/actionApiSlice"
import { permissionApiSlice } from "./slices/permission/permissionApiSlice"
import { permissionSlice } from "./slices/permission/permissionSlice"
import { rolePermissionApiSlice } from "./slices/role-permission/rolePermissionApiSlice"
import { rolePermissionSlice } from "./slices/role-permission/rolePermissionSlice"
import { userRoleApiSlice } from "./slices/user-role/userRoleApiSlice"
import { userRoleSlice } from "./slices/user-role/userRoleSlice"
import { loginApiSlice } from "./slices/login/loginApiSlice"


// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices({
  [loginApiSlice.reducerPath]: loginApiSlice.reducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [userSlice.reducerPath]: userSlice.reducer,
  [tenantApiSlice.reducerPath]: tenantApiSlice.reducer,
  [tenantSlice.reducerPath]: tenantSlice.reducer,
  [roleApiSlice.reducerPath]: roleApiSlice.reducer,
  [roleSlice.reducerPath]: roleSlice.reducer,
  [resourceApiSlice.reducerPath]: resourceApiSlice.reducer,
  [resourceSlice.reducerPath]: resourceSlice.reducer,
  [actionApiSlice.reducerPath]: actionApiSlice.reducer,
  [actionSlice.reducerPath]: actionSlice.reducer,
  [permissionApiSlice.reducerPath]: permissionApiSlice.reducer,
  [permissionSlice.reducerPath]: permissionSlice.reducer,
  [rolePermissionApiSlice.reducerPath]: rolePermissionApiSlice.reducer,
  [rolePermissionSlice.reducerPath]: rolePermissionSlice.reducer,
  [userRoleApiSlice.reducerPath]: userRoleApiSlice.reducer,
  [userRoleSlice.reducerPath]: userRoleSlice.reducer,
  loadingBar: loadingBarReducer,
  [loadingSlice.reducerPath]: loadingSlice.reducer
})

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(
        loginApiSlice.middleware,
        userApiSlice.middleware,
        tenantApiSlice.middleware,
        roleApiSlice.middleware,
        resourceApiSlice.middleware,
        actionApiSlice.middleware,
        permissionApiSlice.middleware,
        rolePermissionApiSlice.middleware,
        userRoleApiSlice.middleware
      )
    },
    preloadedState,
  })
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>