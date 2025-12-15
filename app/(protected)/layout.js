"use client";

import { useAuth } from "@/app/_lib/AuthContext";
import { useLayoutEffect } from "react";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";

function Protected({ children }) {
  const { user, loading } = useAuth();

  useLayoutEffect(() => {
    if (!loading && !user) {
      redirect(`/user/signin`);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default Protected;
