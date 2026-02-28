"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({
  className,
  children = "Logout",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.replace("/");
    router.refresh();
  }

  return (
    <button className={className} onClick={logout} type="button">
      {children}
    </button>
  );
}
