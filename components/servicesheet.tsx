"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilePenLine, Plus } from "lucide-react";
import { ServiceForm } from "./services/form"; // Import the form or any default content you want to show

interface SheetModalProps {
  triggerLabel?: string;
  triggerIcon?: React.ComponentType;
  title?: string;
  description?: string;
  edit?: boolean;
  paramKey?: string; // default is "sheet"
}

export function ServiceSheetModal({
  triggerLabel = "Open",
  triggerIcon: Icon = Plus,
  title = "Title",
  description = "Description",
  edit = false,
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
