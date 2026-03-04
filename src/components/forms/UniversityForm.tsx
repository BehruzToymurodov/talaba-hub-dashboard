import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { universitySchema } from "@/lib/validators/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type UniversityFormValues = z.infer<typeof universitySchema>;

type UniversityFormProps = {
  defaultValues?: Partial<UniversityFormValues>;
  onSubmit: (values: UniversityFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export const UniversityForm: FC<UniversityFormProps> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const form = useForm<UniversityFormValues>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      name: "",
      active: true,
      ...defaultValues
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">University Name</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">Active</p>
          <p className="text-xs text-muted-foreground">Visible to students</p>
        </div>
        <Switch checked={form.watch("active")} onCheckedChange={(value) => form.setValue("active", value)} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save University"}
      </Button>
    </form>
  );
};
