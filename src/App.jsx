import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SatelliteViewer from "./Components/SatelliteViewer";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Navbar from "./Components/Navbar";
import SatelliteNews from "./Components/SatelliteNews";

function App() {
  return (
    <Router>
      <div
        style={{ width: "100%", height: "100%" }}
        className=" bg-gray-900 text-white"
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<SatelliteViewer />} />
          <Route path="/news" element={<SatelliteNews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
