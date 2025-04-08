"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

export function ComboboxForm<TFieldValues extends FieldValues = FieldValues>({
  data,
  form,
  name,
  formName,
}: {
  data: { id: string; [key: string]: string }[];
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;

  formName: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? data?.find((data) => data.id === field.value)?.[formName]
                    : `Select ${formName}`}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
              <Command className="w-full">
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9 w-full"
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {data &&
                      data.map((data) => (
                        <CommandItem
                          value={data[formName]}
                          key={data.id}
                          onSelect={() => {
                            form.setValue(
                              name,
                              data.id as PathValue<TFieldValues, typeof name>
                            );

                            setOpen(false);
                          }}
                        >
                          {data[formName]}
                          <Check
                            className={cn(
                              "ml-auto",
                              data.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
