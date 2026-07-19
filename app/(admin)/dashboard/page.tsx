import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  await requireAdmin();

  const [totalContacts, pendingContacts, resolvedContacts, latestContacts] =
    await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: "Pending" } }),
      prisma.contact.count({
        where: { status: { in: ["Done", "Completed", "Resolved"] } },
      }),
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted">
          Overview of portfolio contact activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Total contacts
              </p>
              <p className="font-display text-2xl font-bold text-foreground">
                {totalContacts}
              </p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Clock3 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Pending / unresponded
              </p>
              <p className="font-display text-2xl font-bold text-foreground">
                {pendingContacts}
              </p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Resolved / completed
              </p>
              <p className="font-display text-2xl font-bold text-foreground">
                {resolvedContacts}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="glass rounded-2xl p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-foreground">
            Recent contacts
          </h2>
          <Link
            href="/dashboard/contacts"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {latestContacts.length === 0 ? (
          <p className="text-sm text-muted">
            No contact submissions yet. New form messages will show up here.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {latestContacts.map((contact) => (
              <li
                key={contact.id}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {contact.name}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {contact.subject} · {contact.email} · {contact.status}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted">
                  {contact.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
