import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  icon: z.string().min(1),
  attachmentId: z.string().optional().nullable(),
  active: z.boolean().default(true)
});

export const companySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  logoAttachmentId: z.string().optional().nullable(),
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
  categoryId: z.string().min(1),
  brandId: z.string().min(1),
  attachmentId: z.string().optional().nullable()
});

export const applicationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  middleName: z.string().optional().nullable(),
  universityEmail: z.string().email(),
  studyStartDate: z.string().min(1),
  studyEndDate: z.string().min(1),
  attachments: z.any().optional()
});

export const domainSchema = z.object({
  domain: z.string().min(3),
  universityName: z.string().optional().nullable(),
  active: z.boolean().default(true)
});
