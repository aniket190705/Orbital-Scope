import CesiumViewer from "./CesiumViewer";

const Dashboard = () => {
  return (
    <div style={{ width: "100%", height: "80%", padding: 0, margin: 0 }}>
      <h2 className="text-2xl font-semibold mb-4">Live Satellite Tracker</h2>
      <CesiumViewer />
    </div>
  );
};

export default Dashboard;
