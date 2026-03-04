export type Role = "student" | "moderator" | "admin";
export type ApiRole = "STUDENT" | "MODERATOR" | "ADMIN";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: ApiRole;
  studentStatusVerified: boolean;
  enabled: boolean;
  createdDate: string;
  lastModifiedDate?: string | null;
  verifiedDate?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  active?: boolean;
  attachment?: BasicAttachment | null;
  attachmentId?: string | null;
  activeDealsCount?: number;
}

export interface Company {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  logoAttachmentId?: string | null;
  active?: boolean;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
}

export interface Discount {
  id: string;
  title: string;
  description?: string | null;
  promoCode?: string | null;
  expiryDate?: string | null;
  terms?: string | null;
  usageSteps?: string | null;
  verifiedOnly?: boolean;
  imageUrl?: string | null;
  brand?: BrandListing | null;
  category?: CategorySummary | null;
  categories?: CategorySummary[] | null;
  brandId?: string | null;
  categoryId?: string | null;
  categoryIds?: string[] | null;
  attachmentId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Application {
  id: string;
  user?: UserInfo | null;
  universityEmail?: string | null;
  emailSupportedDomain?: boolean | null;
  studyStartDate?: string | null;
  studyEndDate?: string | null;
  attachments?: string[] | null;
  status: ApplicationStatus;
  rejectionReason?: string | null;
  createdDate?: string | null;
}

export interface Domain {
  id: string;
  domain: string;
  universityName?: string | null;
  active: boolean;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
}

export interface University {
  id: string;
  name: string;
  active: boolean;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  fullName?: string | null;
  brandId?: string | null;
  isStudentStatusVerified?: boolean;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface BrandListing {
  id: string;
  name: string;
  logoUrl?: string | null;
  numberOfDeals?: number | null;
}

export interface CategorySummary {
  id: string;
  name: string;
}

export interface BasicAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  url: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PageableResponse<T> {
  size: number;
  page: number;
  totalPages: number;
  totalElements: number;
  content: T[];
}
