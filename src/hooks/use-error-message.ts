import { useCallback } from "react"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import type { SerializedError } from "@reduxjs/toolkit"
import { useRefreshTokenMutation } from "@/states/slices/login/loginApiSlice"
import { putAccessToken, removeAccessToken } from "@/utils/localStorage"
import { toast } from "sonner"

export default function useErrorMessage() {
  const [refreshToken, { isLoading: isLoadingRefreshToken, error: errorRefreshToken }] = useRefreshTokenMutation();

  const getErrorMessage = useCallback(
    (error: FetchBaseQueryError | SerializedError): string => {
      if ("status" in error) {
        if (error.status === 401) {
          try {
            refreshToken('').then((res) => {
              if (res.error) {
                removeAccessToken()
                window.location.href = "/"
              }
              if (res.data?.access_token) putAccessToken(res.data?.access_token)
            })
          } catch (err) {
            console.log(err)
          }
          return "Unauthorized"
        }
        const errData = error.data as { message?: string } | undefined;
        return errData?.message ?? `Request failed with status ${error.status}`;
      } else {
        return error.message ?? "An unknown error occurred";
      }
    },
    []
  );

    const showErrorToast = (error: FetchBaseQueryError | SerializedError) => {
      const errorMessage = getErrorMessage(error)
      toast("Please wait, there is Error from Backend", {
        description: errorMessage,
        action: {
          label: "Close",
          onClick: () => console.log("close is clicked")
        }
      })
    };

  return {
    isLoadingRefreshToken,
    errorRefreshToken,
    showErrorToast
  }
}