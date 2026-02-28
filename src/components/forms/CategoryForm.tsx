import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { categorySchema } from "@/lib/validators/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Category } from "@/types";
import { z } from "zod";

type CategoryFormValues = z.infer<typeof categorySchema>;

type CategoryFormProps = {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export const CategoryForm: FC<CategoryFormProps> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      attachmentId: "",
      active: true,
      ...defaultValues
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...form.register("description")} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" placeholder="icon-name" {...form.register("icon")} />
          {form.formState.errors.icon ? (
            <p className="text-xs text-destructive">{form.formState.errors.icon.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="attachmentId">Attachment ID</Label>
          <Input id="attachmentId" {...form.register("attachmentId")} />
        </div>
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">Active</p>
          <p className="text-xs text-muted-foreground">Visible to users</p>
        </div>
        <Switch checked={form.watch("active")} onCheckedChange={(value) => form.setValue("active", value)} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Category"}
      </Button>
    </form>
  );
};
