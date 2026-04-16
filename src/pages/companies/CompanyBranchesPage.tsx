import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { RequireRole } from "@/components/layout/AuthGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { BranchForm } from "@/components/forms/BranchForm";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBranches, useCompany, useCreateBranch, useDeleteBranch, useUpdateBranch } from "@/lib/api/hooks";
import type { Branch } from "@/types";

export default function CompanyBranchesPage() {
  const { companyId = "" } = useParams();
  const [page, setPage] = useState(1);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: company } = useCompany(companyId);
  const { data, isLoading } = useBranches(companyId, { page, pageSize: 10 });
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const deleteBranch = useDeleteBranch();

  const columns = useMemo<ColumnDef<Branch>[]>(
    () => [
      { accessorKey: "name", header: "Branch" },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => row.original.address || "-"
      },
      {
        id: "coordinates",
        header: "Coordinates",
        cell: ({ row }) => `${row.original.latitude.toFixed(5)}, ${row.original.longitude.toFixed(5)}`
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => row.original.phone || "-"
      },
      {
        accessorKey: "workingHours",
        header: "Working Hours",
        cell: ({ row }) => row.original.workingHours || "-"
      },
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
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveBranch(row.original);
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
    <RequireRole allowed={["admin", "moderator"]}>
      <div className="space-y-6">
        <div className="flex justify-start">
          <Button asChild variant="outline">
            <Link to="/companies">Back to Companies</Link>
          </Button>
        </div>
        <PageHeader
          title={`${company?.name ?? "Company"} Branches`}
          subtitle="Manage branch locations, contacts, and coordinates"
          actionLabel="New Branch"
          onAction={() => {
            setActiveBranch(null);
            setOpenForm(true);
          }}
        />
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyTitle="No branches"
          emptyDescription="Add the first branch for this company."
          emptyActionLabel="Create Branch"
          onEmptyAction={() => {
            setActiveBranch(null);
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
              <DialogTitle>{activeBranch ? "Edit Branch" : "New Branch"}</DialogTitle>
            </DialogHeader>
            <BranchForm
              defaultValues={
                activeBranch
                  ? {
                      name: activeBranch.name,
                      address: activeBranch.address ?? "",
                      latitude: activeBranch.latitude,
                      longitude: activeBranch.longitude,
                      phone: activeBranch.phone ?? "",
                      workingHours: activeBranch.workingHours ?? "",
                      active: activeBranch.active
                    }
                  : undefined
              }
              isSubmitting={createBranch.isPending || updateBranch.isPending}
              onSubmit={async (values) => {
                try {
                  if (activeBranch) {
                    await updateBranch.mutateAsync({
                      brandId: companyId,
                      branchId: activeBranch.id,
                      payload: values
                    });
                    toast.success("Branch updated");
                  } else {
                    await createBranch.mutateAsync({ brandId: companyId, payload: values });
                    toast.success("Branch created");
                  }
                  setOpenForm(false);
                } catch {
                  toast.error("Failed to save branch");
                }
              }}
            />
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={!!deleteId}
          title="Delete branch?"
          description="This removes the branch from the company."
          confirmLabel="Delete"
          destructive
          isLoading={deleteBranch.isPending}
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            if (!deleteId) return;
            try {
              await deleteBranch.mutateAsync({ brandId: companyId, branchId: deleteId });
              toast.success("Branch deleted");
            } catch {
              toast.error("Failed to delete branch");
            } finally {
              setDeleteId(null);
            }
          }}
        />
      </div>
    </RequireRole>
  );
}
