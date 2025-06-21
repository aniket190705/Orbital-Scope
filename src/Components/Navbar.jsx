import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-white">
        OrbitalScope
      </Link>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Track Satellites
        </Link>
        <Link to="/news" className="hover:underline">
          News
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
