import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RolePermission } from "./rolePermissionSlice"
import { apiEndpoint } from "@/utils/api"
import { getAccessToken } from "@/utils/localStorage"

export const rolePermissionApiSlice = createApi({
  reducerPath: "rolePermissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiEndpoint,
    prepareHeaders: (headers) => {
      const token = getAccessToken()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAllRolePermission: builder.query({
      query: ({ roleId }) => ({
        url: `/v1/roles/${roleId}/permissions`,
        method: 'GET',
      }),
      transformResponse: (response: {
        data: {
          all_role_permission: RolePermission[]
        }
      }) => {
        return response.data
      }
    }),
    deleteRolePermission: builder.mutation({
      query: ({ roleId, permissionId }) => ({
        url: `/v1/roles/${roleId}/permissions/${permissionId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { Message: string } }) => {
        return response.data
      }
    }),
    addRolePermission: builder.mutation({
      query: ({ roleId, permissionIds }) => ({
        url: `/v1/roles/${roleId}/permissions`,
        method: 'POST',
        body: {
          permission_ids: permissionIds
        }
      }),
      transformResponse: (response: { data: { Message: string } }) => {
        return response.data
      }
    }),
  }),
})

export const {
  useGetAllRolePermissionQuery,
  useDeleteRolePermissionMutation,
  useAddRolePermissionMutation
} = rolePermissionApiSlice