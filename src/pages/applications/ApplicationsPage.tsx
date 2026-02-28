import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import { RequireRole } from "@/components/layout/AuthGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils/formatters";
import { useAllApplications } from "@/lib/api/hooks";
import type { Application } from "@/types";

export default function ApplicationsPage() {
  const [status, setStatus] = useState<"all" | "PENDING" | "ACCEPTED" | "REJECTED">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAllApplications({
    status: status === "all" ? undefined : status,
    search,
    page,
    pageSize: 10
  });

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Application ID",
        cell: ({ row }) => row.original.id
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.status === "ACCEPTED" ? "success" : row.original.status === "REJECTED" ? "destructive" : "warning"}>
            {row.original.status}
          </Badge>
        )
      },
      {
        accessorKey: "createdDate",
        header: "Submitted",
        cell: ({ row }) => formatDate(row.original.createdDate)
      },
      {
        accessorKey: "rejectionReason",
        header: "Rejection Reason",
        cell: ({ row }) => row.original.rejectionReason || "-"
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button asChild size="sm" variant="outline">
            <Link to={`/applications/${row.original.id}`}>Review</Link>
          </Button>
        )
      }
    ],
    []
  );

  return (
    <RequireRole allowed={["admin"]}>
      <div className="space-y-6">
        <PageHeader title="Student Applications" subtitle="Review and verify student status" />
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Search applications" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyTitle="No applications"
          emptyDescription="No applications found for the selected filters."
        />
        <DataTablePagination
          page={data?.page ?? 1}
          pageSize={data?.pageSize ?? 10}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
      </div>
    </RequireRole>
  );
}
