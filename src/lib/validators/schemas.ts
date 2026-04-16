import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  icon: z.string().min(1),
  attachmentId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  active: z.boolean().default(true)
});

export const companySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  logoAttachmentId: z.string().optional().nullable(),
  active: z.boolean().default(true)
});

export const branchSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  phone: z.string().optional().nullable(),
  workingHours: z.string().optional().nullable(),
  active: z.boolean().default(true)
});

export const discountSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional().nullable(),
  promoCode: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  usageSteps: z.string().optional().nullable(),
  verifiedOnly: z.boolean().default(false),
  categoryId: z.string().min(1, "Select a category"),
  brandId: z.string().min(1),
  attachmentId: z.string().optional().nullable()
});

export const applicationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  middleName: z.string().optional().nullable(),
  universityEmail: z.string().email(),
  universityName: z.string().min(2),
  studentIdNumber: z.string().min(1),
  studyStartDate: z.string().min(1),
  studyEndDate: z.string().min(1),
  attachments: z
    .custom<FileList | null | undefined>((value) => value == null || value instanceof FileList, "Invalid files")
    .refine((value) => !!value && value.length > 0, "Attach at least one document")
});

export const domainSchema = z.object({
  domain: z.string().min(3),
  universityName: z.string().optional().nullable(),
  active: z.boolean().default(true)
});

export const universitySchema = z.object({
  name: z.string().min(2),
  active: z.boolean().default(true)
});
