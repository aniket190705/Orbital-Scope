import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { loginWithGoogle, isLoading } = useAuth();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6">
      <div className="w-full rounded-3xl border border-emerald-500/20 bg-slate-900/80 p-8 shadow-2xl shadow-emerald-950/30">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-300">
          Crew Enrollment
        </p>
        <h2 className="mb-4 text-4xl font-bold text-white">Create your Orbital Scope account</h2>
        <p className="mb-6 text-slate-300">
          New accounts are created automatically the first time you finish the Google
          sign-in flow.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sign Up with Google
          </button>
          <Link to="/login" className="text-emerald-300 hover:underline">
            Already have access?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
