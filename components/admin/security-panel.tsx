"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Shield, ShieldOff } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  confirmTotpSetupAction,
  disableTotpAction,
  startTotpSetupAction,
} from "@/actions/security";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/form-field";
import {
  totpDisableSchema,
  totpEnableConfirmSchema,
  type TotpDisableInput,
} from "@/lib/validations";
import { z } from "zod";

type SecurityPanelProps = {
  initiallyEnabled: boolean;
  verifiedAt: string | null;
};

const confirmSchema = totpEnableConfirmSchema.pick({ code: true });

type ConfirmValues = z.infer<typeof confirmSchema>;

export function SecurityPanel({
  initiallyEnabled,
  verifiedAt,
}: SecurityPanelProps) {
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [enabledAt, setEnabledAt] = useState(verifiedAt);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [setupToken, setSetupToken] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const confirmForm = useForm<ConfirmValues>({
    resolver: zodResolver(confirmSchema),
    defaultValues: { code: "" },
  });

  const disableForm = useForm<TotpDisableInput>({
    resolver: zodResolver(totpDisableSchema),
    defaultValues: { password: "", code: "" },
  });

  const startSetup = () => {
    setError("");
    setMessage("");
    startTransition(async () => {
      const result = await startTotpSetupAction();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSetupToken(result.setupToken);
      setSecret(result.secret);
      setQrDataUrl(result.qrDataUrl);
      confirmForm.reset({ code: "" });
    });
  };

  const confirmSetup = (values: ConfirmValues) => {
    if (!setupToken) return;
    setError("");
    setMessage("");
    startTransition(async () => {
      const result = await confirmTotpSetupAction({
        code: values.code,
        setupToken,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEnabled(true);
      setEnabledAt(new Date().toISOString());
      setSetupToken(null);
      setSecret(null);
      setQrDataUrl(null);
      setMessage(result.message);
    });
  };

  const disableTotp = (values: TotpDisableInput) => {
    setError("");
    setMessage("");
    startTransition(async () => {
      const result = await disableTotpAction(values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEnabled(false);
      setEnabledAt(null);
      disableForm.reset({ password: "", code: "" });
      setMessage(result.message);
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-foreground">
              Authenticator app (TOTP)
            </h2>
            <p className="mt-1 text-sm text-muted">
              {enabled
                ? "2FA is enabled. Login requires your password plus a 6-digit code."
                : "Add an extra login step with Google Authenticator, Authy, or a similar app."}
            </p>
            {enabled && enabledAt ? (
              <p className="mt-2 text-xs text-muted">
                Enabled {new Date(enabledAt).toLocaleString()}
              </p>
            ) : null}
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              enabled
                ? "bg-accent/15 text-accent"
                : "bg-muted/20 text-muted"
            }`}
          >
            {enabled ? "On" : "Off"}
          </span>
        </div>
      </div>

      {message ? (
        <p
          className="inline-flex items-center gap-2 text-sm text-accent"
          role="status"
        >
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {!enabled ? (
        <div className="glass space-y-5 rounded-2xl p-6">
          {!setupToken ? (
            <>
              <p className="text-sm text-muted">
                Scan a QR code with your authenticator app, then confirm with a
                live code to turn 2FA on.
              </p>
              <Button type="button" onClick={startSetup} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Set up 2FA"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="Authenticator QR code"
                    width={220}
                    height={220}
                    className="rounded-xl border border-border bg-white p-2"
                  />
                ) : null}
                <div className="min-w-0 flex-1 space-y-3">
                  <p className="text-sm text-muted">
                    Can&apos;t scan? Enter this key manually:
                  </p>
                  <code className="block break-all rounded-xl border border-border bg-background/60 px-3 py-2 font-mono text-xs text-foreground">
                    {secret}
                  </code>
                </div>
              </div>

              <form
                onSubmit={confirmForm.handleSubmit(confirmSetup)}
                className="max-w-sm space-y-4"
                noValidate
              >
                <TextInput
                  id="setup-code"
                  label="Confirm with 6-digit code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  maxLength={6}
                  error={confirmForm.formState.errors.code?.message}
                  {...confirmForm.register("code")}
                />
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enabling...
                      </>
                    ) : (
                      "Enable 2FA"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() => {
                      setSetupToken(null);
                      setSecret(null);
                      setQrDataUrl(null);
                      setError("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      ) : (
        <div className="glass space-y-4 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-muted">
            <ShieldOff className="h-4 w-4" />
            Disable 2FA (requires password + current authenticator code)
          </div>
          <form
            onSubmit={disableForm.handleSubmit(disableTotp)}
            className="max-w-sm space-y-4"
            noValidate
          >
            <TextInput
              id="disable-password"
              label="Current password"
              type="password"
              autoComplete="current-password"
              error={disableForm.formState.errors.password?.message}
              {...disableForm.register("password")}
            />
            <TextInput
              id="disable-code"
              label="Authenticator code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              error={disableForm.formState.errors.code?.message}
              {...disableForm.register("code")}
            />
            <Button type="submit" variant="secondary" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                "Disable 2FA"
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
