import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { RequireRole } from "@/components/layout/AuthGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { CategoryForm } from "@/components/forms/CategoryForm";
import type { Category } from "@/types";
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/lib/api/hooks";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useCategories({ page, pageSize: 10 });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "active",
        header: "Active",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.active ? "Yes" : "No"}</span>
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
                setActiveCategory(row.original);
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
          title="Categories"
          subtitle="Create and manage discount categories"
          actionLabel="New Category"
          onAction={() => {
            setActiveCategory(null);
            setOpenForm(true);
          }}
        />
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyTitle="No categories"
          emptyDescription="Create your first category to organize discounts."
          emptyActionLabel="Create Category"
          onEmptyAction={() => {
            setActiveCategory(null);
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
              <DialogTitle>{activeCategory ? "Edit Category" : "New Category"}</DialogTitle>
            </DialogHeader>
            <CategoryForm
              defaultValues={
                activeCategory
                  ? {
                      name: activeCategory.name,
                      description: activeCategory.description ?? "",
                      icon: activeCategory.icon ?? "",
                      active: activeCategory.active ?? true,
                      attachmentId: activeCategory.attachment?.id ?? ""
                    }
                  : undefined
              }
              isSubmitting={createCategory.isPending || updateCategory.isPending}
              onSubmit={async (values) => {
                try {
                  if (activeCategory) {
                    await updateCategory.mutateAsync({ id: activeCategory.id, payload: values });
                    toast.success("Category updated");
                  } else {
                    await createCategory.mutateAsync(values);
                    toast.success("Category created");
                  }
                  setOpenForm(false);
                } catch {
                  toast.error("Failed to save category");
                }
              }}
            />
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          open={!!deleteId}
          title="Delete category?"
          description="This will remove the category from the list. Soft delete will be used if the API supports it."
          confirmLabel="Delete"
          destructive
          isLoading={deleteCategory.isPending}
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            if (!deleteId) return;
            try {
              await deleteCategory.mutateAsync(deleteId);
              toast.success("Category deleted");
            } catch {
              toast.error("Failed to delete category");
            } finally {
              setDeleteId(null);
            }
          }}
        />
      </div>
    </RequireRole>
  );
}
