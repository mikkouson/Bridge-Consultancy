import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InputForm } from "./input";
import { useState } from "react";

export function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm">
          Create Company
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Company</SheetTitle>
          <SheetDescription>
            Fill in the details to create a new company.
          </SheetDescription>
        </SheetHeader>
        <InputForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
