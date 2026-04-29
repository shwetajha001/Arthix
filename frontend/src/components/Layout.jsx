import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  WalletIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  BanknotesIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
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

  const activePage = menu.find((item) => item.path === location.pathname);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-10 text-purple-400 flex items-center gap-2">
        <WalletIcon className="w-8 h-8" />
        Arthix
      </h1>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                isActive
                  ? "bg-purple-600/20 text-purple-400"
                  : "text-gray-400 hover:bg-[#273449] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white md:flex">
      <aside className="hidden md:flex md:w-64 md:shrink-0 bg-[#1e293b] p-6 flex-col">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-30 md:hidden bg-[#1e293b] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-lg bg-[#0f172a] border border-gray-700 flex items-center justify-center"
          aria-label="Open navigation"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <WalletIcon className="w-6 h-6" />
          <span>{activePage?.name || "Arthix"}</span>
        </div>

        <div className="w-10" />
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation overlay"
          />

          <aside className="relative h-full w-[82vw] max-w-xs bg-[#1e293b] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 w-9 h-9 rounded-lg bg-[#0f172a] border border-gray-700 flex items-center justify-center"
              aria-label="Close navigation"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
