import { useEffect, useState } from "react";
import api from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [total, setTotal] = useState(0);
  const [topCategory, setTopCategory] = useState("");

  const fetchData = async () => {
    const res = await api.get("/api/expenses");

    const expenses = res.data;

    // TOTAL
    const totalAmount = expenses.reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0
    );
    setTotal(totalAmount);

    // CATEGORY GROUPING
    const grouped = {};
    expenses.forEach((e) => {
      if (!grouped[e.category]) grouped[e.category] = 0;
      grouped[e.category] += Number(e.amount);
    });

    const chartData = Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));

    setData(chartData);

    // TOP CATEGORY
    let max = 0;
    let top = "";
    chartData.forEach((c) => {
      if (c.value > max) {
        max = c.value;
        top = c.name;
      }
    });
    setTopCategory(top);

    // MONTHLY DATA
    const monthly = {};
    expenses.forEach((e) => {
      const month = new Date(e.date).toLocaleString("default", {
        month: "short",
      });

      if (!monthly[month]) monthly[month] = 0;
      monthly[month] += Number(e.amount);
    });

    const line = Object.keys(monthly).map((m) => ({
      month: m,
      amount: monthly[m],
    }));

    setLineData(line);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = ["#8b5cf6", "#6366f1", "#ec4899", "#22c55e", "#f97316"];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">

        <div className="bg-[#1e293b] p-5 rounded-2xl">
          <p className="text-gray-400">Total Spending</p>
          <h2 className="text-2xl font-bold">₹{total.toFixed(2)}</h2>
        </div>

        <div className="bg-[#1e293b] p-5 rounded-2xl">
          <p className="text-gray-400">Top Category</p>
          <h2 className="text-2xl font-bold">{topCategory || "N/A"}</h2>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-5 rounded-2xl">
          <p>Insights</p>
          <h2 className="text-lg font-bold">
            Track your spending smartly
          </h2>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PIE */}
        <div className="bg-[#1e293b] p-6 rounded-2xl h-[350px]">
          <p className="mb-4 text-gray-400">Category Breakdown</p>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="bg-[#1e293b] p-6 rounded-2xl h-[350px]">
          <p className="mb-4 text-gray-400">Monthly Trend</p>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}
