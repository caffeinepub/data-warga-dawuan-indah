import { useCallback, useEffect, useState } from "react";
import { useActor } from "./useActor";

const SESSION_KEY = "admin_session_token";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function useAuth() {
  const { actor } = useActor();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => !!localStorage.getItem(SESSION_KEY),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return false;
    if (!actor) return false;
    try {
      const valid = await actor.validateSession(token);
      if (valid) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem(SESSION_KEY);
        setIsLoggedIn(false);
      }
      return valid;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      setIsLoggedIn(false);
      return false;
    }
  }, [actor]);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      if (!actor) {
        setError("Sistem belum siap, coba lagi sebentar.");
        return false;
      }
      setIsLoading(true);
      setError(null);
      try {
        const hexHash = await hashPassword(password);
        const token = crypto.randomUUID();
        const result = await actor.loginWithCredentials(
          username,
          hexHash,
          token,
        );
        if (result !== null) {
          localStorage.setItem(SESSION_KEY, token);
          setIsLoggedIn(true);
          return true;
        }
        setError("Username atau password salah.");
        return false;
      } catch {
        setError("Terjadi kesalahan. Coba lagi.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  const logout = useCallback(async () => {
    const token = localStorage.getItem(SESSION_KEY);
    if (token && actor) {
      try {
        await actor.logoutSession(token);
      } catch {
        // ignore errors on logout
      }
    }
    localStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
  }, [actor]);

  // Re-check session status whenever actor becomes available
  useEffect(() => {
    if (actor && localStorage.getItem(SESSION_KEY)) {
      checkSession();
    }
  }, [actor, checkSession]);

  return { isLoggedIn, isLoading, error, login, logout, checkSession };
}
