import { DataTable } from "@/components/DataTable"
import Layout from "@/components/Layout"

import type { ColumnDef } from "@tanstack/react-table"
import { useEffect, useState } from "react" 
import { useAppDispatch, useAppSelector } from "@/states/hooks"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useDeleteUserRoleMutation, useGetAllUserRoleQuery } from "@/states/slices/user-role/userRoleApiSlice"
import { selectAllUserRole, setAllUserRole, type UserRole } from "@/states/slices/user-role/userRoleSlice"

function UserRolePage() {
  const dispatch = useAppDispatch()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, error, isLoading, refetch } = useGetAllUserRoleQuery({
    pageId: pagination.pageIndex + 1,
    pageSize: pagination.pageSize
  })

  const [deleteUserRole, { error: errorDelete }] = useDeleteUserRoleMutation()

  const columns: ColumnDef<UserRole>[] = [
    {
      header: "User Email",
      accessorKey: "user_email",
      accessorFn: (row) => row.user_email
    },
    {
      header: "Tenant",
      accessorFn: (row) => row.tenant_name
    },
    {
      header: "Role",
      accessorFn: (row) => row.role_name
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const userId = row.original.user_id
        const roleId = row.original.role_id
        const tenantId = row.original.tenant_id

        const userEmail = row.original.user_email
        const roleName = row.original.role_name

        return (
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              try {
                await deleteUserRole({
                  userId: userId,
                  roleId: roleId,
                  tenantId: tenantId
                })
                  .then(() => {
                    toast("User role revoked!", {
                      description: `Email: ${userEmail}, Role: ${roleName}`
                    })
                    refetch()
                  })
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (_) { /* empty */ }
            }}
          >
            Revoke
          </Button>
        )
      }
    }
  ]

  const userRoles = useAppSelector(selectAllUserRole)

  useEffect(() => {
    dispatch(setAllUserRole({
      userRole: {
        allUserRoles: data?.all_user_roles
      }
    }))
  }, [data?.all_user_roles, dispatch])

  return (
    <Layout
      isLoading={isLoading}
      main={
        <div className="container mx-auto p-4">
          <h1 className="mb-4 font-bold">All User Roles</h1>
          {userRoles && (
            <>
              <DataTable
                columns={columns}
                data={userRoles as UserRole[]}
                showAddButton={false}
                pagination={pagination}
                onPageChange={setPagination}
                isLastPage={userRoles.length < pagination.pageSize}
                columnNameFilter="user_email"
              />
            </>
          )}
        </div>
      }
      onError={error || errorDelete}
    />
  )
}

export default UserRolePage