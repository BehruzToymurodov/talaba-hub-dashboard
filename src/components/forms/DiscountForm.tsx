import type { FC } from "react";
import { useEffect, useMemo } from "react";
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
import { AttachmentField } from "@/components/forms/AttachmentField";

type DiscountFormValues = z.infer<typeof discountSchema>;

type DiscountFormProps = {
  defaultValues?: Partial<DiscountFormValues>;
  categories: Category[];
  companies: Company[];
  onSubmit: (values: DiscountFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

const EMPTY_VALUES: DiscountFormValues = {
  title: "",
  description: "",
  promoCode: "",
  expiryDate: "",
  terms: "",
  usageSteps: "",
  verifiedOnly: false,
  categoryIds: [],
  brandId: "",
  attachmentId: ""
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
      ...EMPTY_VALUES,
      ...defaultValues
    }
  });

  useEffect(() => {
    form.register("categoryIds");
  }, [form]);

  useEffect(() => {
    form.reset({
      ...EMPTY_VALUES,
      ...defaultValues
    });
  }, [defaultValues, form]);

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

  const selectedCategoryIds = form.watch("categoryIds") ?? [];

  const toggleCategory = (id: string) => {
    const next = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((item) => item !== id)
      : [...selectedCategoryIds, id];
    form.setValue("categoryIds", next, { shouldValidate: true });
  };

  return (
    <div className="grid h-full min-h-0 gap-8 lg:grid-cols-[2fr,1fr]">
      <form
        className="h-full min-h-0 space-y-4 overflow-y-auto overflow-x-visible pr-6 pl-1"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="grid gap-2 md:grid-cols-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-muted-foreground"
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
                <span className="truncate">{category.name}</span>
              </label>
            ))}
          </div>
          {form.formState.errors.categoryIds ? (
            <p className="text-xs text-destructive">{form.formState.errors.categoryIds.message}</p>
          ) : null}
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
        <div className="space-y-2">
          <Label htmlFor="terms">Terms</Label>
          <Textarea id="terms" rows={3} {...form.register("terms")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="usageSteps">Usage Steps</Label>
          <Textarea id="usageSteps" rows={3} {...form.register("usageSteps")} />
        </div>
        <AttachmentField
          label="Deal Image"
          value={form.watch("attachmentId")}
          onChange={(value) => form.setValue("attachmentId", value)}
          helperText="Upload a promo image to generate the attachment ID."
        />
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

      <Card className="h-fit self-start">
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
