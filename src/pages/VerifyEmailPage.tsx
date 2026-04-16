import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { verifyEmailRequest } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(token ? "loading" : "idle");
  const [message, setMessage] = useState("Verification token is missing.");

  useEffect(() => {
    if (!token) return;

    let active = true;

    const verify = async () => {
      try {
        const response = await verifyEmailRequest(token);
        if (!active) return;
        setStatus("success");
        setMessage(response.message ?? "Your email has been verified.");
      } catch {
        if (!active) return;
        setStatus("error");
        setMessage("Email verification failed. The token may be invalid or expired.");
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {status === "loading" ? "Verifying your email..." : message}
          </p>
          <Button asChild className="w-full">
            <Link to="/login">{status === "success" ? "Continue to Sign in" : "Back to Sign in"}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
