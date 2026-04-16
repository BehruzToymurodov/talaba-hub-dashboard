import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { applicationSchema } from "@/lib/validators/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = applicationSchema;

type ApplicationFormValues = z.infer<typeof formSchema>;

type ApplicationFormProps = {
  defaultValues?: Partial<ApplicationFormValues>;
  onSubmit: (values: ApplicationFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export const ApplicationForm: FC<ApplicationFormProps> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      universityEmail: "",
      universityName: "",
      studentIdNumber: "",
      studyStartDate: "",
      studyEndDate: "",
      attachments: undefined,
      ...defaultValues
    }
  });

  return (
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
        <Label htmlFor="middleName">Middle Name (optional)</Label>
        <Input id="middleName" {...form.register("middleName")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="universityEmail">University Email</Label>
        <Input id="universityEmail" type="email" {...form.register("universityEmail")} />
        {form.formState.errors.universityEmail ? (
          <p className="text-xs text-destructive">{form.formState.errors.universityEmail.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="universityName">University Name</Label>
          <Input id="universityName" {...form.register("universityName")} />
          {form.formState.errors.universityName ? (
            <p className="text-xs text-destructive">{form.formState.errors.universityName.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentIdNumber">Student ID Number</Label>
          <Input id="studentIdNumber" {...form.register("studentIdNumber")} />
          {form.formState.errors.studentIdNumber ? (
            <p className="text-xs text-destructive">{form.formState.errors.studentIdNumber.message}</p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studyStartDate">Study Start Date</Label>
          <Input id="studyStartDate" type="date" {...form.register("studyStartDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studyEndDate">Study End Date</Label>
          <Input id="studyEndDate" type="date" {...form.register("studyEndDate")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments</Label>
        <Input id="attachments" type="file" multiple {...form.register("attachments")} />
        {form.formState.errors.attachments ? (
          <p className="text-xs text-destructive">{form.formState.errors.attachments.message as string}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Upload student ID or enrollment proof.</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
};
