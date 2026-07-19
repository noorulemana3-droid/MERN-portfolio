import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254, "Email is too long"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
  /**
   * Honeypot — must stay empty. Not stored in the database.
   * Avoid names like "website"/"url" — browsers autofill them and
   * cause false "success" without saving the message.
   */
  companyFax: z.string().max(200).optional(),
});

export const chatbotSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message is too long"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  captchaToken: z.string().optional(),
});

export const totpCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit authenticator code"),
  pendingToken: z.string().min(1, "Login session expired. Sign in again."),
});

export const totpEnableConfirmSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit authenticator code"),
  setupToken: z.string().min(1, "Setup session expired. Start again."),
});

export const totpDisableSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit authenticator code"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ChatbotInput = z.infer<typeof chatbotSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TotpCodeInput = z.infer<typeof totpCodeSchema>;
export type TotpEnableConfirmInput = z.infer<typeof totpEnableConfirmSchema>;
export type TotpDisableInput = z.infer<typeof totpDisableSchema>;
