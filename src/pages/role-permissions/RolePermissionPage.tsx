import { DataTable } from "@/components/DataTable"
import Layout from "@/components/Layout"

import type { ColumnDef } from "@tanstack/react-table"
import { useEffect } from "react" 
import { useAppDispatch, useAppSelector } from "@/states/hooks"
import { useDeleteRolePermissionMutation, useGetAllRolePermissionQuery } from "@/states/slices/role-permission/rolePermissionApiSlice"
import { selectAllRolePermission, setAllRolePermission, type RolePermission } from "@/states/slices/role-permission/rolePermissionSlice"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

function RolePermissionPage() {
  const [search] = useSearchParams()
  const roleId = search.get('roleId')
  const { data, error, isLoading, refetch } = useGetAllRolePermissionQuery({
    roleId: roleId
  })

  const [deleteRolePermission, { error: errorDelete }] = useDeleteRolePermissionMutation()

  const dispatch = useAppDispatch()
  const rolePermissions = useAppSelector(selectAllRolePermission)

  const columns: ColumnDef<RolePermission>[] = [
    {
      header: "Permission ID",
      accessorFn: (row) => row.permission.id
    },
    {
      header: "Resource",
      accessorFn: (row) => row.permission.resource.name
    },
    {
      header: "Action",
      accessorFn: (row) => row.permission.action.name
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const permissionId = row.original.permission.id
        const resourceName = row.original.permission.resource.name
        const actionName   = row.original.permission.action.name
        return (
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              try {
                await deleteRolePermission({ roleId: roleId, permissionId: permissionId })
                  .then(() => {
                    toast("Permission revoked!", {
                      description: `Resource: ${resourceName}, Action: ${actionName}`
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

  useEffect(() => {
    dispatch(setAllRolePermission({
      rolePermission: {
        allRolePermissions: data?.all_role_permission
      }
    }))
  }, [data?.all_role_permission, dispatch])

  return (
    <Layout
      isLoading={isLoading}
      main={
        <div className="container mx-auto p-4">
          <h1 className="mb-4 font-bold">All Role Permissions</h1>
          {rolePermissions && (
            <>
              <Badge>{rolePermissions[0]?.role?.name}</Badge>
              <DataTable
                columns={columns}
                data={rolePermissions as RolePermission[]}
                showAddButton={false}
              />
            </>
          )}
        </div>
      }
      onError={error || errorDelete}
    />
  )
}

export default RolePermissionPage