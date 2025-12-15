"use client";

import { useAuth } from "@/app/_lib/AuthContext";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";

export default function SignOutPage() {
  const auth = getAuth();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Sign Out
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to sign out, {user?.email}?
        </p>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
