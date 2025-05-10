"use client";

import { useCustomer } from "@/app/hooks/use-company";
import { CustomerSchemaType } from "@/app/types/companies.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function CompanyTable() {
  const { data, isLoading, error } = useCustomer();
  const router = useRouter();
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error)
    return <div className="p-4 text-red-500">Error loading company data</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Company Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((company: CustomerSchemaType) => (
          <TableRow
            key={company.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push(`/soa/create/${company.id}`)}
          >
            <TableCell>{company.id}</TableCell>
            <TableCell> {company.name ? company.name : "-"}</TableCell>
            <TableCell>
              {company.company_name ? company.company_name : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
