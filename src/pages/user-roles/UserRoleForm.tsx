import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Select, SelectItem } from "@/components/ui/select"
import { SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UseFormReturn } from "react-hook-form"
import { DialogClose } from "@/components/ui/dialog"
import type { UserRoleRequest } from "../roles/RolePage"
import type { User } from "@/states/slices/user/userSlice"

interface UserRoleFormFormProps {
  form: UseFormReturn<UserRoleRequest>
  users?: User[]
  onSubmitUser: () => void
  closeRef?: React.Ref<HTMLButtonElement>
}

export default function UserRoleForm({ form, users, onSubmitUser, closeRef }: UserRoleFormFormProps)  {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitUser)} className="space-y-4">
      <FormField
          control={form.control}
          name="userId"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>User</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users?.map((data) => (
                      <SelectItem key={data.id} value={data.id}>{data.email}</SelectItem>
                    ))}  
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a user to create a mapping to role.
                </FormDescription>
              </FormItem>
            )
          }}
        />
        <Button className="mt-4" type="submit">Submit</Button>
        <DialogClose asChild>
          <Button type="button" ref={closeRef} className="hidden" />
        </DialogClose>
      </form>
    </Form>
  )
}