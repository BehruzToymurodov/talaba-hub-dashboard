import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

import { useAuth } from "@/lib/auth/AuthProvider";
import { KpiCard } from "@/components/cards/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { role } = useAuth();

  const kpis = useMemo(() => {
    if (role === "admin") {
      return [
        { label: "Total Users", value: 1240, hint: "Across platform" },
        { label: "Verified Students", value: 680, hint: "Approved" },
        { label: "Pending Applications", value: 42, hint: "Needs review" },
        { label: "Active Discounts", value: 118, hint: "Published" }
      ];
    }
    if (role === "moderator") {
      return [
        { label: "My Discounts", value: 14, hint: "All statuses" },
        { label: "Published", value: 9, hint: "Live now" },
        { label: "Expiring Soon", value: 3, hint: "Within 7 days" }
      ];
    }
    return [
      { label: "Available Discounts", value: 52, hint: "For you" },
      { label: "Application Status", value: "Pending", hint: "Last update today" }
    ];
  }, [role]);

  const chartData = [
    { name: "Mon", value: 40 },
    { name: "Tue", value: 48 },
    { name: "Wed", value: 30 },
    { name: "Thu", value: 65 },
    { name: "Fri", value: 60 },
    { name: "Sat", value: 45 },
    { name: "Sun", value: 75 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} hint={kpi.hint} />
        ))}
      </div>

      {role === "admin" ? (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: 8, right: 8 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#60a5fa" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
