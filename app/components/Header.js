"use client";
import Link from "next/link";
import { useAuth } from "@/app/_lib/AuthContext";
import { FiMenu, FiUser } from "react-icons/fi";
import Image from "next/image";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Hamburger (mobile & tablet only) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            MyCalendar
          </h2>
        </div>

        {/* Right */}
        {user ? (
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <Image
                width={10}
                height={10}
                unoptimized
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FiUser className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}

            <Link
              href="/user/profile"
              className="hidden sm:block px-3 py-2 text-blue-600 dark:text-blue-400"
            >
              Profile
            </Link>

            <Link
              href="/user/signout"
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/user/signin"
              className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign In
            </Link>

            <Link
              href="/user/register"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
