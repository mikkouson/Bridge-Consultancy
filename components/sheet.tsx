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

export function SheetDemo() {
  return (
    <Sheet>
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
        <InputForm />
      </SheetContent>
    </Sheet>
  );
}
