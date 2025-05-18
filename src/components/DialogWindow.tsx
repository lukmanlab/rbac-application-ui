import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  dialogTitle: string
  dialogDesc: string
  dialogContent: React.ReactElement
  useDialogSubmitButton: boolean
  buttonSubmit?: string
  disabled?: boolean
  onSubmit?: () => void
  isManualTriggerOpen?: boolean
  setManualTriggerOpen?: (open: boolean) => void
}

export default function DialogWindow({
  dialogTitle,
  dialogDesc,
  dialogContent,
  useDialogSubmitButton = false,
  buttonSubmit = "Submit",
  disabled = false,
  onSubmit,
  isManualTriggerOpen = false,
  setManualTriggerOpen,
}: Props) {
  return (
    <Dialog open={isManualTriggerOpen} onOpenChange={setManualTriggerOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDesc}
          </DialogDescription>
        </DialogHeader>
        {dialogContent}
        <DialogFooter>
          <DialogClose asChild>
          {useDialogSubmitButton && <Button disabled={disabled} type="submit" onClick={onSubmit}>{buttonSubmit}</Button>}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
