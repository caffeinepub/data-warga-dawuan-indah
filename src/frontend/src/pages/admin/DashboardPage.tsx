import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import AdminLayout from "../../components/AdminLayout";
import { useDashboardStats } from "../../hooks/useQueries";
import {
  formatBulanTahun,
  formatRupiah,
  getCurrentBulan,
  getCurrentTahun,
} from "../../utils/format";

const bulan = getCurrentBulan();
const tahun = getCurrentTahun();

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  ocid: string;
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  ocid,
  isLoading,
}: StatCardProps) {
  return (
    <Card className="shadow-card border border-border" data-ocid={ocid}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: color }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-display font-bold text-foreground">
              {value}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

const quickLinks = [
  {
    title: "Data KK",
    desc: "Kelola kartu keluarga",
    to: "/admin/kk",
    icon: Home,
    color: "oklch(0.38 0.095 210)",
  },
  {
    title: "Data Warga",
    desc: "Kelola data penduduk",
    to: "/admin/warga",
    icon: Users,
    color: "oklch(0.52 0.15 150)",
  },
  {
    title: "Iuran",
    desc: "Catat pembayaran iuran",
    to: "/admin/iuran",
    icon: Wallet,
    color: "oklch(0.72 0.17 65)",
  },
  {
    title: "Laporan",
    desc: "Lihat laporan bulanan",
    to: "/admin/laporan",
    icon: TrendingUp,
    color: "oklch(0.55 0.22 25)",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats(bulan, tahun);

  const statCards = [
    {
      title: "Total Kepala Keluarga",
      value: stats ? stats.totalKK.toString() : "—",
      icon: Home,
      color: "oklch(0.38 0.095 210)",
      ocid: "dashboard.kk_card",
    },
    {
      title: "Total Warga",
      value: stats ? stats.totalWarga.toString() : "—",
      icon: Users,
      color: "oklch(0.52 0.15 150)",
      ocid: "dashboard.warga_card",
    },
    {
      title: `Iuran Terkumpul ${formatBulanTahun(bulan, tahun)}`,
      value: stats ? formatRupiah(stats.totalIuran) : "—",
      icon: Wallet,
      color: "oklch(0.72 0.17 65)",
      ocid: "dashboard.iuran_card",
    },
    {
      title: "Sudah Lunas",
      value: stats ? stats.jumlahLunas.toString() : "—",
      icon: CheckCircle2,
      color: "oklch(0.52 0.15 150)",
      ocid: "dashboard.lunas_card",
    },
    {
      title: "Belum Lunas",
      value: stats ? stats.jumlahBelumLunas.toString() : "—",
      icon: Clock,
      color: "oklch(0.55 0.22 25)",
      ocid: "dashboard.belum_lunas_card",
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Ringkasan data bulan ${formatBulanTahun(bulan, tahun)}`}
    >
      <div className="space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {statCards.map((card, i) => (
            <motion.div
              key={card.ocid}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <StatCard {...card} isLoading={isLoading} />
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Navigasi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickLinks.map((link) => (
                <Button
                  key={link.to}
                  variant="outline"
                  className="h-auto flex-col items-start p-4 gap-2.5 hover:border-primary/30 hover:bg-primary/5 transition-all"
                  onClick={() =>
                    navigate({
                      to: link.to as
                        | "/admin/kk"
                        | "/admin/warga"
                        | "/admin/iuran"
                        | "/admin/laporan",
                    })
                  }
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: link.color }}
                  >
                    <link.icon className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                  </div>
                  <div className="text-left w-full">
                    <p className="font-semibold text-foreground text-sm">
                      {link.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{link.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground self-end" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Period info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="shadow-card bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-foreground text-sm">
                  Periode Aktif: {formatBulanTahun(bulan, tahun)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Data iuran yang ditampilkan adalah untuk bulan ini.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate({ to: "/admin/iuran" })}
              >
                Lihat Iuran
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
