export interface KontakPengurus {
  id: string;
  nama: string;
  jabatan: string;
  noHP: string;
}

export interface ExtraUser {
  username: string;
  passwordHash: string; // SHA-256 hex
  namaLengkap: string;
}

const KEYS = {
  LOGO_URL: "app_logo_url",
  KONTAK_PENGURUS: "app_kontak_pengurus",
  EXTRA_USERS: "app_extra_users",
} as const;

export const settingsStore = {
  // Logo
  getLogoUrl(): string {
    return localStorage.getItem(KEYS.LOGO_URL) ?? "";
  },
  setLogoUrl(url: string): void {
    localStorage.setItem(KEYS.LOGO_URL, url);
  },

  // Kontak Pengurus
  getKontakPengurus(): KontakPengurus[] {
    try {
      const raw = localStorage.getItem(KEYS.KONTAK_PENGURUS);
      if (!raw) return [];
      return JSON.parse(raw) as KontakPengurus[];
    } catch {
      return [];
    }
  },
  setKontakPengurus(list: KontakPengurus[]): void {
    localStorage.setItem(KEYS.KONTAK_PENGURUS, JSON.stringify(list));
  },
  addKontakPengurus(item: Omit<KontakPengurus, "id">): void {
    const list = settingsStore.getKontakPengurus();
    const newItem: KontakPengurus = {
      id: crypto.randomUUID(),
      ...item,
    };
    settingsStore.setKontakPengurus([...list, newItem]);
  },
  updateKontakPengurus(id: string, item: Omit<KontakPengurus, "id">): void {
    const list = settingsStore.getKontakPengurus();
    const updated = list.map((k) => (k.id === id ? { id, ...item } : k));
    settingsStore.setKontakPengurus(updated);
  },
  deleteKontakPengurus(id: string): void {
    const list = settingsStore.getKontakPengurus();
    settingsStore.setKontakPengurus(list.filter((k) => k.id !== id));
  },

  // Extra Users
  getExtraUsers(): ExtraUser[] {
    try {
      const raw = localStorage.getItem(KEYS.EXTRA_USERS);
      if (!raw) return [];
      return JSON.parse(raw) as ExtraUser[];
    } catch {
      return [];
    }
  },
  addExtraUser(user: ExtraUser): void {
    const list = settingsStore.getExtraUsers();
    settingsStore._setExtraUsers([...list, user]);
  },
  deleteExtraUser(username: string): void {
    const list = settingsStore.getExtraUsers();
    settingsStore._setExtraUsers(list.filter((u) => u.username !== username));
  },
  findUser(username: string): ExtraUser | undefined {
    return settingsStore.getExtraUsers().find((u) => u.username === username);
  },
  _setExtraUsers(users: ExtraUser[]): void {
    localStorage.setItem(KEYS.EXTRA_USERS, JSON.stringify(users));
  },
};
