import { useAuth } from "@/auth/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface CloudLayoutProps {
  children: ReactNode;
}

export function CloudLayout({ children }: CloudLayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      description:
        "A centralized view to monitor, manage, and optimize cloud environment",
      path: "/cloud/overview",
    },
    {
      label: "Alerts",
      description:
        "System-wide audio intelligence alerts across all smart cars",
      path: "/cloud/alerts",
    },
    {
      label: "Alert Types",
      description:
        "Configure predefined audio-based alert types used across cars, IoT devices, and AI models",
      path: "/cloud/alert-types",
    },
    {
      label: "AI models",
      description: "Manage, monitor, and deploy your AI and ML models",
      path: "/cloud/models",
    },
    {
      label: "Database",
      description:
        "A centralized view of all database systems and configurations",
      path: "/cloud/database",
    }, // future
  ];

  const currentItem = navItems.find((item) =>
    location.pathname.startsWith(item.path)
  );

  if (!currentItem) return <p>No URL Found</p>;

  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Cloud Ops Console</h2>
          <p className="text-sm text-slate-500">
            Signed in as {user?.name || "Cloud service staff"}
          </p>
          {user && (
            <button
              className="mt-2 text-slate-600 font-medium underline hover:cursor-pointer"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>

        <Separator />

        {/* Top navigation */}
        <nav className="space-y-1 mb-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded text-sm transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1">
        <Toaster />
        {/* Header */}
        <div className="py-2 border-b">
          <div className="flex flex-col h-16 px-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {currentItem.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentItem.description}
            </p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
