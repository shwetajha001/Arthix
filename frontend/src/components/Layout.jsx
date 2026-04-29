import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  WalletIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  BanknotesIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/home", icon: HomeIcon },
    { name: "Expenses", path: "/expenses", icon: ClipboardDocumentListIcon },
    { name: "Analytics", path: "/analytics", icon: ChartPieIcon },
    { name: "Budget", path: "/budget", icon: BanknotesIcon },
    { name: "Categories", path: "/categories", icon: TagIcon },
    { name: "Profile", path: "/profile", icon: UserIcon },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1e293b] p-6 hidden md:flex flex-col">

        {/* LOGO */}
        <h1 className="text-2xl font-bold mb-10 text-purple-400 flex items-center gap-2">
          <WalletIcon className="w-8 h-8" />
          Arthix
        </h1>

        {/* MENU */}
        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                  ${
                    isActive
                      ? "bg-purple-600/20 text-purple-400"
                      : "text-gray-400 hover:bg-[#273449] hover:text-white"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>

      </aside>

      {/* PAGE CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}