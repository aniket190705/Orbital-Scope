import { useState } from "react";
import satellites from "../data/satellites";
import { FaCrosshairs } from "react-icons/fa";

const SatelliteSidebar = ({
  isOpen,
  setSidebarOpen,
  selectedSatellites,
  setSelectedSatellites,
  flyToSatellite,
  currentlyTrackedId,
  setCurrentlyTrackedId,
}) => {
  const [expandedSatelliteId, setExpandedSatelliteId] = useState(null);

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedSatelliteId((prev) => (prev === id ? null : id));
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
        overflowY: "scroll",
        boxShadow: "0 0 10px rgba(0, 0,0, 0.5)",
        padding: "16px",
        zIndex: 1000,
      }}
    >
      {/* Hide Button */}
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

      {satellites.map((sat) => (
        <div
          key={sat.id}
          onClick={() =>
            setSelectedSatellites((prev) =>
              prev.includes(sat.id)
                ? prev.filter((id) => id !== sat.id)
                : [...prev, sat.id]
            )
          }
          style={{
            border: selectedSatellites.includes(sat.id)
              ? "2px solid #00bcd4"
              : "2px solid transparent",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
            background: "#2c2c2c",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4 style={{ margin: 0 }}>{sat.name}</h4>
            <button
              onClick={(e) => toggleExpand(sat.id, e)}
              style={{
                background: "none",
                border: "none",
                color: "#00bcd4",
                cursor: "pointer",
                fontSize: "16px",
              }}
              title="Toggle Info"
            >
              {expandedSatelliteId === sat.id ? "▲" : "▼"}
            </button>
          </div>

          {expandedSatelliteId === sat.id && (
            <div style={{ marginTop: "10px", fontSize: "13px" }}>
              <p>
                <strong>ID:</strong> {sat.id}
              </p>
              <p>
                <strong>Altitude:</strong> {sat.altitude || "Unknown"} km
              </p>
              <p>
                <strong>Speed:</strong> {sat.speed || "Unknown"} km/h
              </p>
              <p>
                <strong>Inclination:</strong> {sat.inclination || "Unknown"}°
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentlyTrackedId === sat.id) {
                    setCurrentlyTrackedId(null);
                  } else {
                    flyToSatellite(sat.id);
                    setCurrentlyTrackedId(sat.id);
                  }
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
      ))}
    </div>
  );
};

export default SatelliteSidebar;
