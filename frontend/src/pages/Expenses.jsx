import { useEffect, useState, useCallback } from "react";
import api, { getErrorMessage } from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/api/expenses");

      setExpenses(res.data);
      setFiltered(res.data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load expenses"));
    }
  };

  const applyFilters = useCallback(() => {
    let data = [...expenses];

    if (search) {
      data = data.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      data = data.filter((e) => e.category === categoryFilter);
    }

    setFiltered(data);
  }, [expenses, search, categoryFilter]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, categoryFilter, expenses, applyFilters]);

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.category) {
      alert("Please fill all fields");
      return;
    }

    const cleanData = {
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
    };

    try {
      if (editId) {
        await api.put(`/api/expenses/${editId}`, cleanData);
        setEditId(null);
      } else {
        await api.post("/api/expenses", cleanData);
      }

      setForm({ title: "", amount: "", category: "" });
      fetchExpenses();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save expense"));
    }
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete expense"));
    }
  };

  const editExpense = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
    });

    setEditId(expense._id);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ title: "", amount: "", category: "" });
  };

  const categories = [...new Set(expenses.map((e) => e.category))];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Expenses</h1>
          <p className="text-gray-400 mt-1">
            Add, update, delete and filter your spending records
          </p>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-5 py-3 rounded-xl font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-[#1e293b] border border-gray-700 rounded-2xl p-5 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 pl-10 pr-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="relative">
            <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-[#1e293b] border border-gray-700 p-6 rounded-2xl mb-6">
        <div className="flex items-center gap-2 mb-5">
          <PlusIcon className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold">
            {editId ? "Edit Expense" : "Add New Expense"}
          </h3>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Expense title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-[#0f172a] border border-gray-700 px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="bg-[#0f172a] border border-gray-700 px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="bg-[#0f172a] border border-gray-700 px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition px-4 py-3 rounded-xl font-semibold"
            >
              {editId ? "Update" : "Add"}
            </button>

            {editId && (
              <button
                onClick={cancelEdit}
                className="bg-gray-600 hover:bg-gray-700 transition px-4 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#1e293b] border border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0f172a] text-gray-300">
            <tr>
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Amount</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((expense) => (
              <tr
                key={expense._id}
                className="border-t border-gray-700 hover:bg-[#273449] transition"
              >
                <td className="py-4 px-6 font-medium">{expense.title}</td>

                <td className="py-4 px-6">
                  <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-sm">
                    {expense.category || "General"}
                  </span>
                </td>

                <td className="py-4 px-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString()
                      : "No date"}
                  </div>
                </td>

                <td className="py-4 px-6 text-right font-semibold">
                  ₹{Number(expense.amount).toFixed(2)}
                </td>

                <td className="py-4 px-6">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => editExpense(expense)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteExpense(expense._id)}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
