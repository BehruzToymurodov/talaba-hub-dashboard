import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth/AuthProvider";
import {
  useCategories,
  useCompanies,
  useCreateDiscount,
  useDeleteDiscount,
  useDiscount,
  useDiscounts,
  useUpdateDiscount
} from "@/lib/api/hooks";
import type { Discount } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { DiscountForm } from "@/components/forms/DiscountForm";
import { formatDate } from "@/lib/utils/formatters";

export default function DiscountsPage() {
  const { role, user } = useAuth();
  const [page, setPage] = useState(1);
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useDiscounts({
    page,
    pageSize: 10,
    brandId: role === "moderator" ? user?.brandId ?? undefined : undefined,
    publicOnly: role === "student"
  });
  const { data: categoriesData } = useCategories({ page: 1, pageSize: 50 });
  const { data: companiesData } = useCompanies({ page: 1, pageSize: 50, scope: role === "moderator" ? "mine" : "all" });
  const { data: discountDetail, isLoading: isDiscountLoading } = useDiscount(
    activeDiscount?.id,
    openForm && !!activeDiscount?.id
  );

  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();
  const deleteDiscount = useDeleteDiscount();
  const columns = useMemo<ColumnDef<Discount>[]>(() => {
    const base: ColumnDef<Discount>[] = [
      { accessorKey: "title", header: "Title" },
      {
        id: "brand",
        header: "Brand",
        cell: ({ row }) => row.original.brand?.name ?? "-"
      },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => {
          const names = row.original.categories?.map((category) => category.name).filter(Boolean) ?? [];
          if (names.length) return names.join(", ");
          return row.original.category?.name ?? "-";
        }
      },
      {
        id: "expiryDate",
        header: "Expiry",
        cell: ({ row }) => formatDate(row.original.expiryDate)
      },
      {
        id: "verifiedOnly",
        header: "Audience",
        cell: ({ row }) => (
          <Badge variant={row.original.verifiedOnly ? "secondary" : "success"}>
            {row.original.verifiedOnly ? "Verified only" : "All students"}
          </Badge>
        )
      }
    ];

    if (role === "student") return base;

    return [
      ...base,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {(role === "admin" || role === "moderator") && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setActiveDiscount(row.original);
                  setOpenForm(true);
                }}
              >
                Edit
              </Button>
            )}
            {role === "admin" ? (
              <Button size="sm" variant="destructive" onClick={() => setDeleteId(row.original.id)}>
                Delete
              </Button>
            ) : null}
          </div>
        )
      }
    ];
  }, [role]);

  const canEdit = role === "admin" || role === "moderator";

  return (
    <div className="space-y-6">
      <PageHeader
        title={role === "student" ? "My Discounts" : "Discounts"}
        subtitle="Manage discount announcements"
        actionLabel={canEdit ? "New Discount" : undefined}
        onAction={
          canEdit
            ? () => {
                setActiveDiscount(null);
                setOpenForm(true);
              }
            : undefined
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle={role === "student" ? "No discounts" : "No discounts created"}
        emptyDescription={role === "student" ? "Check back later for new offers." : "Create your first discount to start."}
        emptyActionLabel={canEdit ? "Create Discount" : undefined}
        onEmptyAction={
          canEdit
            ? () => {
                setActiveDiscount(null);
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
        <DialogContent className="h-[calc(100vh-96px)] w-full max-w-4xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>{activeDiscount ? "Edit Discount" : "New Discount"}</DialogTitle>
          </DialogHeader>
          <DiscountForm
            defaultValues={
              activeDiscount
                ? (() => {
                    const source = discountDetail ?? activeDiscount;
                    return {
                      title: source.title,
                      description: source.description ?? "",
                      promoCode: source.promoCode ?? "",
                      expiryDate: source.expiryDate ? source.expiryDate.split("T")[0] : "",
                      terms: source.terms ?? "",
                      usageSteps: source.usageSteps ?? "",
                      verifiedOnly: source.verifiedOnly ?? false,
                      categoryIds:
                        source.categories?.map((category) => category.id) ??
                        source.categoryIds ??
                        (source.category?.id ? [source.category.id] : []),
                      brandId: source.brand?.id ?? "",
                      attachmentId: source.attachmentId ?? ""
                    };
                  })()
                : undefined
            }
            categories={categoriesData?.data ?? []}
            companies={companiesData?.data ?? []}
            isSubmitting={createDiscount.isPending || updateDiscount.isPending || isDiscountLoading}
            onSubmit={async (values) => {
              try {
                if (activeDiscount) {
                  await updateDiscount.mutateAsync({ id: activeDiscount.id, payload: values });
                  toast.success("Discount updated");
                } else {
                  await createDiscount.mutateAsync(values);
                  toast.success("Discount created");
                }
                setOpenForm(false);
              } catch {
                toast.error("Failed to save discount");
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete discount?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        isLoading={deleteDiscount.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteDiscount.mutateAsync(deleteId);
            toast.success("Discount deleted");
          } catch {
            toast.error("Failed to delete discount");
          } finally {
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
