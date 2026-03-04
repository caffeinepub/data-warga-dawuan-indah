import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Iuran {
    id: bigint;
    jumlah: bigint;
    tahun: bigint;
    kkId: bigint;
    createdAt: bigint;
    tanggalBayar: string;
    keterangan: string;
    bulan: bigint;
    statusLunas: boolean;
}
export interface Warga {
    id: bigint;
    nik: string;
    namaLengkap: string;
    tanggalLahir: string;
    tempatLahir: string;
    kkId: bigint;
    createdAt: bigint;
    statusAktif: boolean;
    jenisKelamin: string;
    hubunganKK: string;
}
export interface UserProfile {
    name: string;
}
export interface KK {
    id: bigint;
    namaKepala: string;
    blokRumah: string;
    alamat: string;
    noHP: string;
    createdAt: bigint;
    nomorKK: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createIuran(kkId: bigint, bulan: bigint, tahun: bigint, jumlah: bigint, statusLunas: boolean, tanggalBayar: string, keterangan: string): Promise<bigint>;
    createKK(nomorKK: string, namaKepala: string, alamat: string, blokRumah: string, noHP: string): Promise<bigint>;
    createWarga(kkId: bigint, nik: string, namaLengkap: string, tempatLahir: string, tanggalLahir: string, jenisKelamin: string, hubunganKK: string, statusAktif: boolean): Promise<bigint>;
    deleteIuran(id: bigint): Promise<void>;
    deleteKK(id: bigint): Promise<void>;
    deleteWarga(id: bigint): Promise<void>;
    getAdminUsername(): Promise<string | null>;
    getAllIuran(): Promise<Array<Iuran>>;
    getAllKK(): Promise<Array<KK>>;
    getAllWarga(): Promise<Array<Warga>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getIuranByBulanTahun(bulan: bigint, tahun: bigint): Promise<Array<Iuran>>;
    getIuranById(id: bigint): Promise<Iuran>;
    getIuranByKKId(kkId: bigint): Promise<Array<Iuran>>;
    getJumlahBelumLunas(bulan: bigint, tahun: bigint): Promise<bigint>;
    getJumlahLunas(bulan: bigint, tahun: bigint): Promise<bigint>;
    getKKById(id: bigint): Promise<KK>;
    getTotalIuranTerkumpul(bulan: bigint, tahun: bigint): Promise<bigint>;
    getTotalKK(): Promise<bigint>;
    getTotalWarga(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWargaById(id: bigint): Promise<Warga>;
    getWargaByKKId(kkId: bigint): Promise<Array<Warga>>;
    isCallerAdmin(): Promise<boolean>;
    loginWithCredentials(username: string, passwordHash: string, token: string): Promise<string | null>;
    logoutSession(token: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAdminCredentials(username: string, passwordHash: string): Promise<void>;
    updateIuran(id: bigint, kkId: bigint, bulan: bigint, tahun: bigint, jumlah: bigint, statusLunas: boolean, tanggalBayar: string, keterangan: string): Promise<void>;
    updateKK(id: bigint, nomorKK: string, namaKepala: string, alamat: string, blokRumah: string, noHP: string): Promise<void>;
    updateWarga(id: bigint, kkId: bigint, nik: string, namaLengkap: string, tempatLahir: string, tanggalLahir: string, jenisKelamin: string, hubunganKK: string, statusAktif: boolean): Promise<void>;
    validateSession(token: string): Promise<boolean>;
}
