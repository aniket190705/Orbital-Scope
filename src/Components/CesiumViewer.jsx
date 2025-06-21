import { useEffect, useRef, useState } from "react";
import {
  Viewer,
  Ion,
  createWorldTerrainAsync,
  HeadingPitchRange,
  Math as CesiumMath,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import fetchLiveTLEs from "../utils/fetchLiveTLEs";
import SatelliteTracker from "./SatelliteTracker";
import SatelliteSidebar from "./SatelliteSidebar";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_API_KEY;

const CesiumViewer = () => {
  const viewerRef = useRef(null);
  const [viewerInstance, setViewerInstance] = useState(null);
  const [allSatellites, setAllSatellites] = useState([]);
  const [selectedSatellites, setSelectedSatellites] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentlyTrackedId, setCurrentlyTrackedId] = useState(null);
  const [liveData, setLiveData] = useState({});

  useEffect(() => {
    const init = async () => {
      const terrain = await createWorldTerrainAsync();
      const viewer = new Viewer(viewerRef.current, {
        terrainProvider: terrain,
        shouldAnimate: true,
      });
      setViewerInstance(viewer);

      const satellites = await fetchLiveTLEs();
      const withIds = satellites.map((sat) => ({
        ...sat,
        id: sat.tle1?.split(" ")[1]?.trim()?.slice(0, -1), // NORAD ID
      }));

      setAllSatellites(withIds);

      // Select ISS by default if present
      const iss = withIds.find((s) => s.name?.includes("ISS"));
      if (iss) setSelectedSatellites([iss]);
    };

    init();

    return () => {
      if (viewerInstance && !viewerInstance.isDestroyed()) {
        viewerInstance.destroy();
      }
    };
  }, []);

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
        setCurrentlyTrackedId={setCurrentlyTrackedId}
        allSatellites={allSatellites}
        liveData={liveData}
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
