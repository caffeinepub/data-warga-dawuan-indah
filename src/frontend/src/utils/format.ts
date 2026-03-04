export const BULAN_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatRupiah(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatBulanTahun(
  bulan: number | bigint,
  tahun: number | bigint,
): string {
  const b = typeof bulan === "bigint" ? Number(bulan) : bulan;
  const t = typeof tahun === "bigint" ? Number(tahun) : tahun;
  return `${BULAN_NAMES[b - 1] ?? ""} ${t}`;
}

export function getCurrentBulan(): number {
  return new Date().getMonth() + 1;
}

export function getCurrentTahun(): number {
  return new Date().getFullYear();
}

export function formatTanggal(tanggal: string): string {
  if (!tanggal) return "-";
  try {
    const d = new Date(tanggal);
    if (Number.isNaN(d.getTime())) return tanggal;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return tanggal;
  }
}
