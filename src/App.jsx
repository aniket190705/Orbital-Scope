import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import SatelliteTracker from "./Components/SatelliteTracker";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <Router>
      <div
        style={{ width: "100%", height: "100%" }}
        className=" bg-gray-900 text-white"
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/satellite/:id" element={<SatelliteTracker />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
