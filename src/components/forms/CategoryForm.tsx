import type { FC } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { categorySchema } from "@/lib/validators/schemas";
import { AttachmentField } from "@/components/forms/AttachmentField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import type { Category } from "@/types";

type CategoryFormValues = z.infer<typeof categorySchema>;

type CategoryFormProps = {
  defaultValues?: Partial<CategoryFormValues>;
  parentOptions?: Category[];
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

const ROOT_VALUE = "__root__";

export const CategoryForm: FC<CategoryFormProps> = ({ defaultValues, parentOptions = [], onSubmit, isSubmitting }) => {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      attachmentId: undefined,
      parentId: undefined,
      active: true,
      ...defaultValues
    }
  });

  useEffect(() => {
    form.reset({
      name: "",
      description: "",
      icon: "",
      attachmentId: undefined,
      parentId: undefined,
      active: true,
      ...defaultValues
    });
  }, [defaultValues, form]);

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
        <Label htmlFor="icon">Icon</Label>
        <Input id="icon" placeholder="icon-name" {...form.register("icon")} />
        {form.formState.errors.icon ? (
          <p className="text-xs text-destructive">{form.formState.errors.icon.message}</p>
        ) : null}
      </div>
      <AttachmentField
        label="Banner Image"
        value={form.watch("attachmentId")}
        onChange={(value) => form.setValue("attachmentId", value)}
        helperText="Upload the category banner image to populate attachmentId automatically."
        privacyDefault="PRIVATE"
      />
      <div className="space-y-2">
        <Label>Parent Category</Label>
        <Select
          value={form.watch("parentId") ?? ROOT_VALUE}
          onValueChange={(value) => form.setValue("parentId", value === ROOT_VALUE ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ROOT_VALUE}>Top-level category</SelectItem>
            {parentOptions.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Leave this as top-level for main groups like Food or Electronics.
        </p>
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
