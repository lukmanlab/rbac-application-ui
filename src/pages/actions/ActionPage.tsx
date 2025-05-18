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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useEffect, useRef, useState } from "react" 
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/states/hooks"
import DialogWindow from "@/components/DialogWindow"
import ActionFrom from "./ActionForm"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useAddActionMutation, useDeleteActionMutation, useGetAllActionQuery } from "@/states/slices/action/actionApiSlice"
import { selectAllAction, setAllAction, type Action } from "@/states/slices/action/actionSlice"

const actionSchema = z.object({
  name: z.string().min(4).max(20),
  description: z.string().optional()
})

export type ActionRequest = z.infer<typeof actionSchema>

function ActionPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, error, isLoading, refetch } = useGetAllActionQuery({
    pageId: pagination.pageIndex + 1,
    pageSize: pagination.pageSize
  })

  const [addAction, {
    isLoading: isAddLoading,
    error: errorAdd
  }] = useAddActionMutation()

  const form = useForm<z.infer<typeof actionSchema>>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  })

  async function onSubmit(values: z.infer<typeof actionSchema>) {
    addAction({
      name: values.name,
      description: values.description
    }).unwrap().then(() => {
      form.reset()
      refetch()
      toast("Action Added!", {
        description: `Name: ${values.name}`
      })
    })
    closeRef.current?.click()
  }

  const [deleteAction, { error: errorDelete }] = useDeleteActionMutation()

  const dispatch = useAppDispatch()
  const actions = useAppSelector(selectAllAction)

  const closeRef = useRef<HTMLButtonElement>(null)

  const columns: ColumnDef<Action>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "id",
      header: "Action ID",
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
                    await deleteAction(cell.id).unwrap()
                    refetch()
                    toast("Action deleted!", {
                      description: `Name: ${cell.name}`
                    })
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
    dispatch(setAllAction({
      action: {
        allActions: data?.all_action
      }
    }))
  }, [data?.all_action, dispatch])

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Layout
      isLoading={isLoading || isAddLoading}
      main={
        <div className="container mx-auto p-4">
          <h1 className="mb-4 font-bold">All Actions</h1>
          {actions && (
            <DataTable
              columns={columns}
              data={actions}
              pagination={pagination}
              onPageChange={setPagination}
              isLastPage={actions.length < pagination.pageSize}
              columnNameFilter="name"
              onAddButton={() => setIsDialogOpen(true)}
            />
          )}
          <DialogWindow
            dialogTitle="Add Actions"
            dialogDesc="Create your action with unique name."
            dialogContent={
              <ActionFrom
                form={form}
                onSubmitAction={async () => await onSubmit(form.getValues())}
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

export default ActionPage