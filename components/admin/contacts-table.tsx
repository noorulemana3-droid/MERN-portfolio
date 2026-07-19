"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateContactStatusAction } from "@/actions/contacts";

export type ContactStatusValue = "Pending" | "Done" | "Completed" | "Resolved";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatusValue;
  createdAt: Date;
  updatedAt: Date;
};

const STATUS_OPTIONS: ContactStatusValue[] = [
  "Pending",
  "Done",
  "Completed",
  "Resolved",
];

function statusClass(status: ContactStatusValue) {
  switch (status) {
    case "Done":
      return "bg-sky-500/15 text-sky-700 dark:text-sky-300";
    case "Completed":
      return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300";
    case "Resolved":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    default:
      return "bg-amber-500/15 text-amber-800 dark:text-amber-200";
  }
}

function StatusSelect({
  contactId,
  status,
}: {
  contactId: string;
  status: ContactStatusValue;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const onChange = (next: ContactStatusValue) => {
    const previous = value;
    setValue(next);
    setError("");
    startTransition(async () => {
      const result = await updateContactStatusAction({
        id: contactId,
        status: next,
      });
      if (!result.ok) {
        setValue(previous);
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="min-w-[8.5rem]">
      <select
        value={value}
        disabled={isPending}
        onChange={(event) => onChange(event.target.value as ContactStatusValue)}
        aria-label="Contact status"
        className={`h-9 w-full rounded-lg border border-border bg-background px-2 text-xs font-medium focus-ring disabled:opacity-60 ${statusClass(value)}`}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-[11px] text-danger">{error}</p> : null}
    </div>
  );
}

export function ContactsTable({ contacts }: { contacts: ContactRow[] }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Subject</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts.map((contact) => (
              <tr key={contact.id} className="align-top hover:bg-accent-soft/40">
                <td className="px-4 py-3 font-medium text-foreground">
                  {contact.name}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-accent hover:underline"
                  >
                    {contact.email}
                  </a>
                </td>
                <td className="max-w-[12rem] px-4 py-3 text-foreground">
                  {contact.subject}
                </td>
                <td className="max-w-sm px-4 py-3 text-muted">
                  <p className="line-clamp-3 whitespace-pre-wrap">
                    {contact.message}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusSelect contactId={contact.id} status={contact.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                  {contact.createdAt.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
