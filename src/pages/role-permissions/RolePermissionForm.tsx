import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Select, SelectItem } from "@/components/ui/select"
import { SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UseFormReturn } from "react-hook-form"
import { DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import type { Permission } from "@/states/slices/permission/permissionSlice"
import type { Role } from "@/states/slices/role/roleSlice"
import type { RolePermissionRequest } from "../roles/RolePage"

interface RolePermissionFormProps {
  form: UseFormReturn<RolePermissionRequest>
  onSubmitPermission: () => void
  roles?: Role[]
  permissions?: Permission[]
  closeRef?: React.Ref<HTMLButtonElement>
}

export default function RolePermissionFrom({ form, onSubmitPermission, roles, permissions, closeRef }: RolePermissionFormProps)  {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitPermission)} className="space-y-4">
      <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles?.map((data) => (
                      <SelectItem key={data.id} value={data.id}>{`${data.name}-${data.id.slice(-4)}`}</SelectItem>
                    ))}  
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a role to create a mapping to permission.
                </FormDescription>
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="permissionIds"
          render={() => (
            <FormItem>
              <FormLabel>Permission Name</FormLabel>
              <FormDescription>
                Select the permission you want to
              </FormDescription>
              {permissions?.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="permissionIds"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([ ...field.value, item.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value != item.id
                                  )
                                )
                            }}
                          />
                        </FormControl>
                        <FormLabel>
                          {`${item.resource.name}:${item.action.name}`}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                >
                </FormField>
              ))}
            </FormItem>
          )}
        />
        <Button className="mt-4" type="submit">Submit</Button>
        <DialogClose asChild>
          <Button type="button" ref={closeRef} className="hidden" />
        </DialogClose>
      </form>
    </Form>
  )
}