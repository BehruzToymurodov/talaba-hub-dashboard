import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { companySchema } from "@/lib/validators/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type CompanyFormValues = z.infer<typeof companySchema>;

type CompanyFormProps = {
  defaultValues?: Partial<CompanyFormValues>;
  onSubmit: (values: CompanyFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export const CompanyForm: FC<CompanyFormProps> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      logoAttachmentId: "",
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
      <div className="space-y-2">
        <Label htmlFor="logoAttachmentId">Logo Attachment ID</Label>
        <Input id="logoAttachmentId" {...form.register("logoAttachmentId")} />
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">Active</p>
          <p className="text-xs text-muted-foreground">Visible to users</p>
        </div>
        <Switch checked={form.watch("active")} onCheckedChange={(value) => form.setValue("active", value)} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Company"}
      </Button>
    </form>
  );
};
