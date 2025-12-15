"use client";

import Link from "next/link";
import { useAuth } from "@/app/_lib/AuthContext";
import { FiArrowRight } from "react-icons/fi";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to MyCalendar
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your personal task and calendar management solution
        </p>
      </div>

      {user ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Hello, {user.displayName ? user.displayName : user.email}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You are successfully logged in. You can now access protected pages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/calendar"
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <span>View Calendar</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/user/signout"
              className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <span>Sign Out</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              New User?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create a new account and get started in just a few clicks.
            </p>
            <Link
              href="/user/register"
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <span>Register Now</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Existing User?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sign in to your account to access your profile and settings.
            </p>
            <Link
              href="/user/signin"
              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <span>Sign In Now</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
