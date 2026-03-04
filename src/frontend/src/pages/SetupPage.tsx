import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Home,
  KeyRound,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function SetupPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();

  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [alreadyConfigured, setAlreadyConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Check if admin already exists
  useEffect(() => {
    if (isFetching || !actor) return;

    async function checkAdminStatus() {
      if (!actor) return;
      try {
        const existingAdmin = await actor.getAdminUsername();
        setAlreadyConfigured(existingAdmin !== null);
      } catch {
        // If error, assume not configured, allow setup to proceed
        setAlreadyConfigured(false);
      } finally {
        setIsCheckingStatus(false);
      }
    }

    checkAdminStatus();
  }, [actor, isFetching]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Username wajib diisi.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username minimal 3 karakter.");
      return;
    }
    if (!password) {
      setError("Password wajib diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (!actor) {
      setError("Sistem belum siap, coba lagi sebentar.");
      return;
    }

    setIsLoading(true);
    try {
      const passwordHash = await hashPassword(password);
      await actor.setAdminCredentials(username.trim(), passwordHash);
      toast.success("Kredensial admin berhasil disimpan!");
      navigate({ to: "/login" });
    } catch {
      setError("Terjadi kesalahan saat menyimpan kredensial. Coba lagi.");
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
                id="hexagons-setup"
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
            <rect width="100%" height="100%" fill="url(#hexagons-setup)" />
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
            Setup Awal
            <br />
            Admin System
          </h2>
          <p className="text-white/60 leading-relaxed text-sm">
            Langkah pertama sebelum menggunakan sistem — buat akun admin untuk
            mengelola data warga perumahan.
          </p>
        </div>

        {/* Steps */}
        <div className="relative space-y-3">
          {[
            "Buat akun admin di halaman ini",
            "Login menggunakan kredensial baru",
            "Mulai kelola data warga",
          ].map((item, i) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </div>
              <span className="text-white/70 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
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
            <KeyRound className="w-7 h-7 text-primary" />
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Setup Admin
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Buat kredensial admin pertama kali untuk mengakses sistem.
          </p>

          {/* Loading state while checking status */}
          {(isCheckingStatus || isFetching) && (
            <div
              className="flex items-center justify-center py-8 gap-3 text-muted-foreground"
              data-ocid="setup.loading_state"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Memeriksa status sistem...</span>
            </div>
          )}

          {/* Already configured */}
          {!isCheckingStatus && !isFetching && alreadyConfigured && (
            <div className="space-y-5" data-ocid="setup.success_state">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Setup sudah selesai
                  </p>
                  <p className="text-xs text-green-600/80 dark:text-green-400/70 mt-0.5">
                    Kredensial admin sudah dikonfigurasi. Silakan login untuk
                    melanjutkan.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate({ to: "/login" })}
                className="w-full h-12 text-base font-semibold"
                data-ocid="setup.login_link"
              >
                Kembali ke Login
              </Button>
            </div>
          )}

          {/* Setup form */}
          {!isCheckingStatus && !isFetching && !alreadyConfigured && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error state */}
              {error && (
                <div
                  className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                  data-ocid="setup.error_state"
                >
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-destructive">
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="setup-username" className="text-sm font-medium">
                  Username Admin
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="setup-username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    autoComplete="username"
                    disabled={isLoading}
                    data-ocid="setup.username_input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="setup-password" className="text-sm font-medium">
                  Password Baru
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="setup-password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="new-password"
                    disabled={isLoading}
                    data-ocid="setup.password_input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="setup-confirm-password"
                  className="text-sm font-medium"
                >
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="setup-confirm-password"
                    type="password"
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="new-password"
                    disabled={isLoading}
                    data-ocid="setup.confirm_password_input"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold mt-2"
                disabled={isLoading}
                data-ocid="setup.submit_button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Kredensial"
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-2">
                Sudah punya akun admin?{" "}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/login" })}
                  className="text-primary hover:underline"
                  data-ocid="setup.login_link"
                >
                  Login di sini
                </button>
              </p>
            </form>
          )}

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
