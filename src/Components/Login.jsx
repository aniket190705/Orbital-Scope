import React from "react";

function Login() {
  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700"
        />
        <button className="w-full p-2 bg-blue-600 rounded">Login</button>
      </form>
    </div>
  );
}

export default Login;
