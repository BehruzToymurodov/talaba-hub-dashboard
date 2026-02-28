import { useMemo } from "react";
import { toast } from "sonner";

import { RequireRole } from "@/components/layout/AuthGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { useMyApplications, useSubmitApplication } from "@/lib/api/hooks";

export default function ApplyPage() {
  const { data } = useMyApplications({ page: 1, pageSize: 1 });
  const submitApplication = useSubmitApplication();

  const currentStatus = useMemo(() => data?.data?.[0]?.status ?? null, [data]);

  return (
    <RequireRole allowed={["student"]}>
      <div className="space-y-6">
        <PageHeader title="Apply for Verification" subtitle="Submit your student credentials" />
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Current status</p>
              <p className="text-lg font-semibold">{currentStatus ?? "Not submitted"}</p>
            </div>
            <Badge variant={currentStatus === "ACCEPTED" ? "success" : currentStatus === "REJECTED" ? "destructive" : "warning"}>
              {currentStatus ?? "New"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <ApplicationForm
              isSubmitting={submitApplication.isPending}
              onSubmit={async (values) => {
                try {
                  await submitApplication.mutateAsync(values);
                  toast.success("Application submitted");
                } catch {
                  toast.error("Failed to submit application");
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  );
}
