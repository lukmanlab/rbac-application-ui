import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { UseFormReturn } from "react-hook-form"
import type { ActionRequest } from "./ActionPage"
import { DialogClose } from "@/components/ui/dialog"

interface ActionFormProps {
  form: UseFormReturn<ActionRequest>
  onSubmitAction: () => void
  closeRef?: React.Ref<HTMLButtonElement>
}

export default function ActionForm({ form, onSubmitAction, closeRef }: ActionFormProps)  {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAction)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g -> booking" {...field} />
              </FormControl>
              <FormDescription>
                This is a action name.
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
                <Input placeholder="e.g -> action for booking" {...field} />
              </FormControl>
              <FormDescription>
                Optional value description for your action.
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