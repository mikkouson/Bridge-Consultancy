"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

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

// Define the payment option type
interface PaymentOption {
  id: number;
  bank_name: string;
  account_name: string;
  iban: string;
  swift_code: string;
  bank_address: string;
  currency: string;
  deleted_at: null | string;
}

interface PaymentOptionsSelectProps {
  data: PaymentOption[];
  form: UseFormReturn<any>;
  name: string;
  onValueChange?: (value: string) => void;
}

export function PaymentOptionsSelect({
  data,
  form,
  name,
  onValueChange,
}: PaymentOptionsSelectProps) {
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
                    ? `${
                        data?.find((option) => option.id === field.value)
                          ?.bank_name
                      } (${
                        data?.find((option) => option.id === field.value)
                          ?.currency
                      })`
                    : "Select payment option"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search payment options..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No payment options found.</CommandEmpty>
                  <CommandGroup>
                    {data?.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={`${option.bank_name} ${option.currency}`}
                        onSelect={() => {
                          form.setValue(name, option.id);
                          if (onValueChange) {
                            onValueChange(option.id.toString());
                          }
                          setOpen(false);
                        }}
                        className="flex flex-col items-start py-3"
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="font-medium">
                            {option.bank_name}
                          </span>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              option.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </div>
                        <div className="mt-1 flex w-full items-center justify-between text-sm text-muted-foreground">
                          <span>{option.account_name}</span>
                          <span className="font-medium text-primary">
                            {option.currency}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          IBAN: {option.iban}
                        </div>
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
