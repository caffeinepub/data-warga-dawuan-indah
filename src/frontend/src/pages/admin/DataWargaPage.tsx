import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  type KK,
  type Warga,
  useCreateWarga,
  useDeleteWarga,
  useGetAllKK,
  useGetAllWarga,
  useUpdateWarga,
} from "../../hooks/useQueries";

interface WargaFormData {
  kkId: string;
  nik: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  hubunganKK: string;
  statusAktif: boolean;
}

const defaultForm: WargaFormData = {
  kkId: "",
  nik: "",
  namaLengkap: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "Laki-laki",
  hubunganKK: "Kepala Keluarga",
  statusAktif: true,
};

const hubunganOptions = [
  "Kepala Keluarga",
  "Istri",
  "Anak",
  "Orang Tua",
  "Mertua",
  "Cucu",
  "Saudara",
  "Lainnya",
];

export default function DataWargaPage() {
  const { data: kkList = [] } = useGetAllKK();
  const { data: wargaList = [], isLoading } = useGetAllWarga();
  const createWarga = useCreateWarga();
  const updateWarga = useUpdateWarga();
  const deleteWarga = useDeleteWarga();

  const [search, setSearch] = useState("");
  const [filterKK, setFilterKK] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);
  const [form, setForm] = useState<WargaFormData>(defaultForm);
  const [confirmId, setConfirmId] = useState<bigint | null>(null);

  const kkMap = new Map<string, KK>(kkList.map((kk) => [kk.id.toString(), kk]));

  const filtered = wargaList.filter((w) => {
    const matchSearch =
      w.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      w.nik.includes(search);
    const matchKK = filterKK === "all" || w.kkId.toString() === filterKK;
    return matchSearch && matchKK;
  });

  function openAdd() {
    setEditingWarga(null);
    setForm(defaultForm);
    setDialogOpen(true);
  }

  function openEdit(w: Warga) {
    setEditingWarga(w);
    setForm({
      kkId: w.kkId.toString(),
      nik: w.nik,
      namaLengkap: w.namaLengkap,
      tempatLahir: w.tempatLahir,
      tanggalLahir: w.tanggalLahir,
      jenisKelamin: w.jenisKelamin,
      hubunganKK: w.hubunganKK,
      statusAktif: w.statusAktif,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kkId) return;
    try {
      const payload = {
        kkId: BigInt(form.kkId),
        nik: form.nik,
        namaLengkap: form.namaLengkap,
        tempatLahir: form.tempatLahir,
        tanggalLahir: form.tanggalLahir,
        jenisKelamin: form.jenisKelamin,
        hubunganKK: form.hubunganKK,
        statusAktif: form.statusAktif,
      };
      if (editingWarga) {
        await updateWarga.mutateAsync({ id: editingWarga.id, ...payload });
        toast.success("Data warga berhasil diperbarui");
      } else {
        await createWarga.mutateAsync(payload);
        toast.success("Data warga berhasil ditambahkan");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    try {
      await deleteWarga.mutateAsync(confirmId);
      toast.success("Data warga berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus data warga");
    } finally {
      setConfirmId(null);
    }
  }

  async function handleToggleStatus(w: Warga) {
    try {
      await updateWarga.mutateAsync({
        id: w.id,
        kkId: w.kkId,
        nik: w.nik,
        namaLengkap: w.namaLengkap,
        tempatLahir: w.tempatLahir,
        tanggalLahir: w.tanggalLahir,
        jenisKelamin: w.jenisKelamin,
        hubunganKK: w.hubunganKK,
        statusAktif: !w.statusAktif,
      });
      toast.success(`Status ${w.namaLengkap} diperbarui`);
    } catch {
      toast.error("Gagal memperbarui status");
    }
  }

  const isPending = createWarga.isPending || updateWarga.isPending;

  return (
    <AdminLayout title="Data Warga" subtitle="Manajemen Data Penduduk">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-ocid="warga.search_input"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Select value={filterKK} onValueChange={setFilterKK}>
              <SelectTrigger className="w-52" data-ocid="warga.select">
                <SelectValue placeholder="Filter KK" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua KK</SelectItem>
                {kkList.map((kk) => (
                  <SelectItem key={kk.id.toString()} value={kk.id.toString()}>
                    {kk.namaKepala} ({kk.blokRumah})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openAdd} data-ocid="warga.add_button">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Warga
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table data-ocid="warga.table">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">
                    NIK
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Nama Lengkap
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">
                    Jenis Kelamin
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden sm:table-cell">
                    Hubungan KK
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden lg:table-cell">
                    No KK / Kepala
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  ["sk1", "sk2", "sk3", "sk4", "sk5"].map((sk) => (
                    <TableRow key={sk} data-ocid="warga.loading_state">
                      <TableCell>
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="warga.empty_state"
                    >
                      {search || filterKK !== "all"
                        ? "Tidak ada hasil yang cocok"
                        : "Belum ada data warga"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((w, index) => {
                    const kk = kkMap.get(w.kkId.toString());
                    const itemNum = index + 1;
                    return (
                      <TableRow
                        key={w.id.toString()}
                        className="hover:bg-muted/30"
                        data-ocid={`warga.item.${itemNum}`}
                      >
                        <TableCell className="font-mono text-sm">
                          {w.nik}
                        </TableCell>
                        <TableCell className="font-medium">
                          {w.namaLengkap}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {w.jenisKelamin}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {w.hubunganKK}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {kk
                            ? `${kk.nomorKK.slice(-6)} / ${kk.namaKepala}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={w.statusAktif}
                            onCheckedChange={() => handleToggleStatus(w)}
                            className="data-[state=checked]:bg-success"
                            data-ocid={`warga.switch.${itemNum}`}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => openEdit(w)}
                              data-ocid={`warga.edit_button.${itemNum}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setConfirmId(w.id)}
                              data-ocid={`warga.delete_button.${itemNum}`}
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
              {filtered.length} dari {wargaList.length} warga
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="warga.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingWarga ? "Edit Data Warga" : "Tambah Data Warga"}
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
                <SelectTrigger data-ocid="warga.select">
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
                <Label>NIK</Label>
                <Input
                  placeholder="16 digit NIK"
                  value={form.nik}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nik: e.target.value }))
                  }
                  required
                  data-ocid="warga.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Jenis Kelamin</Label>
                <Select
                  value={form.jenisKelamin}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, jenisKelamin: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Nama Lengkap</Label>
              <Input
                placeholder="Nama lengkap sesuai KTP"
                value={form.namaLengkap}
                onChange={(e) =>
                  setForm((p) => ({ ...p, namaLengkap: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tempat Lahir</Label>
                <Input
                  placeholder="Kota/kab lahir"
                  value={form.tempatLahir}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tempatLahir: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tanggal Lahir</Label>
                <Input
                  type="date"
                  value={form.tanggalLahir}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tanggalLahir: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Hubungan dengan KK</Label>
              <Select
                value={form.hubunganKK}
                onValueChange={(v) => setForm((p) => ({ ...p, hubunganKK: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hubunganOptions.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Switch
                checked={form.statusAktif}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, statusAktif: v }))
                }
                data-ocid="warga.switch"
              />
              <Label className="cursor-pointer">Status Aktif</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="warga.cancel_button"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                data-ocid="warga.submit_button"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingWarga ? "Simpan Perubahan" : "Tambah Warga"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title="Hapus Data Warga?"
        description="Data warga akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        isPending={deleteWarga.isPending}
        ocidPrefix="warga"
      />
    </AdminLayout>
  );
}
