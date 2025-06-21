import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Tenant } from "./tenantSlice"
import { apiEndpoint } from "@/utils/api"
import { getAccessToken } from "@/utils/localStorage"

export const tenantApiSlice = createApi({
  reducerPath: "tenantApi",
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
    getAllTenant: builder.query({
      query: ({ pageId, pageSize }) => ({
        url: `/v1/tenants?page_id=${pageId}&page_size=${pageSize}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        data: {
          all_tenant: Tenant[]
        }
      }) => {
        return response.data
      }
    }),
    deleteTenant: builder.mutation({
      query: (id) => ({
        url: `/v1/tenants/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { Message: string } }) => {
        return response.data
      }
    }),
    addTenant: builder.mutation({
      query: (updatedData) => ({
        url: `/v1/tenants`,
        method: 'POST',
        body: updatedData
      }),
      transformResponse: (response: { data: Tenant }) => {
        return response.data
      }
    }),
  }),
})

export const {
  useGetAllTenantQuery,
  useDeleteTenantMutation,
  useAddTenantMutation
} = tenantApiSlice