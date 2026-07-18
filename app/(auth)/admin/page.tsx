import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Portfolio admin entry — sends visitors to login or dashboard. */
export default async function AdminEntryPage() {
  const session = await getAdminSession();
  redirect(session ? "/dashboard" : "/login");
}
