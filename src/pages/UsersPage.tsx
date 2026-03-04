import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { RequireRole } from "@/components/layout/AuthGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserDetailsDialog } from "@/components/modals/UserDetailsDialog";
import { UserEditDialog } from "@/components/modals/UserEditDialog";
import { formatDateNumeric } from "@/lib/utils/formatters";
import { useUpdateUser, useUpdateUserEnabled, useUsers } from "@/lib/api/hooks";
import type { User } from "@/types";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"verified" | "unverified" | "all">("all");
  const [enabled, setEnabled] = useState<"all" | "true" | "false">("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data, isLoading } = useUsers({
    search,
    page,
    pageSize: 10
  });

  const updateEnabled = useUpdateUserEnabled();
  const updateUser = useUpdateUser();

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.role}</Badge>
        )
      },
      {
        accessorKey: "studentStatusVerified",
        header: "Verified",
        cell: ({ row }) => (
          <Badge variant={row.original.studentStatusVerified ? "success" : "warning"}>
            {row.original.studentStatusVerified ? "Verified" : "Unverified"}
          </Badge>
        )
      },
      {
        accessorKey: "enabled",
        header: "Enabled",
        cell: ({ row }) => (
          <Badge variant={row.original.enabled ? "success" : "destructive"}>
            {row.original.enabled ? "Enabled" : "Disabled"}
          </Badge>
        )
      },
      {
        accessorKey: "createdDate",
        header: "Created",
        cell: ({ row }) => formatDateNumeric(row.original.createdDate)
      },
      {
        accessorKey: "verifiedDate",
        header: "Verified Date",
        cell: ({ row }) => formatDateNumeric(row.original.verifiedDate)
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedUser(row.original)}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingUser(row.original)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant={row.original.enabled ? "destructive" : "default"}
              onClick={async () => {
                try {
                  await updateEnabled.mutateAsync({ user: row.original, enabled: !row.original.enabled });
                  toast.success("User updated");
                } catch {
                  toast.error("Failed to update user");
                }
              }}
            >
              {row.original.enabled ? "Disable" : "Enable"}
            </Button>
          </div>
        )
      }
    ],
    [updateEnabled]
  );

  return (
    <RequireRole allowed={["admin"]}>
      <div className="space-y-6">
        <PageHeader title="Users" subtitle="Manage platform users" />
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Search by name or email" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
          <Select value={enabled} onValueChange={(value) => setEnabled(value as typeof enabled)}>
            <SelectTrigger>
              <SelectValue placeholder="Enabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              <SelectItem value="true">Enabled</SelectItem>
              <SelectItem value="false">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={columns}
          data={
            (data?.data ?? []).filter((user) => {
              if (status !== "all" && user.studentStatusVerified !== (status === "verified")) return false;
              if (enabled !== "all" && user.enabled !== (enabled === "true")) return false;
              return true;
            })
          }
          isLoading={isLoading}
          emptyTitle="No users"
          emptyDescription="No users match your filters."
        />
        <DataTablePagination
          page={data?.page ?? 1}
          pageSize={data?.pageSize ?? 10}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
        <UserDetailsDialog user={selectedUser} open={!!selectedUser} onClose={() => setSelectedUser(null)} />
        <UserEditDialog
          user={editingUser}
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
          isSubmitting={updateUser.isPending}
          onSubmit={async (values) => {
            if (!editingUser) return;
            try {
              await updateUser.mutateAsync({ id: editingUser.id, payload: values });
              toast.success("User updated");
              setEditingUser(null);
            } catch {
              toast.error("Failed to update user");
            }
          }}
        />
      </div>
    </RequireRole>
  );
}
