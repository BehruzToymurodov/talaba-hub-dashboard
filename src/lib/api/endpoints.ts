export const ENDPOINTS = {
  auth: {
    login: "/v1/auth/login",
    register: "/v1/auth/register",
    verifyEmail: "/v1/auth/verify"
  },
  users: {
    list: "/v1/management/users",
    create: "/v1/management/users",
    update: (id: string) => `/v1/management/users/${id}`
  },
  categories: {
    list: "/v1/management/categories",
    create: "/v1/management/categories",
    update: (id: string) => `/v1/management/categories/${id}`,
    delete: (id: string) => `/v1/management/categories/${id}`,
    publicList: "/v1/categories",
    selectList: "/v1/categories/select"
  },
  brands: {
    list: "/v1/management/brands",
    create: "/v1/management/brands",
    update: (id: string) => `/v1/management/brands/${id}`,
    delete: (id: string) => `/v1/management/brands/${id}`,
    getById: (id: string) => `/v1/management/brands/${id}`
  },
  discounts: {
    list: "/v1/management/deals",
    create: "/v1/management/deals",
    update: (id: string) => `/v1/management/deals/${id}`,
    delete: (id: string) => `/v1/management/deals/${id}`,
    detail: (id: string) => `/v1/management/deals/${id}`,
    publicList: "/v1/deals",
    publicDetail: (id: string) => `/v1/deals/${id}`
  },
  applications: {
    myList: "/v1/student/applications/my",
    create: "/v1/student/applications",
    listAll: "/v1/management/applications",
    detail: (id: string) => `/v1/management/applications/${id}`,
    review: (id: string) => `/v1/management/applications/${id}/status`
  },
  domains: {
    list: "/v1/management/domains",
    create: "/v1/management/domains",
    update: (id: string) => `/v1/management/domains/${id}`,
    delete: (id: string) => `/v1/management/domains/${id}`,
    getById: (id: string) => `/v1/management/domains/${id}`
  },
  universities: {
    list: "/v1/management/universities",
    create: "/v1/management/universities",
    update: (id: string) => `/v1/management/universities/${id}`,
    delete: (id: string) => `/v1/management/universities/${id}`,
    getById: (id: string) => `/v1/management/universities/${id}`
  },
  attachments: {
    upload: "/v1/attachments",
    download: "/v1/attachments/get"
  }
};
