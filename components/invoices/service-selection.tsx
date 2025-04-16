"use client";

import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useServices } from "@/app/hooks/use-services";
import { InvoicesSchemaType } from "@/app/types/invoices.type";
import { ServicesSchemaType } from "@/app/types/services.type";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

export default function ServiceSelection({
  form,
}: {
  form: UseFormReturn<InvoicesSchemaType>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const { data: serviceOptions } = useServices();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const currr = form.watch("exchange_rate");
  const selectedCurrency = form.watch("currency");
  const currency = Number(currr.toFixed(2));
  const services = form.watch("services") || [];

  // Update total when services or currency changes
  useEffect(() => {
    if (services && services.length > 0) {
      services.map((service, index) => {
        const isVatOn = service.service_vat;
        const amount = service.amount || 0;
        const vatAmount = isVatOn ? amount * currency * 0.05 : 0;
        // Update the field for each service
        form.setValue(`services.${index}.service_vat_amount`, vatAmount);
        return service;
      });
    }
  }, [services, currency, form]);

  const handleClick = () => {
    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Set or update the 'sheet' parameter
    currentUrl.searchParams.set("sheet", "open");
    // Navigate to the updated URL
    router.push(currentUrl.search);
  };

  const filteredServices = (serviceOptions || []).filter(
    (service: { name: string }) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full mx-auto p-4">
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[150px]">Service Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Vatable</TableHead>
              <TableHead>Vat Amount ({selectedCurrency})</TableHead>
              <TableHead className="text-right w-[150px]">
                Amount ({selectedCurrency})
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, index: number) => (
              <TableRow key={service.service_id}>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`services.${index}.service_date`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
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
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`services.${index}.service_name`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Label className="w-full border-0 bg-transparent p-0">
                            {field.value}
                          </Label>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`services.${index}.service_vat`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <div className="space-y-0.5"></div>
                        <FormControl>
                          <div>
                            <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                              <Switch
                                id={id}
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  const exchange_rate =
                                    form.getValues("exchange_rate");
                                  const currentService = form.getValues(
                                    `services.${index}`
                                  );
                                  const convert =
                                    Number(exchange_rate.toFixed(2)) *
                                    (currentService.amount ?? 0);
                                  const updatedVatAmount = checked
                                    ? (convert ?? 0) * 0.05
                                    : 0;
                                  form.setValue(
                                    `services.${index}.service_vat_amount`,
                                    updatedVatAmount
                                  );
                                  const updatedServices = form
                                    .getValues("services")
                                    .map((s, i) =>
                                      i === index
                                        ? {
                                            ...s,
                                            service_vat: checked,
                                            service_vat_amount:
                                              updatedVatAmount,
                                          }
                                        : s
                                    );
                                  form.setValue("services", updatedServices);
                                }}
                                className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto rounded-md [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
                              />
                              <span className="min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
                                <span className="text-[10px] font-medium uppercase">
                                  Off
                                </span>
                              </span>
                              <span className="min-w-78flex peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
                                <span className="text-[10px] font-medium uppercase">
                                  On
                                </span>
                              </span>
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="text-left">
                  <FormField
                    control={form.control}
                    name={`services.${index}.service_vat_amount`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Label className="w-full border-0 bg-transparent p-0">
                            {typeof field.value === "number"
                              ? field.value.toFixed(2)
                              : "0.00"}
                          </Label>
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
                    render={({ field }) => {
                      const currencyValue = Number(currency || 1);
                      const currency_amount =
                        (field.value ?? 0) * currencyValue;
                      return (
                        <FormItem className="space-y-0">
                          <div className="flex items-center gap-2">
                            <span>{Number(currency_amount).toFixed(2)}</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...services];
                      updated.splice(index, 1);
                      form.setValue("services", updated);
                    }}
                    className="text-red-500 hover:underline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
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
              <Plus /> Add Service
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md overflow-auto">
            <SheetHeader>
              <SheetTitle>Select Services</SheetTitle>
              <SheetDescription>
                Choose from the available services below.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-5">
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <Button onClick={handleClick} className="shrink-0">
                  Create new service
                </Button>
              </div>
              <Separator className="my-4" />
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="w-[10px]"></TableHead>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead className="text-right">
                      VAT AMOUNT ({selectedCurrency})
                    </TableHead>
                    <TableHead className="text-right">
                      AMOUNT ({selectedCurrency})
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service: ServicesSchemaType) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={form
                            .watch("services")
                            .some((s) => s.service_id === service.id)}
                          onCheckedChange={(checked) => {
                            const services = form.getValues().services || [];
                            if (checked) {
                              if (
                                !services.some(
                                  (s) => s.service_id === service.id
                                )
                              ) {
                                const updatedServices = [
                                  ...services,
                                  {
                                    service_id: service.id,
                                    service_date: new Date(),
                                    service_name: service.name,
                                    amount: service.amount,
                                    service_vat: false,
                                    service_vat_amount: 0,
                                  },
                                ];
                                form.setValue("services", updatedServices);
                                // Total amount will be updated by useEffect
                              }
                            } else {
                              const updatedServices = services.filter(
                                (s) => s.service_id !== service.id
                              );
                              form.setValue("services", updatedServices);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell className="text-right">
                        {(
                          service.amount *
                          0.05 *
                          Number(currency || 1)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(service.amount * Number(currency || 1)).toFixed(2)}
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
