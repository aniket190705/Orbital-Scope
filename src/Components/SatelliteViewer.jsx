import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import CesiumViewer from "./CesiumViewer";

const SatelliteViewer = () => {
  const { isAuthenticated, user } = useAuth();
  const statusLabel = useMemo(() => {
    if (!isAuthenticated) {
      return "Sign in to sync favorite satellites";
    }

    return `Favorites are synced for ${user?.name ?? user?.email ?? "your account"}`;
  }, [isAuthenticated, user]);

  return (
    <div style={{ width: "100%", height: "80%", padding: 0, margin: 0 }}>
      <div className="flex justify-end px-6 py-4">
        <div className="rounded-full border border-cyan-500/20 bg-slate-800/80 px-4 py-2 text-sm text-slate-200">
          {statusLabel}
        </div>
      </div>
      <CesiumViewer />
    </div>
  );
};

export default SatelliteViewer;
