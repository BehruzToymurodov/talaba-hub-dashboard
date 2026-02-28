import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { RequireRole } from "@/components/layout/AuthGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatters";
import { useMyApplications } from "@/lib/api/hooks";
import type { Application } from "@/types";

export default function MyApplicationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyApplications({ page, pageSize: 10 });

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
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
      }
    ],
    []
  );

  return (
    <RequireRole allowed={["student"]}>
      <div className="space-y-6">
        <PageHeader title="My Applications" subtitle="Track your verification requests" />
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyTitle="No applications"
          emptyDescription="Submit an application to get verified."
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
