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
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

const navigatedItems = {
  OWNER: "/owner/overview",
  IOT: "/iot/devices",
  CLOUD: "/cloud/overview",
};

const roleLabels: Record<UserRole, string> = {
  OWNER: "Smart Car Owner",
  IOT: "IoT / Devices Team",
  CLOUD: "Cloud Service Staff",
};

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("OWNER");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    navigate(navigatedItems[user.role], { replace: true });
  }, [user, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({
        username,
        password,
        roleHint: role,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign in right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleQuickLogin(nextRole: UserRole) {
    setRole(nextRole);
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your details to access Smart Car Cloud. Your role will route you to the right workspace.
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
                ref={usernameRef}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
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
                Demo: we route you to the matching workspace for that role.
              </p>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Sign in
            </Button>
            <p className="text-sm text-slate-600 text-center">
              Need an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>{" "}
              or{" "}
              <Link to="/confirm" className="text-primary hover:underline">
                confirm your email
              </Link>
              .
            </p>
          </form>

          <Separator />

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quick role preset
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(Object.keys(roleLabels) as Array<UserRole>).map((key) => (
                <Button
                  key={key}
                  type="button"
                  variant={role === key ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleQuickLogin(key)}
                >
                  {roleLabels[key]}
                </Button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Choose a role here, then hit Sign in to enter that workspace.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
