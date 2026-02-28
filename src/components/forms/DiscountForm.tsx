import type { FC } from "react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { discountSchema } from "@/lib/validators/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Category, Company } from "@/types";
import { Switch } from "@/components/ui/switch";

type DiscountFormValues = z.infer<typeof discountSchema>;

type DiscountFormProps = {
  defaultValues?: Partial<DiscountFormValues>;
  categories: Category[];
  companies: Company[];
  onSubmit: (values: DiscountFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export const DiscountForm: FC<DiscountFormProps> = ({
  defaultValues,
  categories,
  companies,
  onSubmit,
  isSubmitting
}) => {
  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      title: "",
      description: "",
      promoCode: "",
      expiryDate: "",
      terms: "",
      usageSteps: "",
      verifiedOnly: false,
      categoryId: "",
      brandId: "",
      attachmentId: "",
      ...defaultValues
    }
  });

  const [title, description, promoCode, expiryDate, verifiedOnly] = useWatch({
    control: form.control,
    name: ["title", "description", "promoCode", "expiryDate", "verifiedOnly"]
  });

  const preview = useMemo(() => {
    return {
      title: title || "Discount Title",
      description: description || "Short description appears here.",
      value: promoCode || "—",
      status: verifiedOnly ? "Verified only" : "All students",
      expiry: expiryDate || "No expiry"
    };
  }, [title, description, promoCode, expiryDate, verifiedOnly]);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title ? (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...form.register("description")} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="promoCode">Promo Code</Label>
            <Input id="promoCode" {...form.register("promoCode")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input id="expiryDate" type="date" {...form.register("expiryDate")} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.watch("categoryId")} onValueChange={(value) => form.setValue("categoryId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Brand</Label>
            <Select value={form.watch("brandId")} onValueChange={(value) => form.setValue("brandId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="terms">Terms</Label>
          <Textarea id="terms" rows={3} {...form.register("terms")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="usageSteps">Usage Steps</Label>
          <Textarea id="usageSteps" rows={3} {...form.register("usageSteps")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attachmentId">Attachment ID</Label>
          <Input id="attachmentId" {...form.register("attachmentId")} />
        </div>
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">Verified Only</p>
            <p className="text-xs text-muted-foreground">Only verified students can use this deal</p>
          </div>
          <Switch checked={form.watch("verifiedOnly")} onCheckedChange={(value) => form.setValue("verifiedOnly", value)} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Discount"}
        </Button>
      </form>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="text-xs uppercase text-muted-foreground">Preview</div>
          <div>
            <p className="text-lg font-semibold">{preview.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{preview.description}</p>
          </div>
          <div className="text-3xl font-bold text-primary">{preview.value}</div>
          <div className="text-xs text-muted-foreground">Audience: {preview.status}</div>
          <div className="text-xs text-muted-foreground">Expiry: {preview.expiry}</div>
        </CardContent>
      </Card>
    </div>
  );
};
