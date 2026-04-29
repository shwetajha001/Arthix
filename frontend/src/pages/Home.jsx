import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import {
  WalletIcon,
  ArrowsRightLeftIcon,
  TagIcon,
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

import { toast } from "react-toastify";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    const res = await api.get("/api/expenses");

    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleLogout = () => {
    const toastId = toast.info(
      <div className="flex flex-col gap-2 pointer-events-auto">
        <p>Are you sure you want to logout?</p>

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              toast.dismiss(toastId);
              navigate("/login", { replace: true });
            }}
            className="bg-red-500 px-3 py-1 rounded text-white text-sm"
          >
            Yes
          </button>

          <button
            type="button"
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-600 px-3 py-1 rounded text-white text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const totalAmount = expenses.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0
  );

  const totalCategories = new Set(expenses.map((e) => e.category)).size;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">
      {/* MAIN */}
      <main className="flex-1 p-6 lg:p-8 overflow-hidden">
        {/* TOP */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg font-medium"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#1e293b] p-5 rounded-2xl shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <WalletIcon className="w-6 h-6 text-purple-400" />
            </div>

            <div>
              <p className="text-gray-400">Total Expenses</p>
              <h2 className="text-2xl font-bold">
                ₹{totalAmount.toFixed(2)}
              </h2>
            </div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <ArrowsRightLeftIcon className="w-6 h-6 text-indigo-400" />
            </div>

            <div>
              <p className="text-gray-400">Transactions</p>
              <h2 className="text-2xl font-bold">{expenses.length}</h2>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-5 rounded-2xl shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <TagIcon className="w-6 h-6 text-white" />
            </div>

            <div>
              <p>Total Categories</p>
              <h2 className="text-2xl font-bold">{totalCategories}</h2>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid xl:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1e293b] p-5 rounded-2xl h-[320px]">
            <p className="mb-4 text-gray-400">Spending Trend</p>

            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={expenses}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                  <XAxis dataKey="title" hide />
                  <YAxis width={55} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl h-[320px]">
            <p className="mb-4 text-gray-400">Category Overview</p>

            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expenses}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis width={55} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="amount"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0f172a] text-gray-300">
              <tr>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {expenses.slice(0, 5).map((expense) => (
                <tr
                  key={expense._id}
                  className="border-t border-gray-700 hover:bg-[#273449] transition"
                >
                  <td className="py-4 px-6">{expense.title}</td>
                  <td className="py-4 px-6">{expense.category}</td>
                  <td className="py-4 px-6 text-right font-semibold">
                    ₹{Number(expense.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="w-80 px-6 py-8 hidden lg:block border-l border-gray-800">
        <div className="mb-8">
          <div className="flex items-center gap-3 text-gray-300 mb-2">
            <BanknotesIcon className="w-6 h-6 text-purple-400" />
            <p>My Wallet</p>
          </div>

          <h2 className="text-3xl font-bold text-white">
            ₹{totalAmount.toFixed(2)}
          </h2>

          <p className="text-sm text-gray-500 mt-1">Total tracked expenses</p>
        </div>

        <div>
          <h3 className="mb-4 text-gray-300 font-semibold">
            Recent Transactions
          </h3>

          <div className="space-y-3">
            {expenses
              .slice(-5)
              .reverse()
              .map((e) => (
                <div
                  key={e._id}
                  className="flex items-center justify-between border-b border-gray-800 pb-3"
                >
                  <div>
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-gray-500">{e.category}</p>
                  </div>

                  <p className="text-purple-400 font-semibold">
                    ₹{Number(e.amount).toFixed(0)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
