import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Login } from "./loginSlice"
import { apiEndpoint } from "@/utils/api"

export const loginApiSlice = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiEndpoint,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (updatedData) => ({
        url: `/v1/login`,
        method: 'POST',
        body: updatedData,
      }),
      transformResponse: (response: { data: Login }) => {
        return response.data
      }
    }),
    refreshToken: builder.mutation({

      query: () => ({
        url: `/v1/refresh`,
        method: 'POST',
      }),
      transformResponse: (response: { data: Login }) => {
        return response.data
      }
    }),    
  }),
})

export const {
  useLoginUserMutation,
  useRefreshTokenMutation
} = loginApiSlice