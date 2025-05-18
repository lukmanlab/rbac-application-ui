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
import { tenantApiSlice } from "@/states/slices/tenant/tenantApiSlice"
import { selectAllTenant, setAllTenant } from "@/states/slices/tenant/tenantSlice"
import RoleFrom from "./RoleForm"
import { useAddRoleMutation, useDeleteRoleMutation, useGetAllRoleQuery } from "@/states/slices/role/roleApiSlice"
import { selectAllRole, setAllRole, type Role } from "@/states/slices/role/roleSlice"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { selectAllPermission, setAllPermission } from "@/states/slices/permission/permissionSlice"
import { useAddRolePermissionMutation } from "@/states/slices/role-permission/rolePermissionApiSlice"
import RolePermissionFrom from "../role-permissions/RolePermissionForm"
import { permissionApiSlice } from "@/states/slices/permission/permissionApiSlice"
import { Badge } from "@/components/ui/badge"
import { userApiSlice } from "@/states/slices/user/userApiSlice"
import { selectAllUser, setAllUser } from "@/states/slices/user/userSlice"
import UserRoleForm from "../user-roles/UserRoleForm"
import { useAddUserRoleMutation } from "@/states/slices/user-role/userRoleApiSlice"

const rolePermissionSchema = z.object({
  roleId: z.string().min(36),
  permissionIds: z.array(z.string()).min(1),
})

export type RolePermissionRequest = z.infer<typeof rolePermissionSchema>

const roleSchema = z.object({
  tenantId: z.string().min(36),
  name: z.string().min(4).max(20),
  description: z.string().optional()
})

export type RoleRequest = z.infer<typeof roleSchema>

const userRoleSchema = z.object({
  userId: z.string().min(36)
})

export type UserRoleRequest = z.infer<typeof userRoleSchema>

type RoleTenant = {
  roleId: string
  tenantId: string
}

function RolePage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, error, isLoading, refetch } = useGetAllRoleQuery({
    pageId: pagination.pageIndex + 1,
    pageSize: pagination.pageSize
  })

  const [addRole, {
    isLoading: isAddLoading,
    error: errorAdd
  }] = useAddRoleMutation()

  const [addRolePermission, {
    isLoading: isAddRPLoading,
    error: errorAddRP
  }] = useAddRolePermissionMutation()

  const [addUserRolePermission, {
    isLoading: isAddURLoading,
    error: errorAddUR
  }] = useAddUserRoleMutation()

  const [deleteRole, { error: errorDelete }] = useDeleteRoleMutation()

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      tenantId: "",
      name: "",
      description: ""
    }
  })

  const formRolePermission = useForm<z.infer<typeof rolePermissionSchema>>({
    resolver: zodResolver(rolePermissionSchema),
    defaultValues: {
      roleId: "",
      permissionIds: [],
    }
  })

  const formUserRole = useForm<z.infer<typeof userRoleSchema>>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      userId: ""
    }
  })

  async function onSubmit(values: z.infer<typeof roleSchema>) {
    addRole({
      tenant_id: values.tenantId,
      name: values.name,
      description: values.description
    }).unwrap().then(() => {
      form.reset()
      refetch()
      toast("Role Added!", {
        description: `Name: ${values.name}`
      })
    })
    closeRef.current?.click()
  }

  async function onSubmitRolePermission(values: z.infer<typeof rolePermissionSchema>) {
    addRolePermission({
      roleId: values.roleId,
      permissionIds: values.permissionIds,
    }).unwrap().then(() => {
      form.reset()
      refetch()
      toast("Role Permission Added!")
    })
    navigate(`/role-permission-mapping/?roleId=${values.roleId}`)
    closeRef.current?.click()
  }

  async function onSubmitUserRole(values: z.infer<typeof userRoleSchema>, otherArg?: RoleTenant ) {
    addUserRolePermission({
      userId: values.userId,
      roleId: otherArg?.roleId,
      tenantId: otherArg?.tenantId
    }).unwrap().then(() => {
      form.reset()
      refetch()
      toast("User Added!")
    })
    // navigate(`/role-permission-mapping/?roleId=${values.roleId}`)
    closeRef.current?.click()
  }

  const tenants = useAppSelector(selectAllTenant)
  const roles = useAppSelector(selectAllRole)
  const permissions = useAppSelector(selectAllPermission)
  const users = useAppSelector(selectAllUser)

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isRolePermissionDialogOpen, setIsRolePermissionDialogOpen] = useState(false)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role[]>()

  const [roleAndTenant, setRoleAndTenant] = useState<RoleTenant>()

  const closeRef = useRef<HTMLButtonElement>(null)

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "tenant_id",
      header: "Tenant ID",
      cell: ({ row }) => {
        const tenantId = row.getValue("tenant_id") as string
        const masked = tenantId.length > 1 ? `... ...${tenantId.slice(-5)}` : tenantId
        return <span>{masked}</span>
      }
    },
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
      cell: ({ row }) => {
        return (
          <Badge>{row.original.name}</Badge>
        )
      }
    },
    {
      accessorKey: "id",
      header: "Role ID",
    },
    {
      accessorKey: "description",
      header: "Description",
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
              <DropdownMenuItem
                onClick={() => navigate(`/role-permission-mapping/?roleId=${cell.id}`)}
              >
                List Permission
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const callPermissionApi = async () => {
                    const result = await dispatch(
                      permissionApiSlice.endpoints.getAllPermission.initiate({
                        pageId: 1,
                        pageSize: 20
                      },
                      { forceRefetch: true }
                    ))
                    if ('data' in result) {
                      dispatch(setAllPermission({
                        permission: {
                          allPermissions: result?.data?.all_permission
                        }
                      }))
                    }
                  }
                  callPermissionApi()
                  setIsRolePermissionDialogOpen(true)
                  const roleList = roles?.filter((role) => role.id === cell.id)
                  setSelectedRole(roleList)
                }}
              >
                Assign Permission
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const callUserApi = async () => {
                    const result = await dispatch(
                      userApiSlice.endpoints.getAllUser.initiate({
                        pageId: 1,
                        pageSize: 20
                      },
                      { forceRefetch: true }
                    ))
                    if ('data' in result) {
                      dispatch(setAllUser({
                        user: {
                          allUsers: result?.data?.all_user
                        }
                      }))
                    }
                  }
                  callUserApi()
                  const tenantId = row.original.tenant_id
                  setRoleAndTenant({
                    roleId: cell.id,
                    tenantId: tenantId
                  })
                  console.log(roleAndTenant)
                  setIsUserDialogOpen(true)
                }}
              >
                Assign User
              </DropdownMenuItem>              
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={async () => {
                  try {
                    await deleteRole(cell.id).unwrap()
                    refetch()
                    toast("Role deleted!", {
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
    dispatch(setAllRole({
      role: {
        allRoles: data?.all_role
      }
    }))
  }, [data?.all_role, dispatch])

  return (
    <Layout
      isLoading={isLoading || isAddLoading || isAddRPLoading || isAddURLoading}
      main={
        <div className="container mx-auto p-4">
          <h1 className="mb-4 font-bold">All Roles</h1>
          {roles && (
            <DataTable
              columns={columns}
              data={roles}
              pagination={pagination}
              onPageChange={setPagination}
              isLastPage={roles.length < pagination.pageSize}
              columnNameFilter="name"
              onAddButton={async () => {
                form.reset()
                setIsRoleDialogOpen(true)
                const result = await dispatch(
                  tenantApiSlice.endpoints.getAllTenant.initiate({
                    pageId: 1,
                    pageSize: 20
                  },
                  { forceRefetch: true }
                  )
                )
                if ('data' in result) {
                  dispatch(setAllTenant({
                    tenant: {
                      allTenants: result?.data?.all_tenant
                    }
                  }))
                }
              }}
            />
          )}
          <DialogWindow
            dialogTitle="Add Roles"
            dialogDesc="Create your role with unique name."
            dialogContent={
              <RoleFrom
                form={form}
                onSubmitRole={async () => await onSubmit(form.getValues())}
                tenants={tenants}
                closeRef={closeRef}
              />
            }
            useDialogSubmitButton={false}
            isManualTriggerOpen={isRoleDialogOpen}
            setManualTriggerOpen={setIsRoleDialogOpen}
          />
          <DialogWindow
            dialogTitle="Add Permissions for a Role"
            dialogDesc="Create your role with permissions"
            dialogContent={
              <RolePermissionFrom
                form={formRolePermission}
                onSubmitPermission={async () => await onSubmitRolePermission(formRolePermission.getValues())}
                roles={selectedRole}
                permissions={permissions}
                closeRef={closeRef}
              />
            }
            useDialogSubmitButton={false}
            isManualTriggerOpen={isRolePermissionDialogOpen}
            setManualTriggerOpen={setIsRolePermissionDialogOpen}
          />
          <DialogWindow
            dialogTitle="Add User to this Role"
            dialogDesc="Assign the user to a specific Role"
            dialogContent={
              <UserRoleForm
                form={formUserRole}
                onSubmitUser={async () => await onSubmitUserRole(formUserRole.getValues(), roleAndTenant)}
                users={users}
                closeRef={closeRef}
              />
            }
            useDialogSubmitButton={false}
            isManualTriggerOpen={isUserDialogOpen}
            setManualTriggerOpen={setIsUserDialogOpen}
          />
        </div>
      }
      onError={error || errorAdd || errorDelete || errorAddRP || errorAddUR}
    />
  )
}

export default RolePage