import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilePenLine } from "lucide-react";
import { EditCompany } from "./edit-company";
import { CompanySchemaType } from "@/app/types/companies.type";
import { useState } from "react";

export function EditCompanySheet({ data }: { data: CompanySchemaType }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <FilePenLine className=" cursor-pointer text-gray-600 hover:text-green-500 " />
      </SheetTrigger>
      <SheetContent
        className="overflow-auto"
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
          <SheetTitle>Edit Company</SheetTitle>
          <SheetDescription>
            Update the details below to modify the company information.
          </SheetDescription>
        </SheetHeader>
        <EditCompany data={data} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
