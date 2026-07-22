import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { RecaptchaBadgeCleaner } from "@/components/admin/recaptcha-badge-cleaner";
import { requireAdmin } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Admin",
  },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div
      data-admin-shell
      className="flex min-h-screen flex-col lg:flex-row"
    >
      <RecaptchaBadgeCleaner />
      <AdminSidebar adminName={admin.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="hidden border-b border-border px-6 py-4 lg:block">
          <p className="text-sm text-muted">
            Signed in as{" "}
            <span className="font-medium text-foreground">{admin.email}</span>
          </p>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
