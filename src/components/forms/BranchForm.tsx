import type { FC } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { branchSchema } from "@/lib/validators/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type BranchFormValues = z.infer<typeof branchSchema>;

type BranchFormProps = {
  defaultValues?: Partial<BranchFormValues>;
  onSubmit: (values: BranchFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

const EMPTY_VALUES: BranchFormValues = {
  name: "",
  address: "",
  latitude: 41.311081,
  longitude: 69.240562,
  phone: "",
  workingHours: "",
  active: true
};

export const BranchForm: FC<BranchFormProps> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      ...EMPTY_VALUES,
      ...defaultValues
    }
  });

  useEffect(() => {
    form.reset({
      ...EMPTY_VALUES,
      ...defaultValues
    });
  }, [defaultValues, form]);

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="branch-name">Branch Name</Label>
        <Input id="branch-name" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="branch-address">Address</Label>
        <Textarea id="branch-address" rows={3} {...form.register("address")} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="branch-latitude">Latitude</Label>
          <Input id="branch-latitude" type="number" step="any" {...form.register("latitude")} />
          {form.formState.errors.latitude ? (
            <p className="text-xs text-destructive">{form.formState.errors.latitude.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch-longitude">Longitude</Label>
          <Input id="branch-longitude" type="number" step="any" {...form.register("longitude")} />
          {form.formState.errors.longitude ? (
            <p className="text-xs text-destructive">{form.formState.errors.longitude.message}</p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="branch-phone">Phone</Label>
          <Input id="branch-phone" {...form.register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch-hours">Working Hours</Label>
          <Input id="branch-hours" placeholder="09:00 - 18:00" {...form.register("workingHours")} />
        </div>
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">Active</p>
          <p className="text-xs text-muted-foreground">Show this branch in listings</p>
        </div>
        <Switch checked={form.watch("active")} onCheckedChange={(value) => form.setValue("active", value)} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Branch"}
      </Button>
    </form>
  );
};
