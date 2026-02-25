"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyDeviceClient({ next }: { next: string }) {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function requestCode() {
    setSending(true);
    try {
      const res = await fetch("/api/admin/device-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request" }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.message || "Failed to send code");

      if (j.alreadyTrusted) {
        router.replace(next);
        router.refresh();
        return;
      }

      toast.success("Verification code sent to admin email");

      // helpful in dev if returned
      if (j.devOtp) toast.message(`Dev OTP: ${j.devOtp}`);
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setSending(false);
    }
  }

  async function verify() {
    setVerifying(true);
    try {
      const res = await fetch("/api/admin/device-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.message || "Verification failed");

      toast.success("Device verified");
      router.replace(next);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  useEffect(() => {
    requestCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify this device</CardTitle>
          <CardDescription>
            A verification code has been sent to the admin email. Enter it to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="secondary" onClick={requestCode} disabled={sending}>
            {sending ? "Sending..." : "Send code again"}
          </Button>

          <div className="space-y-2">
            <label className="text-sm font-medium">6-digit code</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} />
          </div>

          <Button className="w-full" onClick={verify} disabled={verifying}>
            {verifying ? "Verifying..." : "Verify"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
