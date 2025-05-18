import { DataTable } from "@/components/DataTable"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { useDeleteUserMutation, useGetAllUserQuery } from "@/states/slices/user/userApiSlice"
import { selectAllUser, setAllUser, type UserResponse } from "@/states/slices/user/userSlice"
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

function UserPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, error, isLoading } = useGetAllUserQuery({
    pageId: pagination.pageIndex + 1,
    pageSize: pagination.pageSize
  })

  const dispatch = useAppDispatch()
  const users = useAppSelector(selectAllUser)

  const [deleteUser] = useDeleteUserMutation()

  const columns: ColumnDef<UserResponse>[] = [
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
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
                <span className="sr-only">Open menu</span>
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
                    await deleteUser(cell.id).unwrap()
                    dispatch(setAllUser({
                      user: {
                        allUsers: users?.filter((u) => u.id != cell.id)
                      }
                    }))
                    toast("User deleted!", {
                      description: `Email: ${cell.email}`
                    })
                  } catch (error) {
                    toast("There is error!", {
                      description: `Detail error: ${error}`
                    })
                  }
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
    dispatch(setAllUser({
      user: {
        allUsers: data?.all_user
      }
    }))
  }, [data?.all_user, dispatch])

  return (
    <Layout
      isLoading={isLoading}
      main={
        <div className="container mx-auto p-4">
          <h1 className="mb-4 font-bold">All Users</h1>
          {users && (
            <DataTable
              columns={columns}
              data={users}
              pagination={pagination}
              onPageChange={setPagination}
              columnNameFilter="email"
              isLastPage={users.length < pagination.pageSize}
              showAddButton={false}
            />
          )}
        </div>
      }
      onError={error}
    />
  )
}

export default UserPage