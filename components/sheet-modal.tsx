import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, ReactNode } from "react";
import { FilePenLine, Plus } from "lucide-react";

interface SheetModalProps {
  triggerLabel?: string;
  triggerIcon?: React.ComponentType;
  title?: string;
  description?: string;
  children?: (setOpen: (open: boolean) => void) => ReactNode;
  edit?: boolean;
}

export function SheetModal({
  triggerLabel = "Open",
  triggerIcon: Icon = Plus,
  title = "Title",
  description = "Description",
  edit = false,
  children,
}: SheetModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {edit ? (
          <FilePenLine className=" cursor-pointer text-gray-600 hover:text-green-500 " />
        ) : (
          <Button variant="default" size="sm">
            {Icon && <Icon />} {triggerLabel}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        className="w-full md:w-[900px] overflow-auto"
        onInteractOutside={(e) => {
          const hasPacContainer = e.composedPath().some((el: EventTarget) => {
            if ("classList" in el) {
              return Array.from((el as Element).classList).includes(
                "pac-container"
              );
            }
            return false;
          });

          if (hasPacContainer) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children && children(setOpen)}
      </SheetContent>
    </Sheet>
  );
}
