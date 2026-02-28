import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import LoginPage from "@/pages/LoginPage";
import ForbiddenPage from "@/pages/ForbiddenPage";
import DashboardPage from "@/pages/DashboardPage";
import UsersPage from "@/pages/UsersPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CompaniesPage from "@/pages/CompaniesPage";
import DiscountsPage from "@/pages/DiscountsPage";
import AttachmentsPage from "@/pages/AttachmentsPage";
import ApplicationsPage from "@/pages/applications/ApplicationsPage";
import ApplicationDetailPage from "@/pages/applications/ApplicationDetailPage";
import MyApplicationsPage from "@/pages/applications/MyApplicationsPage";
import ApplyApplicationPage from "@/pages/applications/ApplyApplicationPage";
import DomainsPage from "@/pages/DomainsPage";
import SettingsPage from "@/pages/SettingsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/attachments" element={<AttachmentsPage />} />
        <Route path="/discounts" element={<DiscountsPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/applications/my" element={<MyApplicationsPage />} />
        <Route path="/applications/apply" element={<ApplyApplicationPage />} />
        <Route path="/applications/:id" element={<ApplicationDetailPage />} />
        <Route path="/domains" element={<DomainsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

export default function App() {
  return <RouterProvider router={router} />;
}
