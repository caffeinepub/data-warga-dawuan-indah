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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil, Plus, Search, Trash2, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  type KK,
  useCreateKK,
  useDeleteKK,
  useGetAllKK,
  useGetAllWarga,
  useUpdateKK,
} from "../../hooks/useQueries";

interface KKFormData {
  nomorKK: string;
  namaKepala: string;
  alamat: string;
  blokRumah: string;
  noHP: string;
}

const defaultForm: KKFormData = {
  nomorKK: "",
  namaKepala: "",
  alamat: "",
  blokRumah: "",
  noHP: "",
};

export default function DataKKPage() {
  const { data: kkList = [], isLoading } = useGetAllKK();
  const { data: allWarga = [] } = useGetAllWarga();
  const createKK = useCreateKK();
  const updateKK = useUpdateKK();
  const deleteKK = useDeleteKK();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKK, setEditingKK] = useState<KK | null>(null);
  const [form, setForm] = useState<KKFormData>(defaultForm);
  const [confirmId, setConfirmId] = useState<bigint | null>(null);
  const [wargaSheetKK, setWargaSheetKK] = useState<KK | null>(null);

  const filtered = kkList.filter(
    (kk) =>
      kk.namaKepala.toLowerCase().includes(search.toLowerCase()) ||
      kk.nomorKK.includes(search) ||
      kk.blokRumah.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditingKK(null);
    setForm(defaultForm);
    setDialogOpen(true);
  }

  function openEdit(kk: KK) {
    setEditingKK(kk);
    setForm({
      nomorKK: kk.nomorKK,
      namaKepala: kk.namaKepala,
      alamat: kk.alamat,
      blokRumah: kk.blokRumah,
      noHP: kk.noHP,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingKK) {
        await updateKK.mutateAsync({ id: editingKK.id, ...form });
        toast.success("Data KK berhasil diperbarui");
      } else {
        await createKK.mutateAsync(form);
        toast.success("Data KK berhasil ditambahkan");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    }
  }

  async function handleDelete() {
    if (!confirmId) return;
    try {
      await deleteKK.mutateAsync(confirmId);
      toast.success("Data KK berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus data KK");
    } finally {
      setConfirmId(null);
    }
  }

  const wargaForSheet = wargaSheetKK
    ? allWarga.filter((w) => w.kkId === wargaSheetKK.id)
    : [];

  const isPending = createKK.isPending || updateKK.isPending;

  return (
    <AdminLayout title="Data KK" subtitle="Manajemen Kartu Keluarga">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, nomor KK, blok..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="kk.search_input"
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
          <Button onClick={openAdd} data-ocid="kk.add_button">
            <Plus className="w-4 h-4 mr-2" />
            Tambah KK
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table data-ocid="kk.table">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">
                    Nomor KK
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Kepala Keluarga
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Blok
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">
                    Alamat
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">
                    No HP
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Warga
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  ["sk1", "sk2", "sk3", "sk4", "sk5"].map((sk) => (
                    <TableRow key={sk} data-ocid="kk.loading_state">
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8 mx-auto" />
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
                      data-ocid="kk.empty_state"
                    >
                      {search
                        ? "Tidak ada hasil yang cocok"
                        : "Belum ada data KK"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((kk, index) => {
                    const jumlahWarga = allWarga.filter(
                      (w) => w.kkId === kk.id,
                    ).length;
                    const itemNum = index + 1;
                    return (
                      <TableRow
                        key={kk.id.toString()}
                        className="hover:bg-muted/30 transition-colors"
                        data-ocid={`kk.item.${itemNum}`}
                      >
                        <TableCell className="font-mono text-sm">
                          {kk.nomorKK}
                        </TableCell>
                        <TableCell className="font-medium">
                          {kk.namaKepala}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-medium">
                            {kk.blokRumah}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm hidden md:table-cell max-w-xs truncate">
                          {kk.alamat}
                        </TableCell>
                        <TableCell className="text-sm hidden md:table-cell">
                          {kk.noHP || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            type="button"
                            onClick={() => setWargaSheetKK(kk)}
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <Users className="w-3.5 h-3.5" />
                            {jumlahWarga}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => openEdit(kk)}
                              data-ocid={`kk.edit_button.${itemNum}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setConfirmId(kk.id)}
                              data-ocid={`kk.delete_button.${itemNum}`}
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
              {filtered.length} dari {kkList.length} data KK
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="kk.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingKK ? "Edit Data KK" : "Tambah Data KK"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Nomor KK</Label>
                <Input
                  placeholder="16 digit nomor KK"
                  value={form.nomorKK}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nomorKK: e.target.value }))
                  }
                  required
                  data-ocid="kk.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Blok Rumah</Label>
                <Input
                  placeholder="Mis. A1, B2"
                  value={form.blokRumah}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, blokRumah: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Nama Kepala Keluarga</Label>
              <Input
                placeholder="Nama lengkap kepala keluarga"
                value={form.namaKepala}
                onChange={(e) =>
                  setForm((p) => ({ ...p, namaKepala: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Alamat</Label>
              <Input
                placeholder="Alamat lengkap"
                value={form.alamat}
                onChange={(e) =>
                  setForm((p) => ({ ...p, alamat: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nomor HP</Label>
              <Input
                placeholder="08xx-xxxx-xxxx"
                value={form.noHP}
                onChange={(e) =>
                  setForm((p) => ({ ...p, noHP: e.target.value }))
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="kk.cancel_button"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                data-ocid="kk.submit_button"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingKK ? "Simpan Perubahan" : "Tambah KK"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title="Hapus Data KK?"
        description="Tindakan ini akan menghapus data KK dan tidak dapat dibatalkan. Pastikan tidak ada warga yang terdaftar dalam KK ini."
        onConfirm={handleDelete}
        isPending={deleteKK.isPending}
        ocidPrefix="kk"
      />

      {/* Warga Sheet */}
      <Sheet
        open={wargaSheetKK !== null}
        onOpenChange={(o) => !o && setWargaSheetKK(null)}
      >
        <SheetContent data-ocid="kk.sheet">
          <SheetHeader>
            <SheetTitle className="font-display">
              Warga KK — {wargaSheetKK?.namaKepala}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {wargaForSheet.length === 0 ? (
              <p
                className="text-muted-foreground text-sm py-4 text-center"
                data-ocid="kk.warga.empty_state"
              >
                Belum ada warga terdaftar
              </p>
            ) : (
              wargaForSheet.map((w) => (
                <div
                  key={w.id.toString()}
                  className="p-3 rounded-lg border border-border bg-muted/30"
                >
                  <p className="font-medium text-sm">{w.namaLengkap}</p>
                  <p className="text-xs text-muted-foreground">
                    {w.hubunganKK} · {w.jenisKelamin}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {w.nik}
                  </p>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
