"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

const contactStatusSchema = z.enum([
  "Pending",
  "Done",
  "Completed",
  "Resolved",
]);

const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: contactStatusSchema,
});

export type UpdateContactStatusResult =
  | { ok: true; status: z.infer<typeof contactStatusSchema> }
  | { ok: false; error: string };

export async function updateContactStatusAction(
  input: z.infer<typeof updateStatusSchema>,
): Promise<UpdateContactStatusResult> {
  await requireAdmin();

  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid status update",
    };
  }

  try {
    const updated = await prisma.contact.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
      select: { status: true },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contacts");

    return { ok: true, status: updated.status };
  } catch (error) {
    console.error("updateContactStatusAction error:", error);
    return {
      ok: false,
      error: "Could not update contact status. Please try again.",
    };
  }
}
