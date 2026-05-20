import React from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { loginWithGoogle, isLoading } = useAuth();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6">
      <div className="w-full rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300">
          Mission Access
        </p>
        <h2 className="mb-4 text-4xl font-bold text-white">Sign in to save favorite satellites</h2>
        <p className="mb-8 max-w-xl text-slate-300">
          Orbital Scope uses Google OAuth for authentication. Once signed in, you can
          keep a personal shortlist of satellites and sync those favorites from the backend.
        </p>
        <button
          onClick={loginWithGoogle}
          disabled={isLoading}
          className="rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
