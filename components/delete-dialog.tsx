import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function DeleteConfirmationDialog({
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  triggerIcon: TriggerIcon = Trash2,
  button = false,
}: {
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  triggerIcon?: React.ComponentType<{ className?: string }>;
  button?: boolean;
}) {
  const form = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await onConfirm();
    form.reset();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {button ? (
          <Button variant="ghost" className="w-full justify-start">
            Delete
          </Button>
        ) : (
          <TriggerIcon className="cursor-pointer text-gray-600 hover:text-destructive" />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(handleDelete)}>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="hover:bg-red-700"
            >
              {isSubmitting ? "Deleting..." : "Continue"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
