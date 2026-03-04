import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  Home,
  Loader2,
  Lock,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }
    if (!actor) {
      setError("Sistem belum siap, coba lagi sebentar.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const hexHash = await hashPassword(password);
      const token = crypto.randomUUID();
      const result = await actor.loginWithCredentials(
        username.trim(),
        hexHash,
        token,
      );
      if (result !== null) {
        localStorage.setItem("admin_session_token", token);
        navigate({ to: "/admin" });
      } else {
        setError("Username atau password salah.");
      }
    } catch {
      setError("Terjadi kesalahan saat login. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] p-10 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.18 0.05 215) 0%, oklch(0.32 0.085 208) 100%)",
        }}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="hexagons"
                x="0"
                y="0"
                width="50"
                height="57.74"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="24.95,1 49.9,14.87 49.9,42.87 24.95,56.74 0,42.87 0,14.87"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>

        {/* Top logo */}
        <div className="relative">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mb-10"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Beranda
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-display font-bold text-lg leading-tight">
                Perumahan Dawuan Indah
              </p>
              <p className="text-white/50 text-xs">Sistem Informasi Warga</p>
            </div>
          </div>
        </div>

        {/* Middle text */}
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-white leading-tight mb-4">
            Portal Admin
            <br />
            Warga Perumahan
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            Kelola data penduduk, kartu keluarga, dan iuran bulanan secara
            efisien dalam satu platform terintegrasi.
          </p>
        </div>

        {/* Features list */}
        <div className="relative space-y-3">
          {[
            "Data KK & Warga Terstruktur",
            "Pencatatan Iuran Bulanan",
            "Laporan Komprehensif",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-white/70 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile back button */}
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="lg:hidden flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Shield className="w-7 h-7 text-primary" />
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Masuk Admin
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Masukkan username dan password admin untuk mengakses sistem.
          </p>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error state */}
            {error && (
              <div
                className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                data-ocid="login.error_state"
              >
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  autoComplete="username"
                  disabled={isLoading}
                  data-ocid="login.username_input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                  disabled={isLoading}
                  data-ocid="login.password_input"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold mt-2"
              disabled={isLoading}
              data-ocid="login.submit_button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Belum ada akun admin?{" "}
              <button
                type="button"
                onClick={() => navigate({ to: "/setup" })}
                className="text-primary hover:underline"
                data-ocid="login.setup_link"
              >
                Setup di sini
              </button>
            </p>
          </form>

          {/* Footer */}
          <p className="text-xs text-muted-foreground text-center mt-10">
            © {new Date().getFullYear()} Perumahan Dawuan Indah ·{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
