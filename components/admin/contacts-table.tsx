type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
};

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
