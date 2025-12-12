import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getApiBaseUrl } from "@/lib/apiConfig";

export type UserRole = "OWNER" | "IOT" | "CLOUD";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  backendRole?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  login: (input: LoginInput) => Promise<AuthUser>;
  signup: (input: SignupInput) => Promise<void>;
  confirmSignUp: (input: ConfirmInput) => Promise<void>;
  resendConfirmation: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "authUser";

export interface AuthTokens {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

interface StoredAuthState {
  user: AuthUser;
  tokens?: AuthTokens | null;
}

interface LoginInput {
  username: string;
  password: string;
  roleHint?: UserRole;
}

interface SignupInput {
  username: string;
  password: string;
  email: string;
  roleHint?: UserRole;
}

interface ConfirmInput {
  username: string;
  code: string;
}

function readStoredAuth(): StoredAuthState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredAuthState;
    if (!parsed?.user?.id || !parsed.user.role) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return { user: parsed.user, tokens: parsed.tokens ?? null };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function mapBackendRoleToUserRole(role?: string | null, fallback?: UserRole) {
  switch ((role || "").toLowerCase()) {
    case "car_owner":
      return "OWNER";
    case "iot_team":
      return "IOT";
    case "cloud_team":
      return "CLOUD";
    default:
      return fallback || "OWNER";
  }
}

function mapUserRoleToBackend(role?: UserRole | null) {
  if (role === "OWNER") return "car_owner";
  if (role === "IOT") return "iot_team";
  if (role === "CLOUD") return "cloud_team";
  return undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  useEffect(() => {
    const stored = readStoredAuth();
    if (!stored) return;
    setUser(stored.user);
    setTokens(stored.tokens ?? null);
  }, []);

  async function login(input: LoginInput) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: input.username,
        password: input.password,
        loginAs: mapUserRoleToBackend(input.roleHint),
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        payload?.message ||
        payload?.error ||
        "Unable to sign in. Please try again.";
      throw new Error(message);
    }

    const tokensFromApi: AuthTokens | null = payload?.data?.tokens || null;
    const rawUser = payload?.data?.user?.localUser ?? null;
    if (!rawUser?.id || !rawUser?.role) {
      throw new Error("Invalid user payload from login");
    }
    const backendRole: string | undefined = rawUser.role;
    const resolvedRole = mapBackendRoleToUserRole(backendRole, input.roleHint);

    const authUser: AuthUser = {
      id: rawUser.id,
      name: rawUser.name || rawUser.username || "User",
      email: rawUser.email,
      role: resolvedRole,
      backendRole,
    };

    setUser(authUser);
    setTokens(tokensFromApi);
    if (typeof window !== "undefined") {
      const stored: StoredAuthState = { user: authUser, tokens: tokensFromApi };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
    }

    return authUser;
  }

  async function signup(input: SignupInput) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: input.username,
        password: input.password,
        email: input.email,
        role: mapUserRoleToBackend(input.roleHint) ?? "car_owner",
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        payload?.message ||
        payload?.error ||
        "Unable to sign up. Please try again.";
      throw new Error(message);
    }
  }

  async function confirmSignUp(input: ConfirmInput) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: input.username,
        code: input.code,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        payload?.message ||
        payload?.error ||
        "Unable to confirm account. Please try again.";
      throw new Error(message);
    }
  }

  async function resendConfirmation(username: string) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        payload?.message ||
        payload?.error ||
        "Unable to resend confirmation code. Please try again.";
      throw new Error(message);
    }
  }

  function logout() {
    setUser(null);
    setTokens(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  const value: AuthContextValue = {
    user,
    tokens,
    login,
    signup,
    confirmSignUp,
    resendConfirmation,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
