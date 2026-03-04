import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const token = localStorage.getItem("admin_session_token");
      if (!token) {
        navigate({ to: "/login" });
        setIsChecking(false);
        return;
      }
      if (!actor || isFetching) return;
      try {
        const valid = await actor.validateSession(token);
        if (valid) {
          setIsAuthorized(true);
        } else {
          localStorage.removeItem("admin_session_token");
          navigate({ to: "/login" });
        }
      } catch {
        localStorage.removeItem("admin_session_token");
        navigate({ to: "/login" });
      } finally {
        setIsChecking(false);
      }
    }
    checkSession();
  }, [actor, isFetching, navigate]);

  if (isChecking || isFetching) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-background"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Memverifikasi akses...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;
  return <>{children}</>;
}
