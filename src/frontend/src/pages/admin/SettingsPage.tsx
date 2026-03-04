import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Home,
  Image as ImageIcon,
  Loader2,
  Lock,
  Phone,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { useActor } from "../../hooks/useActor";
import {
  type ExtraUser,
  type KontakPengurus,
  settingsStore,
} from "../../utils/settingsStore";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ============================================================
// Tab 1: Ganti Logo
// ============================================================
function TabGantiLogo() {
  const [logoUrl, setLogoUrl] = useState(() => settingsStore.getLogoUrl());
  const [inputUrl, setInputUrl] = useState(() => settingsStore.getLogoUrl());
  const [imgError, setImgError] = useState(false);

  function handleSave() {
    settingsStore.setLogoUrl(inputUrl.trim());
    setLogoUrl(inputUrl.trim());
    setImgError(false);
    toast.success("Logo berhasil disimpan.");
  }

  return (
    <div className="space-y-6 max-w-lg">
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            Ganti Logo Perumahan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Preview */}
          <div className="flex flex-col items-center gap-3">
            <div
              data-ocid="settings.logo_preview"
              className="w-24 h-24 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden"
            >
              {logoUrl && !imgError ? (
                <img
                  src={logoUrl}
                  alt="Logo Perumahan"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Home className="w-10 h-10 text-muted-foreground/40" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">Pratinjau Logo</p>
          </div>

          {/* Input URL */}
          <div className="space-y-1.5">
            <Label htmlFor="logo-url" className="text-sm font-medium">
              URL Gambar Logo
            </Label>
            <Input
              id="logo-url"
              type="url"
              placeholder="https://example.com/logo.png"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setImgError(false);
              }}
              data-ocid="settings.logo_input"
            />
            <p className="text-xs text-muted-foreground">
              Masukkan URL gambar (PNG, JPG, SVG). Logo akan ditampilkan di
              header dan sidebar.
            </p>
          </div>

          <Button
            onClick={handleSave}
            className="w-full"
            data-ocid="settings.logo_save_button"
          >
            Simpan Logo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// Tab 2: Kontak Pengurus
// ============================================================
interface KontakDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: KontakPengurus | null;
  onSave: (data: Omit<KontakPengurus, "id">) => void;
}

function KontakDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: KontakDialogProps) {
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [jabatan, setJabatan] = useState(initial?.jabatan ?? "");
  const [noHP, setNoHP] = useState(initial?.noHP ?? "");

  // Reset when dialog opens
  function handleOpenChange(val: boolean) {
    if (val) {
      setNama(initial?.nama ?? "");
      setJabatan(initial?.jabatan ?? "");
      setNoHP(initial?.noHP ?? "");
    }
    onOpenChange(val);
  }

  function handleSubmit() {
    if (!nama.trim() || !jabatan.trim() || !noHP.trim()) {
      toast.error("Semua field wajib diisi.");
      return;
    }
    onSave({ nama: nama.trim(), jabatan: jabatan.trim(), noHP: noHP.trim() });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-ocid="settings.kontak_dialog" className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">
            {initial ? "Edit Kontak" : "Tambah Kontak Pengurus"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="kontak-nama">Nama Lengkap</Label>
            <Input
              id="kontak-nama"
              placeholder="Bapak Ahmad Fauzi"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              data-ocid="settings.kontak_nama_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="kontak-jabatan">Jabatan</Label>
            <Input
              id="kontak-jabatan"
              placeholder="Ketua RT 01"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              data-ocid="settings.kontak_jabatan_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="kontak-nohp">Nomor HP</Label>
            <Input
              id="kontak-nohp"
              placeholder="0812-3456-7890"
              value={noHP}
              onChange={(e) => setNoHP(e.target.value)}
              data-ocid="settings.kontak_nohp_input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="settings.kontak_cancel_button"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            data-ocid="settings.kontak_save_button"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TabKontakPengurus() {
  const [list, setList] = useState<KontakPengurus[]>(() =>
    settingsStore.getKontakPengurus(),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<KontakPengurus | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KontakPengurus | null>(null);

  function openAdd() {
    setEditItem(null);
    setDialogOpen(true);
  }

  function openEdit(item: KontakPengurus) {
    setEditItem(item);
    setDialogOpen(true);
  }

  function handleSave(data: Omit<KontakPengurus, "id">) {
    if (editItem) {
      settingsStore.updateKontakPengurus(editItem.id, data);
      toast.success("Kontak berhasil diperbarui.");
    } else {
      settingsStore.addKontakPengurus(data);
      toast.success("Kontak berhasil ditambahkan.");
    }
    setList(settingsStore.getKontakPengurus());
  }

  function handleDelete(id: string) {
    settingsStore.deleteKontakPengurus(id);
    setList(settingsStore.getKontakPengurus());
    setDeleteTarget(null);
    toast.success("Kontak berhasil dihapus.");
  }

  const ocidMap: Record<number, { item: string; edit: string; del: string }> = {
    0: {
      item: "settings.kontak_item.1",
      edit: "settings.kontak_edit_button.1",
      del: "settings.kontak_delete_button.1",
    },
    1: {
      item: "settings.kontak_item.2",
      edit: "settings.kontak_edit_button.2",
      del: "settings.kontak_delete_button.2",
    },
    2: {
      item: "settings.kontak_item.3",
      edit: "settings.kontak_edit_button.3",
      del: "settings.kontak_delete_button.3",
    },
    3: {
      item: "settings.kontak_item.4",
      edit: "settings.kontak_edit_button.4",
      del: "settings.kontak_delete_button.4",
    },
    4: {
      item: "settings.kontak_item.5",
      edit: "settings.kontak_edit_button.5",
      del: "settings.kontak_delete_button.5",
    },
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Kontak Pengurus
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kontak yang ditampilkan di halaman beranda.
          </p>
        </div>
        <Button
          size="sm"
          onClick={openAdd}
          data-ocid="settings.kontak_add_button"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Kontak
        </Button>
      </div>

      {list.length === 0 ? (
        <div
          data-ocid="settings.kontak_empty_state"
          className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border"
        >
          <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            Belum ada kontak pengurus
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tambahkan kontak pengurus untuk ditampilkan di beranda.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((item, i) => {
            const ocids = ocidMap[i] ?? {
              item: `settings.kontak_item.${i + 1}`,
              edit: `settings.kontak_edit_button.${i + 1}`,
              del: `settings.kontak_delete_button.${i + 1}`,
            };
            return (
              <Card key={item.id} className="shadow-xs" data-ocid={ocids.item}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {item.nama}
                    </p>
                    <p className="text-xs text-primary font-medium uppercase tracking-wide">
                      {item.jabatan}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {item.noHP}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(item)}
                      data-ocid={ocids.edit}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(item)}
                      data-ocid={ocids.del}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <KontakDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editItem}
        onSave={handleSave}
      />

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="settings.kontak_delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Hapus Kontak?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Yakin ingin menghapus kontak <strong>{deleteTarget?.nama}</strong>?
            Tindakan ini tidak bisa dibatalkan.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              data-ocid="settings.kontak_cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
              data-ocid="settings.kontak_confirm_button"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// Tab 3: Manajemen User
// ============================================================
function TabManajemenUser() {
  const [users, setUsers] = useState<ExtraUser[]>(() =>
    settingsStore.getExtraUsers(),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExtraUser | null>(null);

  function resetForm() {
    setNamaLengkap("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleAddUser() {
    if (
      !namaLengkap.trim() ||
      !username.trim() ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Semua field wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }
    const existing = settingsStore.findUser(username.trim());
    if (existing) {
      toast.error("Username sudah digunakan.");
      return;
    }
    setIsSubmitting(true);
    try {
      const hash = await hashPassword(password);
      settingsStore.addExtraUser({
        username: username.trim(),
        passwordHash: hash,
        namaLengkap: namaLengkap.trim(),
      });
      setUsers(settingsStore.getExtraUsers());
      toast.success("User berhasil ditambahkan.");
      resetForm();
      setDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDeleteUser(u: ExtraUser) {
    settingsStore.deleteExtraUser(u.username);
    setUsers(settingsStore.getExtraUsers());
    setDeleteTarget(null);
    toast.success("User berhasil dihapus.");
  }

  const ocidMap: Record<number, { item: string; del: string }> = {
    0: { item: "settings.user_item.1", del: "settings.user_delete_button.1" },
    1: { item: "settings.user_item.2", del: "settings.user_delete_button.2" },
    2: { item: "settings.user_item.3", del: "settings.user_delete_button.3" },
    3: { item: "settings.user_item.4", del: "settings.user_delete_button.4" },
    4: { item: "settings.user_item.5", del: "settings.user_delete_button.5" },
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Manajemen User
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Admin utama dikelola di halaman setup. Di sini Anda bisa menambah
            user tambahan.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          data-ocid="settings.user_add_button"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah User
        </Button>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-3.5 rounded-lg bg-blue-50 border border-blue-200">
        <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Catatan:</strong> User tambahan hanya tersimpan di perangkat
          ini (localStorage). Admin utama dapat mengganti passwordnya melalui
          tab Ganti Password.
        </p>
      </div>

      {users.length === 0 ? (
        <div
          data-ocid="settings.user_empty_state"
          className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border"
        >
          <User className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            Belum ada user tambahan
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tambahkan user untuk memberikan akses ke sistem.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => {
            const ocids = ocidMap[i] ?? {
              item: `settings.user_item.${i + 1}`,
              del: `settings.user_delete_button.${i + 1}`,
            };
            return (
              <Card
                key={u.username}
                className="shadow-xs"
                data-ocid={ocids.item}
              >
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {u.namaLengkap}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{u.username}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => setDeleteTarget(u)}
                    data-ocid={ocids.del}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="settings.user_dialog" className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Tambah User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="user-nama">Nama Lengkap</Label>
              <Input
                id="user-nama"
                placeholder="Nama lengkap"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                data-ocid="settings.user_nama_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-username">Username</Label>
              <Input
                id="user-username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                data-ocid="settings.user_username_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-password">Password</Label>
              <Input
                id="user-password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-ocid="settings.user_password_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-confirm">Konfirmasi Password</Label>
              <Input
                id="user-confirm"
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                data-ocid="settings.user_confirm_password_input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="settings.user_cancel_button"
            >
              Batal
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={isSubmitting}
              data-ocid="settings.user_submit_button"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Tambah User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="settings.user_delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Hapus User?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Yakin ingin menghapus user{" "}
            <strong>@{deleteTarget?.username}</strong>? User tidak bisa masuk
            lagi setelah ini.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              data-ocid="settings.user_cancel_button"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDeleteUser(deleteTarget)}
              data-ocid="settings.user_confirm_button"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// Tab 4: Ganti Password
// ============================================================
function TabGantiPassword() {
  const { actor } = useActor();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setStatus("error");
      setErrorMsg("Semua field wajib diisi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMsg("Konfirmasi password baru tidak cocok.");
      return;
    }
    if (newPassword.length < 6) {
      setStatus("error");
      setErrorMsg("Password baru minimal 6 karakter.");
      return;
    }
    if (!actor) {
      setStatus("error");
      setErrorMsg("Sistem belum siap, coba lagi sebentar.");
      return;
    }
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMsg("");
    try {
      // Get current username from backend
      const currentUsername = await actor.getAdminUsername();
      if (!currentUsername) {
        setStatus("error");
        setErrorMsg("Tidak dapat memuat username admin. Coba lagi.");
        return;
      }

      // Verify old password first: try login with old credentials
      const oldHash = await hashPassword(oldPassword);
      const testToken = crypto.randomUUID();
      const testResult = await actor.loginWithCredentials(
        currentUsername,
        oldHash,
        testToken,
      );
      if (testResult === null) {
        // Also check extra users – but for main admin this path means old password wrong
        setStatus("error");
        setErrorMsg("Password lama tidak sesuai.");
        return;
      }

      // Set new credentials
      const newHash = await hashPassword(newPassword);
      await actor.setAdminCredentials(currentUsername, newHash);
      setStatus("success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setStatus("error");
      setErrorMsg(
        "Terjadi kesalahan. Pastikan Anda sudah login dan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md">
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Ganti Password Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "success" && (
              <div
                data-ocid="settings.password_success_state"
                className="flex items-center gap-3 p-3.5 rounded-lg bg-green-50 border border-green-200"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm font-medium text-green-700">
                  Password berhasil diperbarui!
                </p>
              </div>
            )}
            {status === "error" && (
              <div
                data-ocid="settings.password_error_state"
                className="flex items-start gap-3 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20"
              >
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-destructive">
                  {errorMsg}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="pwd-old">Password Lama</Label>
              <Input
                id="pwd-old"
                type="password"
                placeholder="Password saat ini"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete="current-password"
                data-ocid="settings.password_old_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd-new">Password Baru</Label>
              <Input
                id="pwd-new"
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                data-ocid="settings.password_new_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd-confirm">Konfirmasi Password Baru</Label>
              <Input
                id="pwd-confirm"
                type="password"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                data-ocid="settings.password_confirm_input"
              />
            </div>

            {!actor && (
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <p className="text-xs text-muted-foreground">
                  Menghubungkan ke backend...
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !actor}
              data-ocid="settings.password_submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Perbarui Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// Main SettingsPage
// ============================================================
export default function SettingsPage() {
  return (
    <AdminLayout
      title="Pengaturan"
      subtitle="Kelola logo, kontak pengurus, user, dan password"
    >
      <Tabs defaultValue="logo" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-xl h-auto p-1">
          <TabsTrigger
            value="logo"
            className="text-xs py-2 flex gap-1.5 items-center"
            data-ocid="settings.logo_tab"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ganti Logo</span>
            <span className="sm:hidden">Logo</span>
          </TabsTrigger>
          <TabsTrigger
            value="kontak"
            className="text-xs py-2 flex gap-1.5 items-center"
            data-ocid="settings.kontak_tab"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kontak Pengurus</span>
            <span className="sm:hidden">Kontak</span>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="text-xs py-2 flex gap-1.5 items-center"
            data-ocid="settings.users_tab"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Manajemen User</span>
            <span className="sm:hidden">User</span>
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="text-xs py-2 flex gap-1.5 items-center"
            data-ocid="settings.password_tab"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ganti Password</span>
            <span className="sm:hidden">Password</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logo">
          <TabGantiLogo />
        </TabsContent>
        <TabsContent value="kontak">
          <TabKontakPengurus />
        </TabsContent>
        <TabsContent value="users">
          <TabManajemenUser />
        </TabsContent>
        <TabsContent value="password">
          <TabGantiPassword />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
