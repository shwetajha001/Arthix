import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../api";

export default function Profile() {
  const [expenses, setExpenses] = useState([]);
  const [budgetInput, setBudgetInput] = useState("");
  const [budget, setBudget] = useState(Number(localStorage.getItem("budget") || 0));
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/api/expenses");
        setExpenses(res.data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not load profile summary"));
      }
    };

    fetchExpenses();
  }, []);

  const totalSpent = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );
  const categories = new Set(expenses.map((expense) => expense.category || "General"));
  const remaining = budget - totalSpent;
  const budgetUsed = budget ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const joinedDate = user.id
    ? new Date(Number.parseInt(user.id.slice(0, 8), 16) * 1000).toLocaleDateString()
    : "Not available";

  const handleBudgetSave = () => {
    const value = Number(budgetInput);

    if (!value || value < 0) {
      toast.error("Enter a valid budget amount");
      return;
    }

    localStorage.setItem("budget", String(value));
    setBudget(value);
    setBudgetInput("");
    toast.success("Budget updated");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-400 mt-1">
            Account details and spending preferences
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-xl font-medium"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="grid xl:grid-cols-[360px_1fr] gap-6">
        <aside className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <UserCircleIcon className="w-16 h-16 text-purple-400" />
            </div>

            <h2 className="text-2xl font-bold">{user.name || "Arthix User"}</h2>
            <p className="text-gray-400 mt-1">{user.email || "No email saved"}</p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <EnvelopeIcon className="w-5 h-5 text-purple-400" />
              <span className="truncate">{user.email || "Not available"}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <CalendarDaysIcon className="w-5 h-5 text-purple-400" />
              <span>Joined {joinedDate}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <ShieldCheckIcon className="w-5 h-5 text-purple-400" />
              <span>Authenticated account</span>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1e293b] border border-gray-700 p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <WalletIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400">Total Spent</p>
                <h2 className="text-2xl font-bold">Rs {totalSpent.toFixed(2)}</h2>
              </div>
            </div>

            <div className="bg-[#1e293b] border border-gray-700 p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-gray-400">Monthly Budget</p>
                <h2 className="text-2xl font-bold">Rs {budget.toFixed(2)}</h2>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-5 rounded-2xl">
              <p>Categories Used</p>
              <h2 className="text-2xl font-bold">{categories.size}</h2>
            </div>
          </div>

          <section className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-5">Budget Preference</h3>

            <div className="grid md:grid-cols-[1fr_auto] gap-4">
              <input
                type="number"
                min="0"
                placeholder="Set monthly budget"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="bg-[#0f172a] border border-gray-700 px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="button"
                onClick={handleBudgetSave}
                className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-semibold"
              >
                Save Budget
              </button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Usage</span>
                <span>{budgetUsed.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-[#0f172a] rounded-full overflow-hidden">
                <div
                  className={remaining < 0 ? "h-full bg-red-500" : "h-full bg-purple-500"}
                  style={{ width: `${budgetUsed}%` }}
                />
              </div>
              <p className={`mt-3 font-medium ${remaining < 0 ? "text-red-400" : "text-green-400"}`}>
                {budget
                  ? `Remaining: Rs ${remaining.toFixed(2)}`
                  : "Set a budget to track remaining balance"}
              </p>
            </div>
          </section>

          <section className="bg-[#1e293b] border border-gray-700 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#0f172a]">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>

            {expenses.slice(0, 5).map((expense) => (
              <div
                key={expense._id}
                className="flex items-center justify-between border-t border-gray-700 px-6 py-4"
              >
                <div>
                  <p className="font-medium">{expense.title}</p>
                  <p className="text-sm text-gray-400">{expense.category || "General"}</p>
                </div>
                <p className="font-semibold text-purple-400">
                  Rs {Number(expense.amount || 0).toFixed(2)}
                </p>
              </div>
            ))}

            {expenses.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                No activity yet. Add expenses to build your profile summary.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
