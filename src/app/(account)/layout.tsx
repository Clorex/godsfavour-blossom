import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";
import { requireUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/account");
  const email = (user.email || "").toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();

  if (email && adminEmail && email === adminEmail) redirect("/admin");

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
