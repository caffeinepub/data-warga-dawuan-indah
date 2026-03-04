import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { settingsStore } from "../utils/settingsStore";

const navItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard_link",
  },
  { to: "/admin/kk", label: "Data KK", icon: Home, ocid: "nav.kk_link" },
  {
    to: "/admin/warga",
    label: "Data Warga",
    icon: Users,
    ocid: "nav.warga_link",
  },
  {
    to: "/admin/iuran",
    label: "Iuran",
    icon: CreditCard,
    ocid: "nav.iuran_link",
  },
  {
    to: "/admin/laporan",
    label: "Laporan",
    icon: FileText,
    ocid: "nav.laporan_link",
  },
  {
    to: "/admin/settings",
    label: "Pengaturan",
    icon: Settings,
    ocid: "nav.settings_link",
  },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
}: AdminLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const logoUrl = settingsStore.getLogoUrl();

  async function handleLogout() {
    await logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Tutup sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.18 0.055 216) 0%, oklch(0.24 0.06 214) 100%)",
        }}
      >
        {/* Sidebar header */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Home className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="text-white font-display font-bold text-sm leading-tight">
                  Dawuan Indah
                </p>
                <p className="text-white/40 text-xs">Admin Panel</p>
              </div>
            </div>
            <button
              type="button"
              className="lg:hidden text-white/50 hover:text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.to === "/admin"
                ? currentPath === "/admin"
                : currentPath.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={item.ocid}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10"
            onClick={handleLogout}
            data-ocid="nav.logout_button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-3 flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-foreground text-lg leading-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
