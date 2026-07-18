"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, ShieldCheck, Timer } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/form-field";
import { useRecaptchaV3 } from "@/hooks/use-recaptcha-v3";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { SITE } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  recaptchaSiteKey: string;
  recaptchaEnabled: boolean;
  maxAttempts: number;
};

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function LoginForm({
  recaptchaSiteKey,
  recaptchaEnabled,
  maxAttempts,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [error, setError] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(
    null,
  );
  const [lockSeconds, setLockSeconds] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { ready, execute, enabled } = useRecaptchaV3(recaptchaSiteKey);

  const locked = lockSeconds > 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", captchaToken: "" },
  });

  useEffect(() => {
    if (lockSeconds <= 0) return;
    const id = window.setInterval(() => {
      setLockSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [lockSeconds]);

  const onSubmit = (values: LoginInput) => {
    if (locked) return;
    setError("");

    startTransition(async () => {
      try {
        let captchaToken = "";
        if (enabled) {
          if (!ready) {
            setError("Security check is still loading. Please wait a second.");
            return;
          }
          captchaToken = await execute("login");
        }

        const result = await loginAction({
          ...values,
          captchaToken,
        });

        if (!result.ok) {
          setError(result.error);
          if (typeof result.attemptsRemaining === "number") {
            setAttemptsRemaining(result.attemptsRemaining);
          }
          if (result.code === "RATE_LIMITED" && result.retryAfterSeconds) {
            setLockSeconds(result.retryAfterSeconds);
            setAttemptsRemaining(0);
          }
          return;
        }

        setAttemptsRemaining(null);
        setLockSeconds(0);
        router.replace(nextPath.startsWith("/") ? nextPath : "/dashboard");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to sign in. Please try again.",
        );
      }
    });
  };

  return (
    <div className="glass w-full max-w-md rounded-2xl p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to manage {SITE.shortName} portfolio contacts
        </p>
      </div>

      {locked ? (
        <div
          className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          <p className="inline-flex items-center gap-2 font-medium">
            <Timer className="h-4 w-4" />
            Temporarily locked
          </p>
          <p className="mt-1 text-danger/90">
            Too many failed attempts. Try again in{" "}
            <span className="font-semibold tabular-nums">
              {formatCountdown(lockSeconds)}
            </span>
            .
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <fieldset disabled={isPending || locked} className="space-y-4 border-0 p-0">
          <TextInput
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextInput
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
        </fieldset>

        {error && !locked ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        {attemptsRemaining !== null && !locked ? (
          <div className="rounded-xl border border-border bg-background/50 px-3 py-2">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
              <span>Attempts remaining</span>
              <span className="font-medium text-foreground">
                {attemptsRemaining}/{maxAttempts}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-accent-soft">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  attemptsRemaining <= 1 ? "bg-danger" : "bg-accent",
                )}
                style={{
                  width: `${(attemptsRemaining / maxAttempts) * 100}%`,
                }}
              />
            </div>
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || locked || (enabled && !ready)}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {enabled ? "Verifying & signing in..." : "Signing in..."}
            </>
          ) : locked ? (
            <>
              <Timer className="h-4 w-4" />
              Locked · {formatCountdown(lockSeconds)}
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <p className="inline-flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          {recaptchaEnabled
            ? "Protected by reCAPTCHA v3 · rate limited"
            : "Login rate limited · add reCAPTCHA keys to enable captcha"}
        </p>
      </form>
    </div>
  );
}
