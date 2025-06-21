import { useEffect, useRef, useState } from "react";
import {
  Viewer,
  Ion,
  createWorldTerrainAsync,
  HeadingPitchRange,
  Math as CesiumMath,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import SatelliteTracker from "./SatelliteTracker";
import SatelliteSidebar from "./SatelliteSidebar";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2M2Q1OWRlMS1kOTM3LTQ4ZmUtYjk1OS1kOTU5ZGI4OTYzYjQiLCJpZCI6MzA3ODg3LCJpYXQiOjE3NDkwNDIwMDB9.k1CmcGmuoiCqIuRVF2QqMv1TQvzHkiERWFXcWNiawJQ"; // Replace with your real token

const CesiumViewer = () => {
  const viewerRef = useRef(null);
  const [viewerInstance, setViewerInstance] = useState(null);
  const [selectedSatellites, setSelectedSatellites] = useState([
    {
      name: "ISS (ZARYA)",
      tle1: "1 25544U 98067A   25171.80882408  .00010734  00000+0  19478-3 0  9990",
      tle2: "2 25544  51.6358 289.1269 0002114 264.7605  95.3143 15.50148846515722",
    },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentlyTrackedId, setCurrentlyTrackedId] = useState(null);
  const [liveData, setLiveData] = useState({});

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
      duration: 3.5,
      offset: new HeadingPitchRange(
        CesiumMath.toRadians(0),
        CesiumMath.toRadians(-35),
        500000
      ),
    });
  };

  useEffect(() => {
    const initCesium = async () => {
      const terrain = await createWorldTerrainAsync();
      const viewer = new Viewer(viewerRef.current, {
        terrainProvider: terrain,
        shouldAnimate: true,
      });
      setViewerInstance(viewer);
    };

    initCesium();

    return () => {
      if (viewerInstance && !viewerInstance.isDestroyed()) {
        viewerInstance.destroy();
      }
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* "More Satellites" toggle when sidebar is closed */}
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

      {/* Sidebar Component */}
      <SatelliteSidebar
        isOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedSatellites={selectedSatellites}
        setSelectedSatellites={setSelectedSatellites}
        flyToSatellite={flyToSatellite}
        currentlyTrackedId={currentlyTrackedId}
        setCurrentlyTrackedId={setCurrentlyTrackedId}
        liveData={liveData}
      />

      {/* Cesium Globe Viewer */}
      <div ref={viewerRef} style={{ flex: 1, height: "107%" }} />

      {/* Satellite Entities */}
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
