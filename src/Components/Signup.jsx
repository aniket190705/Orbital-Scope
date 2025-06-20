import React from "react";

function Signup() {
  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Signup</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 rounded bg-gray-700"
        />
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
        <button className="w-full p-2 bg-green-600 rounded">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
