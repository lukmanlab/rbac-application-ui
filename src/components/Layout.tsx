import { useAppDispatch } from "@/states/hooks"
import { useEffect } from "react"
import { LoadingBar } from "react-redux-loading-bar"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import type { SerializedError } from "@reduxjs/toolkit"
import { Toaster } from "./ui/sonner"
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { showLoading } from "react-redux-loading-bar"
import useErrorMessage from "@/hooks/use-error-message"

type Props = {
  main?: React.ReactNode
  isLoading?: boolean
  onError?: FetchBaseQueryError | SerializedError
}

export default function Layout({
  main,
  isLoading,
  onError
}: Props) {
  const dispatch = useAppDispatch()
  const {
    isLoadingRefreshToken,
    showErrorToast
  } = useErrorMessage()

  useEffect(() => {
    if (isLoading || isLoadingRefreshToken) dispatch(showLoading())
  }, [isLoading, isLoadingRefreshToken, dispatch])

  useEffect(() => {
    if (onError) {
      showErrorToast(onError)
    }
  }, [onError])

  return (
    <>
      <LoadingBar />
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {main}
        </main>
      </SidebarProvider>
      <Toaster duration={2000} position="top-right" />
    </>
  )
}