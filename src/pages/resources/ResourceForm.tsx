import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { UseFormReturn } from "react-hook-form"
import type { ResourceRequest } from "./ResourcePage"
import { DialogClose } from "@/components/ui/dialog"

interface ResourceFormProps {
  form: UseFormReturn<ResourceRequest>
  onSubmitResource: () => void
  closeRef?: React.Ref<HTMLButtonElement>
}

export default function ResourceForm({ form, onSubmitResource, closeRef }: ResourceFormProps)  {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitResource)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g -> booking" {...field} />
              </FormControl>
              <FormDescription>
                This is a resource name.
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
                <Input placeholder="e.g -> resource for booking" {...field} />
              </FormControl>
              <FormDescription>
                Optional value description for your resource.
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