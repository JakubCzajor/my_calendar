"use client";

import Link from "next/link";
import { useAuth } from "@/app/_lib/AuthContext";
import {
  FiX,
  FiHome,
  FiLogIn,
  FiUserPlus,
  FiCalendar,
  FiUser,
  FiInfo,
} from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      // Tailwind 'lg' breakpoint
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64
          bg-white dark:bg-gray-800 shadow-lg
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Menu</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleLinkClick}
            >
              <FiHome /> Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/user/profile"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleLinkClick}
                >
                  <FiUser /> Profile
                </Link>
                <Link
                  href="/calendar"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleLinkClick}
                >
                  <FiCalendar /> Calendar
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/user/signin"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleLinkClick}
                >
                  <FiLogIn /> Sign In
                </Link>
                <Link
                  href="/user/register"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleLinkClick}
                >
                  <FiUserPlus /> Register
                </Link>
              </>
            )}
            <Link
              href="/about"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleLinkClick}
            >
              <FiInfo /> About
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
