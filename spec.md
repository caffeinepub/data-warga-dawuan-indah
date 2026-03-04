# Data Warga Dawuan Indah

## Current State

Aplikasi manajemen data warga perumahan dengan:
- Login username/password dengan satu admin (single-user)
- Setup awal credentials via halaman `/setup`
- CRUD data KK, Warga, Iuran
- Dashboard statistik bulanan
- Laporan

Sidebar admin memiliki menu: Dashboard, Data KK, Data Warga, Iuran, Laporan.

Backend menyimpan satu `adminCredentials` (username + passwordHash). Tidak ada multi-user, tidak ada kontak pengurus, tidak ada logo yang bisa diubah.

## Requested Changes (Diff)

### Add
- **Multi-user management**: Backend mendukung beberapa user admin (array of users). Setiap user punya username, passwordHash, dan nama. Super-admin pertama bisa menambah/hapus user lain.
- **Kontak pengurus**: Tipe `KontakPengurus` berisi nama, jabatan, noHP. Bisa disimpan/diambil dari backend. Digunakan di landing page dan halaman pengaturan.
- **Logo URL**: Backend menyimpan satu string `logoUrl` yang bisa diupdate. Frontend menampilkan logo dari URL ini di sidebar dan landing page.
- **Halaman Settings Admin** (`/admin/settings`): Halaman baru dengan 4 tab:
  1. **Ganti Logo** - input URL logo, preview, tombol simpan
  2. **Kontak Pengurus** - form tambah/edit/hapus daftar pengurus (nama, jabatan, noHP)
  3. **Manajemen User** - daftar user, tambah user baru (username + password), hapus user
  4. **Ganti Password** - form ganti password diri sendiri (password lama, password baru, konfirmasi)
- Tambah link "Pengaturan" di sidebar nav menuju `/admin/settings`

### Modify
- `loginWithCredentials`: cek dari array users bukan single adminCredentials
- `setAdminCredentials`: ganti menjadi fungsi awal setup (tetap untuk backward compat, hanya bisa saat user list kosong)
- `AdminLayout`: tambahkan nav item "Pengaturan" dengan icon Settings
- `App.tsx`: tambah route `/admin/settings`
- Sidebar: logo area menggunakan logoUrl dari backend (jika ada) atau fallback icon

### Remove
- Tidak ada yang dihapus

## Implementation Plan

1. **Backend (Motoko)**:
   - Ganti `adminCredentials : ?AdminCredentials` menjadi `users : Map<Text, UserRecord>` (key = username)
   - Tipe `UserRecord = { username: Text; passwordHash: Text; namaLengkap: Text; isSuper: Bool }`
   - Tipe `KontakPengurus = { id: Nat; nama: Text; jabatan: Text; noHP: Text }`
   - Variabel `logoUrl : Text = ""`
   - Variabel `kontakPengurus : Map<Nat, KontakPengurus>`
   - Fungsi baru: `addUser`, `deleteUser`, `getAllUsers`, `changePassword`, `setLogoUrl`, `getLogoUrl`, `getAppSettings` (logo + kontak), `addKontakPengurus`, `updateKontakPengurus`, `deleteKontakPengurus`, `getAllKontakPengurus`
   - `setAdminCredentials` tetap untuk setup awal (saat users kosong), membuat user pertama dengan isSuper=true
   - `loginWithCredentials` mencari di map users
   - Semua fungsi admin-write butuh session token atau caller check

2. **Frontend**:
   - Buat `pages/admin/SettingsPage.tsx` dengan 4 tab
   - Update `AdminLayout.tsx`: tambah nav item Pengaturan, load logo dari backend
   - Update `App.tsx`: tambah route `/admin/settings`
   - Tambah hooks di `useQueries.ts`: `useGetLogoUrl`, `useSetLogoUrl`, `useGetAllKontakPengurus`, `useAddKontakPengurus`, `useUpdateKontakPengurus`, `useDeleteKontakPengurus`, `useGetAllUsers`, `useAddUser`, `useDeleteUser`, `useChangePassword`
