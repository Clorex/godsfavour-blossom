export default function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-600">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Godsfavour Blossom</div>
          <div className="text-slate-500">Co‑operative Society</div>
        </div>
      </div>
    </footer>
  );
}
