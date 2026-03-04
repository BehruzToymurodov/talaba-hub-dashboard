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
import { UniversityForm } from "@/components/forms/UniversityForm";
import type { University } from "@/types";
import { useCreateUniversity, useDeleteUniversity, useUniversities, useUpdateUniversity } from "@/lib/api/hooks";
import { formatDateNumeric } from "@/lib/utils/formatters";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UniversitiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [activeUniversity, setActiveUniversity] = useState<University | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useUniversities({
    page,
    pageSize: 10,
    search: search || undefined,
    isActive: status === "all" ? undefined : status === "active"
  });
  const createUniversity = useCreateUniversity();
  const updateUniversity = useUpdateUniversity();
  const deleteUniversity = useDeleteUniversity();

  const columns = useMemo<ColumnDef<University>[]>(
    () => [
      { accessorKey: "name", header: "University" },
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
        accessorKey: "createdDate",
        header: "Created",
        cell: ({ row }) => formatDateNumeric(row.original.createdDate)
      },
      {
        accessorKey: "lastModifiedDate",
        header: "Updated",
        cell: ({ row }) => formatDateNumeric(row.original.lastModifiedDate)
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
                setActiveUniversity(row.original);
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
          title="Universities"
          subtitle="Manage university records"
          actionLabel="New University"
          onAction={() => {
            setActiveUniversity(null);
            setOpenForm(true);
          }}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Search universities" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyTitle="No universities"
          emptyDescription="Create your first university."
          emptyActionLabel="Create University"
          onEmptyAction={() => {
            setActiveUniversity(null);
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
              <DialogTitle>{activeUniversity ? "Edit University" : "New University"}</DialogTitle>
            </DialogHeader>
            <UniversityForm
              defaultValues={
                activeUniversity
                  ? {
                      name: activeUniversity.name,
                      active: activeUniversity.active
                    }
                  : undefined
              }
              isSubmitting={createUniversity.isPending || updateUniversity.isPending}
              onSubmit={async (values) => {
                try {
                  if (activeUniversity) {
                    await updateUniversity.mutateAsync({ id: activeUniversity.id, payload: values });
                    toast.success("University updated");
                  } else {
                    await createUniversity.mutateAsync(values);
                    toast.success("University created");
                  }
                  setOpenForm(false);
                } catch {
                  toast.error("Failed to save university");
                }
              }}
            />
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={!!deleteId}
          title="Delete university?"
          description="This will remove the university from the list."
          confirmLabel="Delete"
          destructive
          isLoading={deleteUniversity.isPending}
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            if (!deleteId) return;
            try {
              await deleteUniversity.mutateAsync(deleteId);
              toast.success("University deleted");
            } catch {
              toast.error("Failed to delete university");
            } finally {
              setDeleteId(null);
            }
          }}
        />
      </div>
    </RequireRole>
  );
}
