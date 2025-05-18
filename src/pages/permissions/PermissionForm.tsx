import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Select, SelectItem } from "@/components/ui/select"
import { SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UseFormReturn } from "react-hook-form"
import type { PermissionRequest } from "./PermissionPage"
import { DialogClose } from "@/components/ui/dialog"
import type { Action } from "@/states/slices/action/actionSlice"
import type { Resource } from "@/states/slices/resource/resourceSlice"
import { Checkbox } from "@/components/ui/checkbox"

interface RoleFormProps {
  form: UseFormReturn<PermissionRequest>
  onSubmitPermission: () => void
  resources?: Resource[]
  actions?: Action[]
  closeRef?: React.Ref<HTMLButtonElement>
}

export default function RoleFrom({ form, onSubmitPermission, resources, actions, closeRef }: RoleFormProps)  {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitPermission)} className="space-y-4">
      <FormField
          control={form.control}
          name="resourceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Name</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {resources?.map((data) => (
                    <SelectItem key={data.id} value={data.id}>{data.name}</SelectItem>
                  ))}  
                </SelectContent>
              </Select>
              <FormDescription>
                Select a resource to create a Permission.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="actionId"
          render={() => (
            <FormItem>
              <FormLabel>Action Name</FormLabel>
              <FormDescription>
                Select the action you want to
              </FormDescription>
              {actions?.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="actionId"
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
                          {item.name}
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