import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { domainSchema } from "@/lib/validators/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const formSchema = domainSchema;

type DomainFormValues = z.infer<typeof formSchema>;

type DomainFormProps = {
  defaultValues?: Partial<DomainFormValues>;
  onSubmit: (values: DomainFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export const DomainForm: FC<DomainFormProps> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const form = useForm<DomainFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      universityName: "",
      active: true,
      ...defaultValues
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="universityName">University Name</Label>
        <Input id="universityName" {...form.register("universityName")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Input id="domain" placeholder="edu.uz" {...form.register("domain")} />
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">Enabled</p>
          <p className="text-xs text-muted-foreground">Allow this domain for verification</p>
        </div>
        <Switch checked={form.watch("active")} onCheckedChange={(value) => form.setValue("active", value)} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Domain"}
      </Button>
    </form>
  );
};
