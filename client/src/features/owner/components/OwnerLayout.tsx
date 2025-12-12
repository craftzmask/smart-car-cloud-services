import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { Car } from "@/domain/types";
import { Link, useLocation } from "react-router";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/auth/AuthContext";

interface OwnerLayoutProps {
  children: (selectedCarId: string | null) => ReactNode;
  cars?: Car[];
  ownerName?: string;
}

export function OwnerLayout({ children, cars, ownerName }: OwnerLayoutProps) {
  const effectiveCars: Car[] = cars ?? [];

  const [selectedCarId, setSelectedCarId] = useState<string | null>(
    effectiveCars[0]?.id || null
  );

  useEffect(() => {
    if (!effectiveCars.length) {
      setSelectedCarId(null);
      return;
    }
    const exists = effectiveCars.some((car) => car.id === selectedCarId);
    if (!exists) {
      setSelectedCarId(effectiveCars[0].id);
    }
  }, [effectiveCars, selectedCarId]);

  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Overview", path: "/owner/overview" },
    { label: "Account", path: "/owner/account" },
    { label: "Notifications", path: "/owner/notifications" },
    { label: "My Cars", path: "/owner/dashboard" },
  ];

  const displayName = user?.name || ownerName || "Owner";
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Smart Car Cloud</h2>
          <p className="text-sm text-slate-500">Signed in as {displayName}</p>
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

        <Separator />

        {/* My Cars list */}
        {location.pathname.startsWith("/owner/dashboard") && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
              My Cars
            </h3>
            <div className="space-y-1">
              {effectiveCars.map((car) => (
                <button
                  key={car.id}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    car.id === selectedCarId
                      ? "bg-slate-900 text-white"
                      : "hover:bg-slate-100 hover:cursor-pointer text-slate-700"
                  }`}
                  onClick={() => setSelectedCarId(car.id)}
                >
                  {car.make} {car.model}
                </button>
              ))}
              {effectiveCars.length === 0 && (
                <p className="text-xs text-slate-500">No cars found</p>
              )}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6">
        {selectedCarId && children(selectedCarId)}
      </main>
    </div>
  );
}
