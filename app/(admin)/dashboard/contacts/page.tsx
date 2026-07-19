import Link from "next/link";
import { Search } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { ContactsTable } from "@/components/admin/contacts-table";

export const metadata = {
  title: "Contact Queries",
};

type ContactsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  await requireAdmin();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const contacts = await prisma.contact.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { subject: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Contact Queries
          </h1>
          <p className="mt-2 text-sm text-muted">
            {contacts.length} quer{contacts.length === 1 ? "y" : "ies"}
            {query ? ` matching “${query}”` : ""}. Change status from Pending to
            Done, Completed, or Resolved.
          </p>
        </div>

        <form className="relative w-full sm:max-w-xs" method="get">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search name, email, subject..."
            className="h-11 w-full rounded-xl border border-border bg-background/60 py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted focus-ring"
          />
        </form>
      </div>

      {contacts.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-sm text-muted">
            {query
              ? "No contacts match your search."
              : "No contact submissions yet."}
          </p>
          {query ? (
            <Link
              href="/dashboard/contacts"
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              Clear search
            </Link>
          ) : null}
        </div>
      ) : (
        <ContactsTable contacts={contacts} />
      )}
    </div>
  );
}
