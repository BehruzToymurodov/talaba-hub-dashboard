import type { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";

export const KpiCard: FC<{ label: string; value: string | number; hint?: string }> = ({
  label,
  value,
  hint
}) => (
  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </CardContent>
  </Card>
);
