import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
