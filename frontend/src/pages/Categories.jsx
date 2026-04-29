import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CurrencyRupeeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../api";

const COLORS = [
  "bg-purple-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-sky-500",
];

export default function Categories() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/api/expenses");
        setExpenses(res.data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not load categories"));
      }
    };

    fetchExpenses();
  }, []);

  const categories = useMemo(() => {
    const grouped = expenses.reduce((acc, expense) => {
      const name = expense.category || "General";
      const amount = Number(expense.amount || 0);

      if (!acc[name]) {
        acc[name] = {
          name,
          amount: 0,
          count: 0,
          latest: expense.date,
        };
      }

      acc[name].amount += amount;
      acc[name].count += 1;

      if (expense.date && new Date(expense.date) > new Date(acc[name].latest)) {
        acc[name].latest = expense.date;
      }

      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const totalAmount = categories.reduce((sum, category) => sum + category.amount, 0);
  const topCategory = categories[0];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-400 mt-1">
            Review where your money is going across spending groups
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/expenses")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-5 py-3 rounded-xl font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Manage Expenses
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1e293b] border border-gray-700 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <TagIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400">Total Categories</p>
            <h2 className="text-2xl font-bold">{categories.length}</h2>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-gray-700 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <CurrencyRupeeIcon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-gray-400">Tracked Spending</p>
            <h2 className="text-2xl font-bold">Rs {totalAmount.toFixed(2)}</h2>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p>Top Category</p>
            <h2 className="text-2xl font-bold">{topCategory?.name || "N/A"}</h2>
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] border border-gray-700 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 bg-[#0f172a] text-gray-300 px-6 py-4 font-medium">
          <span className="col-span-4">Category</span>
          <span className="col-span-3">Transactions</span>
          <span className="col-span-3">Share</span>
          <span className="col-span-2 text-right">Amount</span>
        </div>

        {categories.map((category, index) => {
          const percent = totalAmount ? (category.amount / totalAmount) * 100 : 0;
          const color = COLORS[index % COLORS.length];

          return (
            <div
              key={category.name}
              className="grid grid-cols-12 items-center border-t border-gray-700 px-6 py-5 hover:bg-[#273449] transition"
            >
              <div className="col-span-4 flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${color}`} />
                <span className="font-semibold">{category.name}</span>
              </div>

              <span className="col-span-3 text-gray-300">
                {category.count} {category.count === 1 ? "entry" : "entries"}
              </span>

              <div className="col-span-3 pr-6">
                <div className="h-2 rounded-full bg-[#0f172a] overflow-hidden">
                  <div
                    className={`h-full ${color}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{percent.toFixed(0)}%</p>
              </div>

              <span className="col-span-2 text-right font-semibold">
                Rs {category.amount.toFixed(2)}
              </span>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No categories yet. Add expenses to see your breakdown.
          </div>
        )}
      </div>
    </div>
  );
}
