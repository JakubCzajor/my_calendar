"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/_lib/AuthContext";
import { updateProfile } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { db } from "@/app/_lib/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FiUser, FiSave, FiMapPin } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuth();
  const auth = getAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
    street: "",
    city: "",
    zipCode: "",
  });

  // Load user address data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;

      try {
        setDataLoading(true);
        const docSnap = await getDoc(doc(db, "users", user.uid));

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.address) {
            setFormData((prev) => ({
              ...prev,
              street: userData.address.street || "",
              city: userData.address.city || "",
              zipCode: userData.address.zipCode || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadUserData();
  }, [user?.uid]);

  if (!user) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: formData.displayName,
          photoURL: formData.photoURL,
          address: {
            street: formData.street,
            city: formData.city,
            zipCode: formData.zipCode,
          },
        },
        { merge: true }
      );

      console.log("Profile updated successfully");
      setSuccess("Profile updated successfully!");
      setLoading(false);
    } catch (error) {
      setError(error.message || "Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-12">
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {user.photoURL ? (
              <Image
                width={12}
                height={12}
                unoptimized
                src={user.photoURL}
                alt={user.displayName || "Profile"}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <FiUser className="w-12 h-12 text-blue-600" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user.displayName || "No name set"}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <p className="text-green-800 dark:text-green-200 text-sm">
              {success}
            </p>
          </div>
        )}

        {dataLoading ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            Loading profile data...
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 mb-8">
            {/* Profile Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Information
              </h2>

              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Your name"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="photoURL"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  id="photoURL"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="https://example.com/photo.jpg"
                />
                {formData.photoURL && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Preview:
                    </p>
                    <Image
                      width={20}
                      height={20}
                      unoptimized
                      src={formData.photoURL}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = "";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="border-t pt-6">
              <h2 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <FiMapPin className="w-5 h-5" />
                <span>Address</span>
              </h2>

              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Street
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Street address"
                  disabled={dataLoading}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="City"
                    disabled={dataLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="ZIP Code"
                    disabled={dataLoading}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || dataLoading}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <FiSave className="w-5 h-5" />
              <span>{loading ? "Saving..." : "Save Profile"}</span>
            </button>
          </form>
        )}

        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Account Information
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                User ID
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                {user.uid}
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Email Verified
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.emailVerified ? (
                  <span className="text-green-600">✓ Verified</span>
                ) : (
                  <span className="text-orange-600">⚠ Not Verified</span>
                )}
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Account Created
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/user/changepassword"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Change Password
          </Link>
          <Link
            href="/user/signout"
            className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}
