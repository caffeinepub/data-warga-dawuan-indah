import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Iuran, KK, Warga } from "../backend.d.ts";
import { useActor } from "./useActor";

export type { KK, Warga, Iuran };

// ==================== KK ====================
export function useGetAllKK() {
  const { actor, isFetching } = useActor();
  return useQuery<KK[]>({
    queryKey: ["kk"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllKK();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateKK() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      nomorKK: string;
      namaKepala: string;
      alamat: string;
      blokRumah: string;
      noHP: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createKK(
        data.nomorKK,
        data.namaKepala,
        data.alamat,
        data.blokRumah,
        data.noHP,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kk"] }),
  });
}

export function useUpdateKK() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      nomorKK: string;
      namaKepala: string;
      alamat: string;
      blokRumah: string;
      noHP: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateKK(
        data.id,
        data.nomorKK,
        data.namaKepala,
        data.alamat,
        data.blokRumah,
        data.noHP,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kk"] }),
  });
}

export function useDeleteKK() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteKK(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kk"] });
      qc.invalidateQueries({ queryKey: ["warga"] });
    },
  });
}

// ==================== WARGA ====================
export function useGetAllWarga() {
  const { actor, isFetching } = useActor();
  return useQuery<Warga[]>({
    queryKey: ["warga"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWarga();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWargaByKK(kkId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Warga[]>({
    queryKey: ["warga", "kk", kkId?.toString()],
    queryFn: async () => {
      if (!actor || !kkId) return [];
      return actor.getWargaByKKId(kkId);
    },
    enabled: !!actor && !isFetching && kkId !== null,
  });
}

export function useCreateWarga() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      kkId: bigint;
      nik: string;
      namaLengkap: string;
      tempatLahir: string;
      tanggalLahir: string;
      jenisKelamin: string;
      hubunganKK: string;
      statusAktif: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createWarga(
        data.kkId,
        data.nik,
        data.namaLengkap,
        data.tempatLahir,
        data.tanggalLahir,
        data.jenisKelamin,
        data.hubunganKK,
        data.statusAktif,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warga"] }),
  });
}

export function useUpdateWarga() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      kkId: bigint;
      nik: string;
      namaLengkap: string;
      tempatLahir: string;
      tanggalLahir: string;
      jenisKelamin: string;
      hubunganKK: string;
      statusAktif: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateWarga(
        data.id,
        data.kkId,
        data.nik,
        data.namaLengkap,
        data.tempatLahir,
        data.tanggalLahir,
        data.jenisKelamin,
        data.hubunganKK,
        data.statusAktif,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warga"] }),
  });
}

export function useDeleteWarga() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteWarga(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warga"] }),
  });
}

// ==================== IURAN ====================
export function useGetAllIuran() {
  const { actor, isFetching } = useActor();
  return useQuery<Iuran[]>({
    queryKey: ["iuran"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllIuran();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetIuranByBulanTahun(bulan: number, tahun: number) {
  const { actor, isFetching } = useActor();
  return useQuery<Iuran[]>({
    queryKey: ["iuran", "bulan", bulan, tahun],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIuranByBulanTahun(BigInt(bulan), BigInt(tahun));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateIuran() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      kkId: bigint;
      bulan: bigint;
      tahun: bigint;
      jumlah: bigint;
      statusLunas: boolean;
      tanggalBayar: string;
      keterangan: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createIuran(
        data.kkId,
        data.bulan,
        data.tahun,
        data.jumlah,
        data.statusLunas,
        data.tanggalBayar,
        data.keterangan,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["iuran"] }),
  });
}

export function useUpdateIuran() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      kkId: bigint;
      bulan: bigint;
      tahun: bigint;
      jumlah: bigint;
      statusLunas: boolean;
      tanggalBayar: string;
      keterangan: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateIuran(
        data.id,
        data.kkId,
        data.bulan,
        data.tahun,
        data.jumlah,
        data.statusLunas,
        data.tanggalBayar,
        data.keterangan,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["iuran"] }),
  });
}

export function useDeleteIuran() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteIuran(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["iuran"] }),
  });
}

// ==================== STATS ====================
export function useDashboardStats(bulan: number, tahun: number) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats", bulan, tahun],
    queryFn: async () => {
      if (!actor) return null;
      const [totalKK, totalWarga, totalIuran, jumlahLunas, jumlahBelumLunas] =
        await Promise.all([
          actor.getTotalKK(),
          actor.getTotalWarga(),
          actor.getTotalIuranTerkumpul(BigInt(bulan), BigInt(tahun)),
          actor.getJumlahLunas(BigInt(bulan), BigInt(tahun)),
          actor.getJumlahBelumLunas(BigInt(bulan), BigInt(tahun)),
        ]);
      return { totalKK, totalWarga, totalIuran, jumlahLunas, jumlahBelumLunas };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
