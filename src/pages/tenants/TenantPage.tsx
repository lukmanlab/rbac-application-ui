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
import { useEffect, useState } from "react" 
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/states/hooks"
import DialogWindow from "@/components/DialogWindow"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import useInput from "@/hooks/use-input"
import { useAddTenantMutation, useDeleteTenantMutation, useGetAllTenantQuery } from "@/states/slices/tenant/tenantApiSlice"
import { selectAllTenant, setAllTenant, type Tenant } from "@/states/slices/tenant/tenantSlice"

interface TenantFormProps {
  inputValue: string
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function TenantFrom({ inputValue, onInputChange }: TenantFormProps)  {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          value={inputValue}
          onChange={onInputChange}
          placeholder="example: store-a"
          className="col-span-3"
        />
      </div>
    </div>
  )
}

function TenantPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, error, isLoading, refetch } = useGetAllTenantQuery({
    pageId: pagination.pageIndex + 1,
    pageSize: pagination.pageSize
  })

  const dispatch = useAppDispatch()
  const tenants = useAppSelector(selectAllTenant)

  const [deleteTenant, { error: errorDelete }] = useDeleteTenantMutation()

  const columns: ColumnDef<Tenant>[] = [
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
      accessorKey: "id",
      header: "ID",
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
                    await deleteTenant(cell.id).unwrap()
                    refetch()
                    toast("Tenant deleted!", {
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

  const [addTenant, {
    isLoading: isTenantLoading,
    error: errorAdd
  }] = useAddTenantMutation()

  const [name, onNameChange, setName] = useInput()

  useEffect(() => {
    dispatch(setAllTenant({
      tenant: {
        allTenants: data?.all_tenant
      }
    }))
  }, [data?.all_tenant, dispatch])

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Layout
      isLoading={isLoading || isTenantLoading}
      main={
        <div className="container mx-auto p-4">
          <h1 className="mb-4 font-bold">All Tenants</h1>
          {tenants && (
            <DataTable
              columns={columns}
              data={tenants}
              pagination={pagination}
              onPageChange={setPagination}
              isLastPage={tenants.length < pagination.pageSize}
              columnNameFilter="name"
              onAddButton={() => setIsDialogOpen(true)}
            />
          )}
          <DialogWindow
            dialogTitle="Add tenant"
            dialogDesc="Create your tenant with unique name."
            dialogContent={<TenantFrom inputValue={name} onInputChange={onNameChange} />}
            useDialogSubmitButton
            buttonSubmit="Add"
            disabled={name.length < 5 || name.length > 20}
            onSubmit={async () => {
              try {
                await addTenant({ name }).unwrap()
                setName("")
                refetch()
                toast("Tenant Added!", {
                  description: `Name: ${name}`
                })
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (_) { /* empty */ }
            }}
            isManualTriggerOpen={isDialogOpen}
            setManualTriggerOpen={setIsDialogOpen}
          />
        </div>
      }
      onError={error || errorAdd || errorDelete }
    />
  )
}

export default TenantPage