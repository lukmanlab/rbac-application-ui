import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { AddUserRoleResponse, UserRole } from "./userRoleSlice"
import { apiEndpoint } from "@/utils/api"

export const userRoleApiSlice = createApi({
  reducerPath: "userRoleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiEndpoint,
  }),
  endpoints: (builder) => ({
    getAllUserRole: builder.query({
      query: ({ pageId, pageSize }) => ({
        url: `/v1/users/roles?page_id=${pageId}&page_size=${pageSize}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        data: {
          all_user_roles: UserRole[]
        }
      }) => {
        return response.data
      }
    }),
    deleteUserRole: builder.mutation({
      query: ({ userId, roleId, tenantId }) => ({
        url: `/v1/users/${userId}/roles/${roleId}`,
        method: 'DELETE',
        body: {
          tenant_id: tenantId
        }
      }),
      transformResponse: (response: { data: { Message: string } }) => {
        return response.data
      }
    }),
    addUserRole: builder.mutation({
      query: ({ userId, tenantId, roleId }) => ({
        url: `/v1/users/${userId}/roles`,
        method: 'POST',
        body: {
          tenant_id: tenantId,
          role_ids: [roleId]
        }
      }),
      transformResponse: (response: { data: AddUserRoleResponse }) => {
        return response.data
      }
    }),
  }),
})

export const {
  useGetAllUserRoleQuery,
  useDeleteUserRoleMutation,
  useAddUserRoleMutation
} = userRoleApiSlice