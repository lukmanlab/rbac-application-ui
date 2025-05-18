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
import ResourceFrom from "./ResourceForm"
import { useAddResourceMutation, useDeleteResourceMutation, useGetAllResourceQuery } from "@/states/slices/resource/resourceApiSlice"
import { selectAllResource, setAllResource, type Resource } from "@/states/slices/resource/resourceSlice"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const resourceSchema = z.object({
  name: z.string().min(4).max(20),
  description: z.string().optional()
})

export type ResourceRequest = z.infer<typeof resourceSchema>

function ResourcePage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, error, isLoading, refetch } = useGetAllResourceQuery({
    pageId: pagination.pageIndex + 1,
    pageSize: pagination.pageSize
  })

  const [addResource, {
    isLoading: isAddLoading,
    error: errorAdd
  }] = useAddResourceMutation()

  const form = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  })

  async function onSubmit(values: z.infer<typeof resourceSchema>) {
    addResource({
      name: values.name,
      description: values.description
    }).unwrap().then(() => {
      form.reset()
      refetch()
      toast("Resource Added!", {
        description: `Name: ${values.name}`
      })
    })
    closeRef.current?.click()
  }

  const [deleteResource, { error: errorDelete }] = useDeleteResourceMutation()

  const dispatch = useAppDispatch()
  const resources = useAppSelector(selectAllResource)

  const closeRef = useRef<HTMLButtonElement>(null)

  const columns: ColumnDef<Resource>[] = [
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
      header: "Resource ID",
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
                    await deleteResource(cell.id).unwrap()
                    refetch()
                    toast("Resource deleted!", {
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
    dispatch(setAllResource({
      resource: {
        allResources: data?.all_resource
      }
    }))
  }, [data?.all_resource, dispatch])

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Layout
      isLoading={isLoading || isAddLoading}
      main={
        <div className="container mx-auto p-4">
          <h1 className="mb-4 font-bold">All Resources</h1>
          {resources && (
            <DataTable
              columns={columns}
              data={resources}
              pagination={pagination}
              onPageChange={setPagination}
              isLastPage={resources.length < pagination.pageSize}
              columnNameFilter="name"
              onAddButton={() => setIsDialogOpen(true)}
            />
          )}
          <DialogWindow
            dialogTitle="Add Resources"
            dialogDesc="Create your resource with unique name."
            dialogContent={
              <ResourceFrom
                form={form}
                onSubmitResource={async () => await onSubmit(form.getValues())}
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

export default ResourcePage