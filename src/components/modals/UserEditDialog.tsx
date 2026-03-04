import type { FC } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { ApiRole, User } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type UserEditValues = {
  firstName: string;
  lastName: string;
  email: string;
  role: ApiRole;
  enabled: boolean;
  brandId?: string | null;
};

type UserEditDialogProps = {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserEditValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

const EMPTY_VALUES: UserEditValues = {
  firstName: "",
  lastName: "",
  email: "",
  role: "STUDENT",
  enabled: true,
  brandId: ""
};

export const UserEditDialog: FC<UserEditDialogProps> = ({ user, open, onClose, onSubmit, isSubmitting }) => {
  const form = useForm<UserEditValues>({
    defaultValues: EMPTY_VALUES
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      role: user.role,
      enabled: user.enabled,
      brandId: user.brandId ?? ""
    });
  }, [form, user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : undefined)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...form.register("firstName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...form.register("lastName")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.watch("role")}
                onValueChange={(value) => form.setValue("role", value as ApiRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">STUDENT</SelectItem>
                  <SelectItem value="MODERATOR">MODERATOR</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandId">Brand ID (optional)</Label>
              <Input id="brandId" {...form.register("brandId")} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Enabled</p>
              <p className="text-xs text-muted-foreground">Allow this user to access the platform</p>
            </div>
            <Switch checked={form.watch("enabled")} onCheckedChange={(value) => form.setValue("enabled", value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
