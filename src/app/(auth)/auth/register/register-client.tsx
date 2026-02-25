"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseAuth, firestoreDb } from "@/lib/firebase/client";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterClient({ next }: { next: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const idToken = await cred.user.getIdToken();

      await setDoc(
        doc(firestoreDb, "users", cred.user.uid),
        { email: cred.user.email, createdAt: serverTimestamp() },
        { merge: true }
      );

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j?.message || "Failed to create session");

      toast.success("Account created");
      router.replace(next);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const loginHref = `/auth/login?next=${encodeURIComponent(next)}`;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Register to apply for services.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} />
            <p className="text-xs text-muted-foreground">Minimum 6 characters.</p>
          </div>

          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a className="underline" href={loginHref}>
              Login
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
