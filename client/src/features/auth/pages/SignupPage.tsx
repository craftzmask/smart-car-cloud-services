import { useAuth, type UserRole } from "@/auth/AuthContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const roleLabels: Record<UserRole, string> = {
  OWNER: "Smart Car Owner",
  IOT: "IoT / Devices Team",
  CLOUD: "Cloud Service Staff",
};

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("OWNER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      await signup({ username, email, password, roleHint: role });
      setSuccess("Account created. Check your email for the verification code.");
      navigate(`/confirm?username=${encodeURIComponent(username)}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign up right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Create account</CardTitle>
          <CardDescription>
            Set up your Smart Car Cloud account and pick the workspace role you
            need.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick your workspace role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">{roleLabels.OWNER}</SelectItem>
                  <SelectItem value="IOT">{roleLabels.IOT}</SelectItem>
                  <SelectItem value="CLOUD">{roleLabels.CLOUD}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Roles map to backend groups for access control.
              </p>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Create account
            </Button>
          </form>

          <Separator />
          <div className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
