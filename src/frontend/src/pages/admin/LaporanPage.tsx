import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Clock, Home, Wallet } from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useGetAllKK, useGetIuranByBulanTahun } from "../../hooks/useQueries";
import {
  BULAN_NAMES,
  formatBulanTahun,
  formatRupiah,
  getCurrentBulan,
  getCurrentTahun,
} from "../../utils/format";

const TAHUN_OPTIONS = Array.from(
  { length: 5 },
  (_, i) => getCurrentTahun() - 2 + i,
);

export default function LaporanPage() {
  const [bulan, setBulan] = useState(getCurrentBulan());
  const [tahun, setTahun] = useState(getCurrentTahun());

  const { data: kkList = [], isLoading: loadingKK } = useGetAllKK();
  const { data: iuranList = [], isLoading: loadingIuran } =
    useGetIuranByBulanTahun(bulan, tahun);

  const isLoading = loadingKK || loadingIuran;

  // Summary stats
  const totalKK = kkList.length;
  const iuranMap = new Map(iuranList.map((i) => [i.kkId.toString(), i]));

  const kkLunas = iuranList.filter((i) => i.statusLunas).length;
  const kkBelumLunas = iuranList.filter((i) => !i.statusLunas).length;
  const totalTerkumpul = iuranList
    .filter((i) => i.statusLunas)
    .reduce((acc, i) => acc + Number(i.jumlah), 0);

  // KK yang sama sekali belum ada catatan iuran
  const kkBelumBayar = kkList.filter((kk) => {
    const iuran = iuranMap.get(kk.id.toString());
    return !iuran || !iuran.statusLunas;
  });

  return (
    <AdminLayout
      title="Laporan"
      subtitle={`Laporan iuran ${formatBulanTahun(bulan, tahun)}`}
    >
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex gap-3 items-center">
          <Select
            value={bulan.toString()}
            onValueChange={(v) => setBulan(Number(v))}
          >
            <SelectTrigger className="w-36" data-ocid="laporan.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BULAN_NAMES.map((b, i) => (
                <SelectItem key={b} value={(i + 1).toString()}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={tahun.toString()}
            onValueChange={(v) => setTahun(Number(v))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAHUN_OPTIONS.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Total KK",
              value: isLoading ? "—" : totalKK.toString(),
              icon: Home,
              color: "oklch(0.38 0.095 210)",
            },
            {
              label: "KK Lunas",
              value: isLoading ? "—" : kkLunas.toString(),
              icon: CheckCircle2,
              color: "oklch(0.52 0.15 150)",
            },
            {
              label: "KK Belum Lunas",
              value: isLoading ? "—" : kkBelumLunas.toString(),
              icon: Clock,
              color: "oklch(0.55 0.22 25)",
            },
            {
              label: "Total Iuran Terkumpul",
              value: isLoading ? "—" : formatRupiah(totalTerkumpul),
              icon: Wallet,
              color: "oklch(0.72 0.17 65)",
            },
          ].map((item) => (
            <Card key={item.label} className="shadow-card">
              <CardContent className="p-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: item.color }}
                >
                  <item.icon className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                </div>
                {isLoading ? (
                  <div className="space-y-1.5">
                    <Skeleton
                      className="h-6 w-20"
                      data-ocid="laporan.loading_state"
                    />
                    <Skeleton className="h-3.5 w-28" />
                  </div>
                ) : (
                  <>
                    <p className="text-xl font-display font-bold text-foreground">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.label}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* KK Belum Bayar */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-destructive w-[18px] h-[18px]" />
              KK Belum Bayar / Belum Lunas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-foreground">
                      No
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Kepala KK
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Blok
                    </TableHead>
                    <TableHead className="font-semibold text-foreground hidden md:table-cell">
                      Nomor KK
                    </TableHead>
                    <TableHead className="font-semibold text-foreground hidden md:table-cell">
                      No HP
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Keterangan
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    ["sk1", "sk2", "sk3"].map((sk) => (
                      <TableRow key={sk}>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : kkBelumBayar.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                        data-ocid="laporan.empty_state"
                      >
                        Semua KK sudah lunas! 🎉
                      </TableCell>
                    </TableRow>
                  ) : (
                    kkBelumBayar.map((kk, i) => {
                      const iuran = iuranMap.get(kk.id.toString());
                      return (
                        <TableRow
                          key={kk.id.toString()}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="text-muted-foreground">
                            {i + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {kk.namaKepala}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{kk.blokRumah}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell font-mono">
                            {kk.nomorKK}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                            {kk.noHP || "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            {!iuran ? (
                              <Badge
                                variant="outline"
                                className="text-muted-foreground"
                              >
                                Belum Tercatat
                              </Badge>
                            ) : (
                              <Badge
                                variant="destructive"
                                className="bg-destructive/10 text-destructive border-destructive/30"
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Belum Lunas
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* All Iuran for Period */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Wallet className="w-[18px] h-[18px] text-primary" />
              Semua Catatan Iuran — {formatBulanTahun(bulan, tahun)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-foreground">
                      Blok
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Kepala KK
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-right">
                      Jumlah
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-foreground hidden md:table-cell">
                      Tgl Bayar
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    ["sk1", "sk2", "sk3", "sk4"].map((sk) => (
                      <TableRow key={sk}>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-36" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24 ml-auto" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 mx-auto" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : iuranList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Tidak ada catatan iuran untuk periode ini
                      </TableCell>
                    </TableRow>
                  ) : (
                    iuranList.map((iuran) => {
                      const kk = kkList.find((k) => k.id === iuran.kkId);
                      return (
                        <TableRow
                          key={iuran.id.toString()}
                          className="hover:bg-muted/30"
                        >
                          <TableCell>
                            <Badge variant="secondary">
                              {kk?.blokRumah ?? "?"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {kk?.namaKepala ?? "—"}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatRupiah(iuran.jumlah)}
                          </TableCell>
                          <TableCell className="text-center">
                            {iuran.statusLunas ? (
                              <Badge className="bg-success/15 text-success border-success/30">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Lunas
                              </Badge>
                            ) : (
                              <Badge
                                variant="destructive"
                                className="bg-destructive/10 text-destructive border-destructive/30"
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Belum
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                            {iuran.statusLunas && iuran.tanggalBayar
                              ? iuran.tanggalBayar
                              : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
