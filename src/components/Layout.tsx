import { useAppDispatch } from "@/states/hooks"
import { useEffect } from "react"
import { LoadingBar, showLoading } from "react-redux-loading-bar"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import type { SerializedError } from "@reduxjs/toolkit"
import { toast } from "sonner"
import { Toaster } from "./ui/sonner"
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { AppSidebar } from "./AppSidebar"

type Props = {
  main?: React.ReactNode
  isLoading?: boolean
  onError?: FetchBaseQueryError | SerializedError
}

function getErrorMessage(error: FetchBaseQueryError | SerializedError): string {
  if ("status" in error) {
    const errData = error.data as { message?: string } | undefined
    return errData?.message ?? `Request failed with status ${error.status}`
  } else {
    return error.message ?? "An unknown error occurred"
  }
}

export default function Layout({
  main,
  isLoading,
  onError
}: Props) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isLoading) dispatch(showLoading())
  }, [isLoading, dispatch])

  useEffect(() => {
    if (onError) {
      const message = getErrorMessage(onError)
      toast("Please wait, there is Error from Backend", {
        description: message,
        action: {
          label: "Close",
          onClick: () => console.log("close is clicked")
        }
      })
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
      <Toaster duration={1000} position="top-right" />
    </>
  )
}