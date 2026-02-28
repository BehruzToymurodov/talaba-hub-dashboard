import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { RequireAuth } from "@/components/layout/AuthGate";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function AppShell({ children }: { children?: ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 space-y-6 p-4 lg:p-8">{children ?? <Outlet />}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
