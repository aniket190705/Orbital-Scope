import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, isLoading, loginWithGoogle, logout, user } = useAuth();

  return (
    <nav className="bg-gray-800/95 p-4 flex justify-between items-center gap-4">
      <Link to="/" className="text-xl font-bold text-white tracking-wide">
        OrbitalScope
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">
          Track Satellites
        </Link>
        <Link to="/news" className="hover:underline">
          News
        </Link>
        {isLoading ? (
          <span className="text-slate-300 text-sm">Checking session...</span>
        ) : isAuthenticated ? (
          <>
            <span className="text-slate-200 text-sm">
              {user?.name ?? user?.email ?? "Signed in"}
            </span>
            <button
              onClick={logout}
              className="rounded-full border border-cyan-400 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={loginWithGoogle}
              className="hover:underline"
            >
              Login
            </button>
            <button
              onClick={loginWithGoogle}
              className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Sign In with Google
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
