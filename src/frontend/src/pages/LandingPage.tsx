import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  MapPin,
  Phone,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Users,
    title: "Data Penduduk",
    desc: "Kelola data KK dan warga secara terstruktur dan mudah diakses.",
  },
  {
    icon: CreditCard,
    title: "Iuran Warga",
    desc: "Catat pembayaran iuran bulanan dan pantau status lunas/belum.",
  },
  {
    icon: FileText,
    title: "Laporan Lengkap",
    desc: "Laporan bulanan iuran dan rekap data warga yang komprehensif.",
  },
  {
    icon: Shield,
    title: "Akses Aman",
    desc: "Login admin terproteksi untuk keamanan data warga.",
  },
];

const contacts = [
  { role: "Ketua RT 01", name: "Bapak Ahmad Fauzi", phone: "0812-3456-7890" },
  { role: "Ketua RT 02", name: "Bapak Suratman", phone: "0821-9876-5432" },
  { role: "Ketua RW 05", name: "Bapak Hendra Wijaya", phone: "0831-1234-5678" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display font-bold text-foreground text-sm leading-tight block">
                Perumahan Dawuan Indah
              </span>
              <span className="text-xs text-muted-foreground">
                Sistem Informasi Warga
              </span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => navigate({ to: "/login" })}
            data-ocid="landing.login_button"
          >
            Masuk Admin
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.055 215) 0%, oklch(0.32 0.08 210) 60%, oklch(0.38 0.095 210) 100%)",
          }}
        />
        {/* Decorative geometric pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
              <pattern
                id="dots"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 rounded-full px-4 py-1.5 text-sm mb-6 font-medium">
              <MapPin className="w-4 h-4" />
              RT 01–02 / RW 05 · Dawuan Indah
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Sistem Informasi
              <br />
              <span className="text-accent">Warga Perumahan</span>
              <br />
              Dawuan Indah
            </h1>
            <p className="text-white/75 text-lg mb-8 leading-relaxed">
              Platform digital untuk pengelolaan data penduduk, kartu keluarga,
              dan iuran warga yang terintegrasi dan mudah digunakan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-elevated"
                onClick={() => navigate({ to: "/login" })}
                data-ocid="landing.login_button"
              >
                <Shield className="w-4 h-4 mr-2" />
                Masuk Area Admin
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="relative h-12">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1440 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 48L720 0L1440 48H0Z" fill="oklch(0.98 0.004 200)" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Fitur Unggulan
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Semua kebutuhan manajemen perumahan dalam satu platform yang
            terintegrasi.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-elevated transition-shadow"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Kontak Pengurus
            </h2>
            <p className="text-muted-foreground">
              Hubungi pengurus untuk informasi lebih lanjut
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {contacts.map((c, i) => (
              <motion.div
                key={c.role}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-xl p-5 shadow-xs border border-border text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                  {c.role}
                </p>
                <p className="font-display font-semibold text-foreground mb-2">
                  {c.name}
                </p>
                <a
                  href={`tel:${c.phone.replace(/-/g, "")}`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {c.phone}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden relative"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.055 215), oklch(0.38 0.095 210))",
          }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              aria-hidden="true"
            >
              <circle cx="150" cy="50" r="80" fill="white" />
              <circle cx="50" cy="150" r="60" fill="white" />
            </svg>
          </div>
          <div className="relative p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Siap Mengelola Data Warga?
              </h2>
              <p className="text-white/70">
                Masuk sebagai admin untuk mengakses semua fitur manajemen.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-elevated shrink-0"
              onClick={() => navigate({ to: "/login" })}
              data-ocid="landing.login_button"
            >
              <Shield className="w-4 h-4 mr-2" />
              Masuk Sekarang
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home className="w-4 h-4" />
            <span>© {new Date().getFullYear()} Perumahan Dawuan Indah</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
