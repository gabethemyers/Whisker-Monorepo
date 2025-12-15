// hooks/useAuthToken.ts
import { useEffect, useState } from "react";
import { getJwt } from "@/utils/auth";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const stored = await getJwt();
        setToken(stored ?? null);
      } finally {
        setChecking(false);
      }
    };

    check();
  }, []);

  return { token, checking };
}
