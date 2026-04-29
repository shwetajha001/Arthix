import { useEffect, useState } from "react";
import api from "../api";

export default function Budget() {
  const [budget, setBudget] = useState(0);
  const [input, setInput] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchExpenses = async () => {
    const res = await api.get("/api/expenses");

    const total = res.data.reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0
    );

    setTotalSpent(total);
  };

  useEffect(() => {
    fetchExpenses();
    const savedBudget = localStorage.getItem("budget");
    if (savedBudget) setBudget(Number(savedBudget));
  }, []);

  const handleSetBudget = () => {
    const value = Number(input);
    if (!value) return;

    setBudget(value);
    localStorage.setItem("budget", value);
    setInput("");
  };

  const remaining = budget - totalSpent;
  const percent = budget ? (totalSpent / budget) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      <h1 className="text-3xl font-bold mb-6">Budget Planner</h1>

      {/* SET BUDGET */}
      <div className="bg-[#1e293b] p-6 rounded-2xl mb-6">
        <p className="text-gray-400 mb-3">Set Monthly Budget</p>

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Enter budget"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-[#0f172a] border border-gray-700 p-3 rounded-lg w-full"
          />

          <button
            onClick={handleSetBudget}
            className="bg-purple-600 px-5 rounded-lg"
          >
            Set
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">

        <div className="bg-[#1e293b] p-5 rounded-2xl">
          <p className="text-gray-400">Budget</p>
          <h2 className="text-2xl font-bold">₹{budget}</h2>
        </div>

        <div className="bg-[#1e293b] p-5 rounded-2xl">
          <p className="text-gray-400">Spent</p>
          <h2 className="text-2xl font-bold text-red-400">
            ₹{totalSpent.toFixed(2)}
          </h2>
        </div>

        <div className="bg-[#1e293b] p-5 rounded-2xl">
          <p className="text-gray-400">Remaining</p>
          <h2
            className={`text-2xl font-bold ${
              remaining < 0 ? "text-red-500" : "text-green-400"
            }`}
          >
            ₹{remaining.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* PROGRESS BAR */}
      <div className="bg-[#1e293b] p-6 rounded-2xl">

        <p className="mb-3 text-gray-400">Usage</p>

        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 ${
              percent > 100 ? "bg-red-500" : "bg-purple-500"
            }`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-gray-400">
          {percent.toFixed(0)}% used
        </p>

        {/* WARNING */}
        {percent > 100 && (
          <p className="text-red-500 mt-2 font-semibold">
            ⚠ You have exceeded your budget!
          </p>
        )}

      </div>

    </div>
  );
}
