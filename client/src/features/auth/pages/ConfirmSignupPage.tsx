import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

export function ConfirmSignupPage() {
  const { confirmSignUp, resendConfirmation } = useAuth();
  const [searchParams] = useSearchParams();
  const initialUser = searchParams.get("username") || "";

  const [username, setUsername] = useState(initialUser);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialUser) {
      setUsername(initialUser);
    }
  }, [initialUser]);

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      await confirmSignUp({ username, code });
      setMessage("Account confirmed. You can sign in now.");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to confirm account right now.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setMessage(null);
    setIsResending(true);
    try {
      await resendConfirmation(username);
      setMessage("Verification code resent. Check your email.");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to resend code right now.";
      setError(msg);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Confirm your account</CardTitle>
          <CardDescription>
            Enter the verification code sent to your email. You can resend it if
            needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleConfirm}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your.username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            {message && (
              <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                {message}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Confirm account
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={isResending || !username}
              >
                Resend code
              </Button>
            </div>
          </form>

          <Separator />
          <div className="text-sm text-slate-600">
            Ready to sign in?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Go to login
            </Link>
          </div>
          <div className="text-sm text-slate-600">
            Need an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create one
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
