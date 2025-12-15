"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_lib/AuthContext";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import { FiMail, FiArrowLeft } from "react-icons/fi";

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
      signOut(auth);
    }
  }, [user, auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <FiMail className="w-16 h-16 text-blue-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Verify Your Email
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          A verification link has been sent to:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {userEmail}
          </span>
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            Please check your email and click the verification link to complete
            your registration. The link will expire in 24 hours.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Didn&apos;t receive an email? Check your spam folder or try
            registering again.
          </p>

          <Link
            href="/user/register"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Register Again
          </Link>

          <Link
            href="/user/signin"
            className="inline-flex items-center justify-center space-x-2 w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
