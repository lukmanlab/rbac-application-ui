import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Action } from "./actionSlice"
import { apiEndpoint } from "@/utils/api"
import { getAccessToken } from "@/utils/localStorage"

export const actionApiSlice = createApi({
  reducerPath: "actionApi",
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
    getAllAction: builder.query({
      query: ({ pageId, pageSize }) => ({
        url: `/v1/actions?page_id=${pageId}&page_size=${pageSize}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        data: {
          all_action: Action[]
        }
      }) => {
        return response.data
      }
    }),
    deleteAction: builder.mutation({
      query: (id) => ({
        url: `/v1/actions/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { Message: string } }) => {
        return response.data
      }
    }),
    addAction: builder.mutation({
      query: (updatedData) => ({
        url: `/v1/actions`,
        method: 'POST',
        body: updatedData
      }),
      transformResponse: (response: { data: Action }) => {
        return response.data
      }
    }),
  }),
})

export const {
  useGetAllActionQuery,
  useDeleteActionMutation,
  useAddActionMutation
} = actionApiSlice