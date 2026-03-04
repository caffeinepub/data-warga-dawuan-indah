import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  type Iuran,
  type KK,
  useCreateIuran,
  useDeleteIuran,
  useGetAllKK,
  useGetIuranByBulanTahun,
  useUpdateIuran,
} from "../../hooks/useQueries";
import {
  BULAN_NAMES,
  formatBulanTahun,
  formatRupiah,
  getCurrentBulan,
  getCurrentTahun,
} from "../../utils/format";

interface IuranFormData {
  kkId: string;
  bulan: string;
  tahun: string;
  jumlah: string;
  statusLunas: boolean;
  tanggalBayar: string;
  keterangan: string;
}

const DEFAULT_IURAN = 150000;

function defaultForm(bulan: number, tahun: number): IuranFormData {
  return {
    kkId: "",
    bulan: bulan.toString(),
    tahun: tahun.toString(),
    jumlah: DEFAULT_IURAN.toString(),
    statusLunas: false,
    tanggalBayar: new Date().toISOString().split("T")[0],
    keterangan: "",
  };
}

const TAHUN_OPTIONS = Array.from(
  { length: 5 },
  (_, i) => getCurrentTahun() - 2 + i,
);

export default function IuranPage() {
  const [filterBulan, setFilterBulan] = useState(getCurrentBulan());
  const [filterTahun, setFilterTahun] = useState(getCurrentTahun());

  const { data: kkList = [] } = useGetAllKK();
  const { data: iuranList = [], isLoading } = useGetIuranByBulanTahun(
    filterBulan,
    filterTahun,
  );
  const createIuran = useCreateIuran();
  const updateIuran = useUpdateIuran();
  const deleteIuran = useDeleteIuran();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIuran, setEditingIuran] = useState<Iuran | null>(null);
  const [form, setForm] = useState<IuranFormData>(() =>
    defaultForm(filterBulan, filterTahun),
  );
  const [confirmId, setConfirmId] = useState<bigint | null>(null);

  const kkMap = new Map<string, KK>(kkList.map((kk) => [kk.id.toString(), kk]));

  const totalTerkumpul = iuranList
    .filter((i) => i.statusLunas)
    .reduce((a, b) => a + Number(b.jumlah), 0);
  const jumlahLunas = iuranList.filter((i) => i.statusLunas).length;
  const jumlahBelum = iuranList.filter((i) => !i.statusLunas).length;

  function openAdd() {
    setEditingIuran(null);
    setForm(defaultForm(filterBulan, filterTahun));
    setDialogOpen(true);
  }

  function openEdit(iuran: Iuran) {
    setEditingIuran(iuran);
    setForm({
      kkId: iuran.kkId.toString(),
      bulan: iuran.bulan.toString(),
      tahun: iuran.tahun.toString(),
      jumlah: iuran.jumlah.toString(),
      statusLunas: iuran.statusLunas,
      tanggalBayar: iuran.tanggalBayar,
      keterangan: iuran.keterangan,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kkId) return;
    try {
      const payload = {
        kkId: BigInt(form.kkId),
        bulan: BigInt(form.bulan),
        tahun: BigInt(form.tahun),
        jumlah: BigInt(form.jumlah),
        statusLunas: form.statusLunas,
        tanggalBayar: form.tanggalBayar,
        keterangan: form.keterangan,
      };
      if (editingIuran) {
        await updateIuran.mutateAsync({ id: editingIuran.id, ...payload });
        toast.success("Data iuran berhasil diperbarui");
      } else {
        await createIuran.mutateAsync(payload);
        toast.success("Data iuran berhasil ditambahkan");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    try {
      await deleteIuran.mutateAsync(confirmId);
      toast.success("Data iuran berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus data iuran");
    } finally {
      setConfirmId(null);
    }
  }

  const isPending = createIuran.isPending || updateIuran.isPending;

  return (
    <AdminLayout
      title="Iuran Warga"
      subtitle={`Data iuran ${formatBulanTahun(filterBulan, filterTahun)}`}
    >
      <div className="space-y-4">
        {/* Filter + Add */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Select
              value={filterBulan.toString()}
              onValueChange={(v) => setFilterBulan(Number(v))}
            >
              <SelectTrigger className="w-36" data-ocid="iuran.select">
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
              value={filterTahun.toString()}
              onValueChange={(v) => setFilterTahun(Number(v))}
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
          <Button onClick={openAdd} data-ocid="iuran.add_button">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Iuran
          </Button>
        </div>

        {/* Summary cards */}
        {!isLoading && iuranList.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="shadow-xs border border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-display font-bold text-foreground">
                  {formatRupiah(totalTerkumpul)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Total Terkumpul
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-xs border border-border bg-success/5">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-display font-bold text-success">
                  {jumlahLunas}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">KK Lunas</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs border border-border bg-destructive/5">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-display font-bold text-destructive">
                  {jumlahBelum}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Belum Lunas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table data-ocid="iuran.table">
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
                  <TableHead className="font-semibold text-foreground hidden lg:table-cell">
                    Keterangan
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  ["sk1", "sk2", "sk3", "sk4", "sk5"].map((sk) => (
                    <TableRow key={sk} data-ocid="iuran.loading_state">
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
                      <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : iuranList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="iuran.empty_state"
                    >
                      Tidak ada data iuran untuk periode ini
                    </TableCell>
                  </TableRow>
                ) : (
                  iuranList.map((iuran, index) => {
                    const kk = kkMap.get(iuran.kkId.toString());
                    const itemNum = index + 1;
                    return (
                      <TableRow
                        key={iuran.id.toString()}
                        className="hover:bg-muted/30"
                        data-ocid={`iuran.item.${itemNum}`}
                      >
                        <TableCell>
                          <Badge variant="secondary">
                            {kk?.blokRumah ?? "?"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {kk?.namaKepala ?? "—"}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
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
                              Belum Lunas
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                          {iuran.statusLunas && iuran.tanggalBayar
                            ? iuran.tanggalBayar
                            : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden lg:table-cell max-w-xs truncate">
                          {iuran.keterangan || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => openEdit(iuran)}
                              data-ocid={`iuran.edit_button.${itemNum}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setConfirmId(iuran.id)}
                              data-ocid={`iuran.delete_button.${itemNum}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {!isLoading && (
            <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
              {iuranList.length} catatan iuran
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="iuran.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingIuran ? "Edit Data Iuran" : "Tambah Data Iuran"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Kartu Keluarga</Label>
              <Select
                value={form.kkId}
                onValueChange={(v) => setForm((p) => ({ ...p, kkId: v }))}
                required
              >
                <SelectTrigger data-ocid="iuran.select">
                  <SelectValue placeholder="Pilih KK" />
                </SelectTrigger>
                <SelectContent>
                  {kkList.map((kk) => (
                    <SelectItem key={kk.id.toString()} value={kk.id.toString()}>
                      {kk.namaKepala} — {kk.blokRumah}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Bulan</Label>
                <Select
                  value={form.bulan}
                  onValueChange={(v) => setForm((p) => ({ ...p, bulan: v }))}
                >
                  <SelectTrigger>
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
              </div>
              <div className="space-y-1.5">
                <Label>Tahun</Label>
                <Select
                  value={form.tahun}
                  onValueChange={(v) => setForm((p) => ({ ...p, tahun: v }))}
                >
                  <SelectTrigger>
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
            </div>
            <div className="space-y-1.5">
              <Label>Jumlah Iuran (Rp)</Label>
              <Input
                type="number"
                min="0"
                value={form.jumlah}
                onChange={(e) =>
                  setForm((p) => ({ ...p, jumlah: e.target.value }))
                }
                required
                data-ocid="iuran.input"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.statusLunas}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, statusLunas: v }))
                }
                data-ocid="iuran.switch"
              />
              <Label>Sudah Lunas</Label>
            </div>
            {form.statusLunas && (
              <div className="space-y-1.5">
                <Label>Tanggal Bayar</Label>
                <Input
                  type="date"
                  value={form.tanggalBayar}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tanggalBayar: e.target.value }))
                  }
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Keterangan</Label>
              <Textarea
                placeholder="Catatan tambahan (opsional)"
                value={form.keterangan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, keterangan: e.target.value }))
                }
                rows={2}
                data-ocid="iuran.textarea"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="iuran.cancel_button"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                data-ocid="iuran.submit_button"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingIuran ? "Simpan Perubahan" : "Tambah Iuran"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title="Hapus Data Iuran?"
        description="Data iuran ini akan dihapus secara permanen."
        onConfirm={handleDelete}
        isPending={deleteIuran.isPending}
        ocidPrefix="iuran"
      />
    </AdminLayout>
  );
}
