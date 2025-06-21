import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Permission } from "./permissionSlice"
import { apiEndpoint } from "@/utils/api"
import { getAccessToken } from "@/utils/localStorage"

export const permissionApiSlice = createApi({
  reducerPath: "permissionApi",
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
    getAllPermission: builder.query({
      query: ({ pageId, pageSize }) => ({
        url: `/v1/permissions?page_id=${pageId}&page_size=${pageSize}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        data: {
          all_permission: Permission[]
        }
      }) => {
        return response.data
      }
    }),
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/v1/permissions/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { Message: string } }) => {
        return response.data
      }
    }),
    addPermission: builder.mutation({
      query: (updatedData) => ({
        url: `/v1/permissions`,
        method: 'POST',
        body: updatedData
      }),
      transformResponse: (response: { data: { Message: string } }) => {
        return response.data
      }
    }),
  }),
})

export const {
  useGetAllPermissionQuery,
  useDeletePermissionMutation,
  useAddPermissionMutation
} = permissionApiSlice