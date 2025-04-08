"use client";

import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";

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
import { UseFormReturn } from "react-hook-form";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
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

  const handleClick = () => {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Set or update the 'sheet' parameter
    currentUrl.searchParams.set("sheet", "open");

    // Navigate to the updated URL
    router.push(currentUrl.search);
  };
  const removeService = (index: number) => {
    const services = form.getValues().services || [];
    const updatedServices = services.filter((_, i) => i !== index);
    form.setValue("services", updatedServices);

    const totalAmount = updatedServices.reduce((total, service) => {
      return total + (service.amount || 0);
    }, 0);

    form.setValue("amount", totalAmount);
  };
  const filteredServices = (serviceOptions || []).filter(
    (service: { name: string }) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="w-full  mx-auto p-4">
      {/* Display services table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[150px]">Service Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Vatable</TableHead>
              <TableHead>Vat Amount</TableHead>

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

                                  const currentService = form.getValues(
                                    `services.${index}`
                                  );
                                  const updatedVatAmount = checked
                                    ? (currentService.amount ?? 0) * 0.05
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

                                  const totalVat = updatedServices.reduce(
                                    (total, s) =>
                                      total + (s.service_vat_amount ?? 0),
                                    0
                                  );
                                  form.setValue("total_vat_amount", totalVat);
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
                <TableCell className="text-left ">
                  <FormField
                    control={form.control}
                    name={`services.${index}.service_vat_amount`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Label className="w-full border-0 bg-transparent p-0">
                            {field.value.toFixed(2)}
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
                    <TableHead className="text-right">VAT AMOUNT</TableHead>
                    <TableHead className="text-right">AMOUNT (AED)</TableHead>
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
                                const updateService = updatedServices.reduce(
                                  (total, s) => total + (s.amount || 0),
                                  0
                                );
                                form.setValue("amount", updateService);
                              }
                            } else {
                              const updatedServices = services.filter(
                                (s) => s.service_id !== service.id
                              );
                              form.setValue("services", updatedServices);
                              const updateService = updatedServices.reduce(
                                (total, s) => total + (s.amount || 0),
                                0
                              );
                              form.setValue("amount", updateService);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell className="text-right">
                        {(service.amount * 0.05).toFixed(2)}
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
