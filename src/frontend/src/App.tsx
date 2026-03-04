import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import AuthGuard from "./components/AuthGuard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import DashboardPage from "./pages/admin/DashboardPage";
import DataKKPage from "./pages/admin/DataKKPage";
import DataWargaPage from "./pages/admin/DataWargaPage";
import IuranPage from "./pages/admin/IuranPage";
import LaporanPage from "./pages/admin/LaporanPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/setup",
  component: SetupPage,
});

// Admin layout route (with auth guard)
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: DashboardPage,
});

const kkRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/kk",
  component: DataKKPage,
});

const wargaRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/warga",
  component: DataWargaPage,
});

const iuranRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/iuran",
  component: IuranPage,
});

const laporanRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/laporan",
  component: LaporanPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/settings",
  component: SettingsPage,
});

// Catch-all redirect to landing
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  setupRoute,
  adminLayoutRoute.addChildren([
    dashboardRoute,
    kkRoute,
    wargaRoute,
    iuranRoute,
    laporanRoute,
    settingsRoute,
  ]),
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
