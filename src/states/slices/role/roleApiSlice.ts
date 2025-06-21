import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Role } from "./roleSlice"
import { apiEndpoint } from "@/utils/api"
import { getAccessToken } from "@/utils/localStorage"

export const roleApiSlice = createApi({
  reducerPath: "roleApi",
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
    getAllRole: builder.query({
      query: ({ pageId, pageSize }) => ({
        url: `/v1/roles?page_id=${pageId}&page_size=${pageSize}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        data: {
          all_role: Role[]
        }
      }) => {
        return response.data
      }
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/v1/roles/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { Message: string } }) => {
        return response.data
      }
    }),
    addRole: builder.mutation({
      query: (updatedData) => ({
        url: `/v1/roles`,
        method: 'POST',
        body: updatedData
      }),
      transformResponse: (response: { data: Role }) => {
        return response.data
      }
    }),
  }),
})

export const {
  useGetAllRoleQuery,
  useDeleteRoleMutation,
  useAddRoleMutation
} = roleApiSlice