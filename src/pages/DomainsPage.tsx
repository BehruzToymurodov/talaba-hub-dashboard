import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { RequireRole } from "@/components/layout/AuthGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { DomainForm } from "@/components/forms/DomainForm";
import type { Domain } from "@/types";
import { useCreateDomain, useDeleteDomain, useDomains, useUpdateDomain } from "@/lib/api/hooks";
import { formatDate } from "@/lib/utils/formatters";

export default function DomainsPage() {
  const [page, setPage] = useState(1);
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useDomains({ page, pageSize: 10 });
  const createDomain = useCreateDomain();
  const updateDomain = useUpdateDomain();
  const deleteDomain = useDeleteDomain();

  const columns = useMemo<ColumnDef<Domain>[]>(
    () => [
      { accessorKey: "universityName", header: "University" },
      { accessorKey: "domain", header: "Domain" },
      {
        accessorKey: "active",
        header: "Enabled",
        cell: ({ row }) => (
          <Badge variant={row.original.active ? "success" : "warning"}>
            {row.original.active ? "Enabled" : "Disabled"}
          </Badge>
        )
      },
      {
        accessorKey: "createdDate",
        header: "Created",
        cell: ({ row }) => formatDate(row.original.createdDate)
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveDomain(row.original);
                setOpenForm(true);
              }}
            >
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setDeleteId(row.original.id)}>
              Delete
            </Button>
          </div>
        )
      }
    ],
    []
  );

  return (
    <RequireRole allowed={["admin"]}>
      <div className="space-y-6">
        <PageHeader
          title="Supported Domains"
          subtitle="Manage allowed student email domains"
          actionLabel="New Domain"
          onAction={() => {
            setActiveDomain(null);
            setOpenForm(true);
          }}
        />
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyTitle="No domains"
          emptyDescription="Add supported domains to enable verification."
          emptyActionLabel="Add Domain"
          onEmptyAction={() => {
            setActiveDomain(null);
            setOpenForm(true);
          }}
        />
        <DataTablePagination
          page={data?.page ?? 1}
          pageSize={data?.pageSize ?? 10}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{activeDomain ? "Edit Domain" : "New Domain"}</DialogTitle>
            </DialogHeader>
            <DomainForm
              defaultValues={
                activeDomain
                  ? {
                      domain: activeDomain.domain,
                      universityName: activeDomain.universityName ?? "",
                      active: activeDomain.active
                    }
                  : undefined
              }
              isSubmitting={createDomain.isPending || updateDomain.isPending}
              onSubmit={async (values) => {
                try {
                  if (activeDomain) {
                    await updateDomain.mutateAsync({ id: activeDomain.id, payload: values });
                    toast.success("Domain updated");
                  } else {
                    await createDomain.mutateAsync(values);
                    toast.success("Domain created");
                  }
                  setOpenForm(false);
                } catch {
                  toast.error("Failed to save domain");
                }
              }}
            />
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={!!deleteId}
          title="Delete domain?"
          description="This will remove the domain from supported list."
          confirmLabel="Delete"
          destructive
          isLoading={deleteDomain.isPending}
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            if (!deleteId) return;
            try {
              await deleteDomain.mutateAsync(deleteId);
              toast.success("Domain deleted");
            } catch {
              toast.error("Failed to delete domain");
            } finally {
              setDeleteId(null);
            }
          }}
        />
      </div>
    </RequireRole>
  );
}
