import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth/AuthProvider";
import { RequireRole } from "@/components/layout/AuthGate";
import { useCompanies, useCreateCompany, useDeleteCompany, useUpdateCompany } from "@/lib/api/hooks";
import type { Company } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { CompanyForm } from "@/components/forms/CompanyForm";

export default function CompaniesPage() {
  const { role } = useAuth();
  const [page, setPage] = useState(1);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useCompanies({ page, pageSize: 10, scope: role === "moderator" ? "mine" : "all" });
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "website", header: "Website" },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.active ? "success" : "secondary"}>
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
        )
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
                setActiveCompany(row.original);
                setOpenForm(true);
              }}
            >
              Edit
            </Button>
            {role === "admin" ? (
              <Button size="sm" variant="destructive" onClick={() => setDeleteId(row.original.id)}>
                Delete
              </Button>
            ) : null}
          </div>
        )
      }
    ],
    [role]
  );

  return (
    <RequireRole allowed={["admin", "moderator"]}>
      <div className="space-y-6">
      <PageHeader
        title={role === "moderator" ? "My Company" : "Companies"}
        subtitle="Manage company profiles"
        actionLabel={role === "admin" ? "New Company" : undefined}
        onAction={
          role === "admin"
            ? () => {
                setActiveCompany(null);
                setOpenForm(true);
              }
            : undefined
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="No companies"
        emptyDescription="Add a company to start publishing discounts."
        emptyActionLabel={role === "admin" ? "Add Company" : undefined}
        onEmptyAction={
          role === "admin"
            ? () => {
                setActiveCompany(null);
                setOpenForm(true);
              }
            : undefined
        }
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
            <DialogTitle>{activeCompany ? "Edit Company" : "New Company"}</DialogTitle>
          </DialogHeader>
          <CompanyForm
            defaultValues={
              activeCompany
                ? {
                    name: activeCompany.name,
                    description: activeCompany.description ?? "",
                    active: activeCompany.active ?? true,
                    logoAttachmentId: activeCompany.logoAttachmentId ?? ""
                  }
                : undefined
            }
            isSubmitting={createCompany.isPending || updateCompany.isPending}
            onSubmit={async (values) => {
              try {
                if (activeCompany) {
                  await updateCompany.mutateAsync({ id: activeCompany.id, payload: values });
                  toast.success("Company updated");
                } else {
                  await createCompany.mutateAsync(values);
                  toast.success("Company created");
                }
                setOpenForm(false);
              } catch {
                toast.error("Failed to save company");
              }
            }}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        title="Delete company?"
        description="This will remove the company and its related discounts."
        confirmLabel="Delete"
        destructive
        isLoading={deleteCompany.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteCompany.mutateAsync(deleteId);
            toast.success("Company deleted");
          } catch {
            toast.error("Failed to delete company");
          } finally {
            setDeleteId(null);
          }
        }}
      />
      </div>
    </RequireRole>
  );
}
