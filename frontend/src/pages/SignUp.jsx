import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WalletIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../api";

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!data.name || !data.email || !data.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await api.post("/api/auth/signup", data);

      toast.success("Signup successful! Please login");
      setData({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Signup failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      <div className="relative z-10 bg-[#1e293b]/80 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <WalletIcon className="w-7 h-7 text-purple-400" />
          <h1 className="text-2xl font-bold text-purple-400">Arthix</h1>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>

        <p className="text-gray-400 text-center mb-6">
          Start tracking your expenses smarter
        </p>

        <div className="space-y-4">
          <input
            type="text"
            autoComplete="name"
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Full Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <input
            type="email"
            autoComplete="email"
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Email Address"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <input
            type="password"
            autoComplete="new-password"
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        <button
          type="button"
          onClick={handleSignup}
          className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition py-3 rounded-lg font-semibold"
        >
          Create Account
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-400 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
