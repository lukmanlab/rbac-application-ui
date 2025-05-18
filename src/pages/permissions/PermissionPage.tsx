import { DataTable } from "@/components/DataTable"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { parseDate } from "@/utils/formatDate"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { ColumnDef } from "@tanstack/react-table"
import { useEffect, useRef, useState } from "react" 
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/states/hooks"
import DialogWindow from "@/components/DialogWindow"
import PermissionFrom from "./PermissionForm"
import { useAddPermissionMutation, useDeletePermissionMutation, useGetAllPermissionQuery } from "@/states/slices/permission/permissionApiSlice"
import { selectAllPermission, setAllPermission, type Permission } from "@/states/slices/permission/permissionSlice"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { selectAllResource, setAllResource } from "@/states/slices/resource/resourceSlice"
import { selectAllAction, setAllAction } from "@/states/slices/action/actionSlice"
import { resourceApiSlice } from "@/states/slices/resource/resourceApiSlice"
import { actionApiSlice } from "@/states/slices/action/actionApiSlice"
import { MoreHorizontal } from "lucide-react"

const permissionSchema = z.object({
  resourceId: z.string().min(36),
  actionId: z.array(z.string()).min(1),
})

export type PermissionRequest = z.infer<typeof permissionSchema>

function PermissionPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, error, isLoading, refetch } = useGetAllPermissionQuery({
    pageId: pagination.pageIndex + 1,
    pageSize: pagination.pageSize
  })

  const [addPermission, {
    isLoading: isAddLoading,
    error: errorAdd
  }] = useAddPermissionMutation()

  const form = useForm<z.infer<typeof permissionSchema>>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      resourceId: "",
      actionId: [],
    }
  })

  async function onSubmit(values: z.infer<typeof permissionSchema>) {
    addPermission({
      resource_id: values.resourceId,
      action_ids: values.actionId,
    }).unwrap().then(() => {
      form.reset()
      refetch()
      toast("Permission Added!")
    })
    closeRef.current?.click()
  }

  const [deletePermission, { error: errorDelete }] = useDeletePermissionMutation()

  const dispatch = useAppDispatch()
  const resources = useAppSelector(selectAllResource)
  const actions = useAppSelector(selectAllAction)
  const permissions = useAppSelector(selectAllPermission)

  const closeRef = useRef<HTMLButtonElement>(null)

  const columns: ColumnDef<Permission>[] = [
    {
      header: "Permission",
      cell: ({ row }) => {
        return `${row.original.resource.name}:${row.original.action.name}`
      }
    },
    {
      accessorKey: "id",
      header: "Permission ID",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string
        return parseDate(date, 'D-MM-YYYY')
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const cell = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(cell.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={async () => {
                  try {
                    await deletePermission(cell.id).unwrap()
                    refetch()
                    toast("Permission deleted!")
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  } catch (_) { /* empty */ }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  useEffect(() => {
    dispatch(setAllPermission({
      permission: {
        allPermissions: data?.all_permission
      }
    }))
  }, [data?.all_permission, dispatch])

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Layout
      isLoading={isLoading || isAddLoading}
      main={
        <div className="container mx-auto p-4">
          <h1 className="mb-4 font-bold">All Permissions</h1>
          {permissions && (
            <DataTable
              columns={columns}
              data={permissions}
              pagination={pagination}
              onPageChange={setPagination}
              isLastPage={permissions.length < pagination.pageSize}
              columnNameFilter="id"
              onAddButton={() => {
                setIsDialogOpen(true)
                form.reset()
                const callDeps = async () => {
                  const result1 = await dispatch(
                    resourceApiSlice.endpoints.getAllResource.initiate({
                      pageId: 1,
                      pageSize: 20
                    },
                    { forceRefetch: true }
                  )
                  )
                  if ('data' in result1) {
                    dispatch(setAllResource({
                      resource: {
                        allResources: result1?.data?.all_resource
                      }
                    }))
                  }
                  const result2 = await dispatch(
                    actionApiSlice.endpoints.getAllAction.initiate({
                      pageId: 1,
                      pageSize: 20
                    },
                    { forceRefetch: true }
                  )
                  )
                  if ('data' in result2) {
                    dispatch(setAllAction({
                      action: {
                        allActions: result2?.data?.all_action
                      }
                    }))
                  }
                }
                callDeps()
              }}
            />
          )}
          <DialogWindow
            dialogTitle="Add Permissions"
            dialogDesc="Create your permission with unique name."
            dialogContent={
              <PermissionFrom
                form={form}
                onSubmitPermission={async () => await onSubmit(form.getValues())}
                resources={resources}
                actions={actions}
                closeRef={closeRef}
              />
            }
            useDialogSubmitButton={false}
            isManualTriggerOpen={isDialogOpen}
            setManualTriggerOpen={setIsDialogOpen}
          />
        </div>
      }
      onError={error || errorAdd || errorDelete}
    />
  )
}

export default PermissionPage