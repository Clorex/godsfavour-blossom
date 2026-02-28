"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginClient({ next }: { next: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j?.message || "Failed to create session");

      toast.success("Logged in");
      const dest = (next && next !== "/account") ? next : (j.isAdmin ? "/admin" : "/account"); router.replace(dest);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const registerHref = `/auth/register?next=${encodeURIComponent(next)}`;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Sign in to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>

          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <a className="underline" href={registerHref}>
              Create one
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}



