import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";
import ScrollProgress from "@/components/common/scroll-progress";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <ScrollProgress />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
