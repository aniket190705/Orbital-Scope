import { useState, useEffect } from "react";
import { FaCrosshairs } from "react-icons/fa";
import fetchLiveTLEs from "../utils/fetchLiveTLEs";
import * as satellite from "satellite.js";

const SatelliteSidebar = ({
  isOpen,
  setSidebarOpen,
  selectedSatellites,
  setSelectedSatellites,
  flyToSatellite,
  currentlyTrackedId,
  setCurrentlyTrackedId,
  allSatellites,
  liveData,
}) => {
  const [visibleSatellites, setVisibleSatellites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [liveInfo, setLiveInfo] = useState({});

  useEffect(() => {
    const load = async () => {
      const fetched = await fetchLiveTLEs();
      const withIds = fetched.map((sat) => ({
        ...sat,
        id: sat.tle1?.split(" ")[1]?.trim().slice(0, -1), // NORAD ID
      }));
      setVisibleSatellites(withIds);
    };
    load();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updates = {};
      visibleSatellites.forEach((sat) => {
        try {
          const rec = satellite.twoline2satrec(sat.tle1, sat.tle2);
          const now = new Date();
          const { position, velocity } = satellite.propagate(rec, now);
          const gmst = satellite.gstime(now);
          const geo = satellite.eciToGeodetic(position, gmst);

          const lat = satellite.degreesLat(geo.latitude).toFixed(2);
          const lon = satellite.degreesLong(geo.longitude).toFixed(2);
          const alt = (geo.height * 1000).toFixed(0);
          const speed =
            Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2) *
            3600; // km/h

          updates[sat.id] = {
            lat,
            lon,
            alt,
            speed: speed.toFixed(0),
          };
        } catch (e) {}
      });
      setLiveInfo(updates);
    }, 1500);
    return () => clearInterval(interval);
  }, [visibleSatellites]);

  const toggleSatellite = (sat) => {
    const exists = selectedSatellites.find((s) => s.id === sat.id);
    if (exists) {
      setSelectedSatellites((prev) => prev.filter((s) => s.id !== sat.id));
    } else {
      setSelectedSatellites((prev) => [...prev, sat]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "300px",
        height: "100%",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        overflowY: "auto",
        padding: "16px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => setSidebarOpen(false)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "#1e1e1e",
          color: "#fff",
          border: "1px solid #555",
          borderRadius: "4px",
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        Hide
      </button>

      <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
        Select Satellites
      </h3>

      {visibleSatellites.map((sat) => {
        const selected = selectedSatellites.some((s) => s.id === sat.id);
        const live = liveInfo[sat.id] || {};

        return (
          <div
            key={sat.id}
            onClick={() => toggleSatellite(sat)}
            style={{
              border: selected ? "2px solid #00bcd4" : "2px solid transparent",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
              background: "#2c2c2c",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ margin: 0 }}>{sat.name?.trim()}</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedId((prev) => (prev === sat.id ? null : sat.id));
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#00bcd4",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                {expandedId === sat.id ? "▲" : "▼"}
              </button>
            </div>

            {expandedId === sat.id && (
              <div style={{ marginTop: "10px", fontSize: "13px" }}>
                <p>
                  <strong>Altitude:</strong> {live.alt || "Loading..."} m
                </p>
                <p>
                  <strong>Speed:</strong> {live.speed || "Loading..."} km/h
                </p>
                <p>
                  <strong>Latitude:</strong> {live.lat || "Loading..."}°
                </p>
                <p>
                  <strong>Longitude:</strong> {live.lon || "Loading..."}°
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    flyToSatellite(sat.id);
                  }}
                  style={{
                    marginTop: "8px",
                    padding: "4px 8px",
                    border: "1px solid #00bcd4",
                    borderRadius: "4px",
                    background: "#1e1e1e",
                    color: "#00bcd4",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <FaCrosshairs />
                  {currentlyTrackedId === sat.id
                    ? "Stop Tracking"
                    : "Focus on Satellite"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SatelliteSidebar;
