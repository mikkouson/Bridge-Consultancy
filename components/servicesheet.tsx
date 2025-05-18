"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";
import { ServiceForm } from "./services/form"; // Import the form or any default content you want to show

interface SheetModalProps {
  triggerLabel?: string;
  title?: string;
  description?: string;
  edit?: boolean;
  paramKey?: string; // default is "sheet"
}

export function ServiceSheetModal({
  title = "Title",
  description = "Description",
  paramKey = "sheet",
}: SheetModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOpen = searchParams.get(paramKey) === "open";

  const closeSheet = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(paramKey);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent className="w-full md:w-[400px] overflow-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <ServiceForm setOpen={closeSheet} action="create" />{" "}
      </SheetContent>
    </Sheet>
  );
}
