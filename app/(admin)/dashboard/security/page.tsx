import { requireAdmin } from "@/lib/auth/guards";
import { getTotpStatus } from "@/actions/security";
import { SecurityPanel } from "@/components/admin/security-panel";

export const metadata = {
  title: "Security",
};

export default async function SecurityPage() {
  await requireAdmin();
  const status = await getTotpStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Security
        </h1>
        <p className="mt-2 text-sm text-muted">
          Manage two-factor authentication for your admin account.
        </p>
      </div>

      <SecurityPanel
        initiallyEnabled={status.enabled}
        verifiedAt={status.verifiedAt}
      />
    </div>
  );
}
