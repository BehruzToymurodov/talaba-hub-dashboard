import type { FC } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/components/layout/nav";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils";
import logo from "@/assets/talabahub.png";

export const MobileNav: FC = () => {
  const [open, setOpen] = useState(false);
  const { role } = useAuth();

  const items = NAV_ITEMS.filter((item) => (role ? item.roles.includes(role) : false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs p-0">
        <div className="space-y-4 p-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                <img src={logo} alt="TalabaHub logo" className="h-9 w-9 object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold">TalabaHub</p>
                <p className="text-xs text-muted-foreground">Admin Console</p>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              return (
                <NavLink
                  key={`${item.href}-${item.label}`}
                  to={item.href}
                  onClick={() => setOpen(false)}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
