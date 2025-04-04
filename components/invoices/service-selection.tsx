"use client";

import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { useServices } from "@/app/hooks/use-services";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
export default function ServiceSelection({ form }) {
  const [open, setOpen] = useState(false);
  const { data: serviceOptions } = useServices();

  const removeService = (index: number) => {
    const services = form.getValues().services;
    form.setValue(
      "services",
      services.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="w-full  mx-auto p-4">
      {/* Display services table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[150px]">Service Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right w-[150px]">
                Amount (AED)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.watch("services").map((service, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`services.${index}.service_date`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? format(field.value, "yyyy-MM-dd")
                                : ""
                            }
                            onChange={(e) => {
                              field.onChange(new Date(e.target.value));
                            }}
                            className="w-full border-0 bg-transparent focus:outline-none focus:ring-0 p-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`services.${index}.service_name`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full border-0 bg-transparent focus:outline-none focus:ring-0 p-0"
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="text-right flex items-center justify-end gap-2">
                  <FormField
                    control={form.control}
                    name={`services.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24 text-right border-0 bg-transparent focus:outline-none focus:ring-0 p-0"
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} className="font-medium">
                Equivalent:
              </TableCell>
              <TableCell className="text-right font-bold">
                {form
                  .watch("services")
                  .reduce((total, service) => total + (service.amount || 0), 0)
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full border border-dashed border-gray-500"
            >
              <Plus />
              Add Service
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Select Services</SheetTitle>
              <SheetDescription>
                Choose from the available services below.
              </SheetDescription>
            </SheetHeader>

            <FormField
              control={form.control}
              name="service_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Invoice Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-ful pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="py-4">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount (AED)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceOptions &&
                    serviceOptions.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <Checkbox
                            id={`service-${service.id}`}
                            checked={form
                              .watch("services")
                              .some((s) => s.id === service.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Add the service if it doesn't exist
                                const selectedDate =
                                  form.getValues().service_date; // Get the selected sheet date

                                if (
                                  !form
                                    .watch("services")
                                    .some((s) => s.id === service.id)
                                ) {
                                  const services = form.getValues().services;

                                  form.setValue("services", [
                                    ...services,
                                    {
                                      id: service.id,
                                      invoice_id: "",
                                      service_date: selectedDate || new Date(), // Use sheet date or default to today
                                      service_name: service.name,
                                      amount: service.amount,
                                    },
                                  ]);
                                }
                              } else {
                                // Remove the service if it exists
                                const services = form.getValues().services;
                                form.setValue(
                                  "services",
                                  services.filter((s) => s.id !== service.id)
                                );
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <label
                            htmlFor={`service-${service.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {service.name}
                          </label>
                        </TableCell>
                        <TableCell className="text-right">
                          {service.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <SheetFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
