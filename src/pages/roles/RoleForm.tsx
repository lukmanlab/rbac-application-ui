import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectItem } from "@/components/ui/select"
import { SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Tenant } from "@/states/slices/tenant/tenantSlice"
import type { UseFormReturn } from "react-hook-form"
import type { RoleRequest } from "./RolePage"
import { DialogClose } from "@/components/ui/dialog"

interface RoleFormProps {
  form: UseFormReturn<RoleRequest>
  onSubmitRole: () => void
  closeRef?: React.Ref<HTMLButtonElement>
  tenants?: Tenant[]
}

export default function RoleFrom({ form, onSubmitRole, closeRef, tenants }: RoleFormProps)  {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitRole)} className="space-y-4">
      <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant ID</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tenants?.map((data) => (
                    <SelectItem key={data.id} value={data.id}>{data.name}</SelectItem>
                  ))}  
                </SelectContent>
              </Select>
              <FormDescription>
                Select a tenant to create a Role.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g -> customer" {...field} />
              </FormControl>
              <FormDescription>
                This is a role name for that Tenant.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g -> role for customer" {...field} />
              </FormControl>
              <FormDescription>
                Optional value description for your tenant.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <DialogClose asChild>
          <Button type="button" ref={closeRef} className="hidden" />
        </DialogClose>
      </form>
    </Form>
  )
}