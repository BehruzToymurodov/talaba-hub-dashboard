import type { FC } from "react";
import { NavLink } from "react-router-dom";

import { NAV_ITEMS } from "@/components/layout/nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthProvider";
import logo from "@/assets/talabahub.png";

export const Sidebar: FC = () => {
  const { role } = useAuth();

  const items = NAV_ITEMS.filter((item) => (role ? item.roles.includes(role) : false));

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card p-6 lg:flex">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
          <img src={logo} alt="TalabaHub logo" className="h-10 w-10 object-contain" />
        </div>
        <div>
          <p className="text-sm font-semibold">TalabaHub</p>
          <p className="text-xs text-muted-foreground">Admin Console</p>
        </div>
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {items.map((item) => {
          return (
            <NavLink
              key={`${item.href}-${item.label}`}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
        Need help? Contact support.
      </div>
    </aside>
  );
};
