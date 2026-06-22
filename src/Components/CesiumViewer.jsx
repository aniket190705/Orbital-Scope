import { useEffect, useRef, useState } from "react";
import {
  Viewer,
  Ion,
  createWorldTerrainAsync,
  HeadingPitchRange,
  Math as CesiumMath,
  TileMapServiceImageryProvider,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
import fetchLiveTLEs from "../utils/fetchLiveTLEs";
import SatelliteTracker from "./SatelliteTracker";
import SatelliteSidebar from "./SatelliteSidebar";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_API_KEY;

const CesiumViewer = () => {
  const { isAuthenticated } = useAuth();
  const viewerRef = useRef(null);
  const [viewerInstance, setViewerInstance] = useState(null);
  const [allSatellites, setAllSatellites] = useState([]);
  const [selectedSatellites, setSelectedSatellites] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentlyTrackedId, setCurrentlyTrackedId] = useState(null);
  const [liveData, setLiveData] = useState({});
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");

  useEffect(() => {
    let isMounted = true;
    let localViewer = null;

    const init = async () => {
      const terrain = await createWorldTerrainAsync();
      const imageryProvider = await TileMapServiceImageryProvider.fromUrl(
        `${CESIUM_BASE_URL}/Assets/Textures/NaturalEarthII`
      );

      localViewer = new Viewer(viewerRef.current, {
        terrainProvider: terrain,
        imageryProvider,
        baseLayerPicker: false,
        geocoder: false,
        shouldAnimate: true,
      });

      if (!isMounted) {
        localViewer.destroy();
        return;
      }

      setViewerInstance(localViewer);

      const satellites = await fetchLiveTLEs();
      const withIds = satellites.map((sat) => ({
        ...sat,
        id: sat.id ?? sat.tle1?.split(" ")[1]?.trim()?.slice(0, -1),
      }));

      setAllSatellites(withIds);

      const iss = withIds.find((satellite) => satellite.name?.includes("ISS"));
      if (iss) {
        setSelectedSatellites([iss]);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (localViewer && !localViewer.isDestroyed()) {
        localViewer.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setFavoriteIds([]);
        setFavoritesError("");
        return;
      }

      setFavoritesLoading(true);

      try {
        const payload = await apiFetch("/api/user/favorites");
        setFavoriteIds((payload.data ?? []).map((favorite) => favorite.satelliteId));
        setFavoritesError("");
      } catch (error) {
        setFavoritesError(error.message);
      } finally {
        setFavoritesLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  const flyToSatellite = (satId) => {
    const entity = viewerInstance?.entities.getById(satId);
    if (!entity) return;

    if (viewerInstance.trackedEntity && currentlyTrackedId === satId) {
      viewerInstance.trackedEntity = undefined;
      setCurrentlyTrackedId(null);
    } else {
      viewerInstance.trackedEntity = entity;
      setCurrentlyTrackedId(satId);
    }

    viewerInstance.flyTo(entity, {
      duration: 2.5,
      offset: new HeadingPitchRange(
        CesiumMath.toRadians(0),
        CesiumMath.toRadians(-35),
        500000
      ),
    });
  };

  const toggleFavorite = async (satId) => {
    if (!isAuthenticated) {
      setFavoritesError("Sign in with Google to save favorites.");
      return;
    }

    const isFavorite = favoriteIds.includes(satId);

    try {
      if (isFavorite) {
        await apiFetch(`/api/user/favorites/${satId}`, {
          method: "DELETE",
        });
        setFavoriteIds((prev) => prev.filter((id) => id !== satId));
      } else {
        await apiFetch(`/api/user/favorites/${satId}`, {
          method: "POST",
        });
        setFavoriteIds((prev) => [...prev, satId]);
      }

      setFavoritesError("");
    } catch (error) {
      setFavoritesError(error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 1000,
            padding: "10px 15px",
            backgroundColor: "#1e1e1e",
            color: "#fff",
            border: "1px solid #555",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          More Satellites
        </button>
      )}

      <SatelliteSidebar
        isOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedSatellites={selectedSatellites}
        setSelectedSatellites={setSelectedSatellites}
        flyToSatellite={flyToSatellite}
        currentlyTrackedId={currentlyTrackedId}
        allSatellites={allSatellites}
        liveData={liveData}
        favoriteIds={favoriteIds}
        favoritesLoading={favoritesLoading}
        favoritesError={favoritesError}
        isAuthenticated={isAuthenticated}
        onToggleFavorite={toggleFavorite}
      />

      <div ref={viewerRef} style={{ flex: 1, height: "107%" }} />

      {viewerInstance && (
        <SatelliteTracker
          viewer={viewerInstance}
          selectedSatellites={selectedSatellites}
          setLiveData={setLiveData}
        />
      )}
    </div>
  );
};

export default CesiumViewer;
