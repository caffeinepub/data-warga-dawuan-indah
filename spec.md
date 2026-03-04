# Data Warga Dawuan Indah

## Current State

Aplikasi sudah memiliki:
- Login dengan username dan password (SHA-256 hash)
- Backend `setAdminCredentials(username, passwordHash)` yang bisa dipanggil siapa saja saat kredensial belum ada
- Halaman Landing, Login, dan panel admin (Dashboard, Data KK, Data Warga, Iuran, Laporan)
- Tidak ada halaman untuk setup kredensial admin pertama kali dari UI

## Requested Changes (Diff)

### Add
- Halaman `/setup` baru: form untuk mengatur username dan password admin pertama kali
- Form berisi: field username, field password baru, field konfirmasi password
- Validasi: password minimal 8 karakter, password dan konfirmasi harus sama
- Setelah berhasil setup, redirect otomatis ke halaman login dengan pesan sukses
- Tampilkan pesan jika kredensial sudah diatur sebelumnya (cek via `getAdminUsername()`)
- Tambah link "Setup Admin" di halaman Login (di bagian bawah form, teks kecil)

### Modify
- `App.tsx`: tambah route `/setup` yang mengarah ke `SetupPage`
- `LoginPage.tsx`: tambah link kecil di bawah tombol login untuk navigasi ke `/setup`

### Remove
- Tidak ada yang dihapus

## Implementation Plan

1. Buat `src/frontend/src/pages/SetupPage.tsx` dengan:
   - Form username + password + konfirmasi password
   - Hash password dengan SHA-256 sebelum dikirim ke backend
   - Panggil `actor.setAdminCredentials(username, passwordHash)`
   - Cek apakah admin sudah ada via `actor.getAdminUsername()` - jika sudah ada, tampilkan pesan bahwa setup sudah selesai dan arahkan ke login
   - Setelah berhasil, redirect ke `/login` dengan toast sukses
2. Update `App.tsx`: tambah `setupRoute` di `/setup`
3. Update `LoginPage.tsx`: tambah link kecil menuju `/setup` di bawah tombol submit
