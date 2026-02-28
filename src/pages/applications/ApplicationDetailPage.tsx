import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useDomains, useReviewApplication } from "@/lib/api/hooks";
import type { Application } from "@/types";
import { getDomainFromEmail, formatDateTime } from "@/lib/utils/formatters";
import { RequireRole } from "@/components/layout/AuthGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

export default function ApplicationDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const applicationId = params.id as string;
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: application, isLoading } = useQuery({
    queryKey: ["applications", applicationId],
    queryFn: async () => {
      const { data } = await apiClient.get<Application>(ENDPOINTS.applications.detail(applicationId));
      return data;
    }
  });

  const { data: domainsData } = useDomains({ page: 1, pageSize: 200 });
  const reviewMutation = useReviewApplication();

  useEffect(() => {
    if (application?.rejectionReason) {
      setRejectionReason(application.rejectionReason);
    }
  }, [application?.rejectionReason]);

  const clientDomainCheck = useMemo(() => {
    if (!application?.universityEmail) return null;
    const domain = getDomainFromEmail(application.universityEmail);
    return domainsData?.data?.some((item) => item.domain === domain && item.active) ?? null;
  }, [application?.universityEmail, domainsData?.data]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading application...</div>;
  }

  if (!application) {
    return <div className="text-sm text-muted-foreground">Application not found.</div>;
  }

  return (
    <RequireRole allowed={["admin"]}>
      <div className="space-y-6">
        <PageHeader title="Application Review" subtitle={`Application ${application.id}`} />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-sm text-muted-foreground">Applicant</p>
                <p className="text-lg font-semibold">
                  {application.user?.firstName} {application.user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{application.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">University Email</p>
                <p className="font-medium">{application.universityEmail}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{formatDateTime(application.createdDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={application.status === "ACCEPTED" ? "success" : application.status === "REJECTED" ? "destructive" : "warning"}>
                    {application.status}
                  </Badge>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Study Start</p>
                  <p className="font-medium">{application.studyStartDate ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Study End</p>
                  <p className="font-medium">{application.studyEndDate ?? "-"}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Client Domain Check</p>
                  <Badge variant={clientDomainCheck ? "success" : "warning"}>
                    {clientDomainCheck ? "Supported" : "Not supported"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Server Domain Check</p>
                  <Badge variant={application.emailSupportedDomain ? "success" : "warning"}>
                    {application.emailSupportedDomain ? "Supported" : "Not supported"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejection Reason</p>
                <Textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Provide a reason for rejection"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attachments</p>
                {application.attachments?.length ? (
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {application.attachments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No attachments</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">Actions</p>
              <Button className="w-full" onClick={() => setConfirmAction("approve")}>
                Approve
              </Button>
              <Button variant="destructive" className="w-full" onClick={() => setConfirmAction("reject")}>
                Reject
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
        <ConfirmDialog
          open={!!confirmAction}
          title={confirmAction === "approve" ? "Approve application?" : "Reject application?"}
          description="This will update the student verification status."
          confirmLabel={confirmAction === "approve" ? "Approve" : "Reject"}
          destructive={confirmAction === "reject"}
          isLoading={reviewMutation.isPending}
          onCancel={() => setConfirmAction(null)}
          onConfirm={async () => {
            if (!confirmAction) return;
            try {
              await reviewMutation.mutateAsync({
                id: application.id,
                payload: { status: confirmAction === "approve" ? "ACCEPTED" : "REJECTED", rejectionReason }
              });
              toast.success("Application updated");
              setConfirmAction(null);
            } catch {
              toast.error("Failed to update application");
            }
          }}
        />
      </div>
    </RequireRole>
  );
}
