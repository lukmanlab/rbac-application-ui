import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Resource } from "./resourceSlice"
import { apiEndpoint } from "@/utils/api"

export const resourceApiSlice = createApi({
  reducerPath: "resourceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiEndpoint,
  }),
  endpoints: (builder) => ({
    getAllResource: builder.query({
      query: ({ pageId, pageSize }) => ({
        url: `/v1/resources?page_id=${pageId}&page_size=${pageSize}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        data: {
          all_resource: Resource[]
        }
      }) => {
        return response.data
      }
    }),
    deleteResource: builder.mutation({
      query: (id) => ({
        url: `/v1/resources/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { Message: string } }) => {
        return response.data
      }
    }),
    addResource: builder.mutation({
      query: (updatedData) => ({
        url: `/v1/resources`,
        method: 'POST',
        body: updatedData
      }),
      transformResponse: (response: { data: Resource }) => {
        return response.data
      }
    }),
  }),
})

export const {
  useGetAllResourceQuery,
  useDeleteResourceMutation,
  useAddResourceMutation
} = resourceApiSlice