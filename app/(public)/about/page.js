"use client";

import { FiInfo, FiUser, FiGithub, FiMail, FiCalendar } from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          About MyCalendar
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FiCalendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            About the Application
          </h2>
        </div>

        <div className="space-y-4 text-gray-600 dark:text-gray-400">
          <p>
            <strong className="text-gray-900 dark:text-white">
              MyCalendar
            </strong>{" "}
            is a modern web application designed to help you organize your tasks
            and events efficiently. Built with cutting-edge technologies, it
            offers a seamless experience across all your devices.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 my-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Key Features
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>📅 Interactive calendar view with task management</li>
              <li>🔒 Secure authentication with Firebase</li>
              <li>👤 User profile management</li>
              <li>📱 Fully responsive design for mobile and desktop</li>
              <li>✅ Create, edit, and delete tasks with ease</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Technology Stack
            </h3>
            <ul className="space-y-2">
              <li>
                <strong>Frontend:</strong> Next.js 16, React 19
              </li>
              <li>
                <strong>Styling:</strong> Tailwind CSS 4
              </li>
              <li>
                <strong>Backend:</strong> Firebase (Authentication & Firestore)
              </li>
              <li>
                <strong>Icons:</strong> React Icons (Feather Icons)
              </li>
              <li>
                <strong>Testing:</strong> Playwright
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <FiUser className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            About the Author
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              JC
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Jakub Czajor
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Full Stack Developer
              </p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            This application was created as a modern web development project
            showcasing best practices in React, Next.js, and Firebase
            integration. The goal was to build a practical, user-friendly
            calendar and task management system with enterprise-level security
            and scalability.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="mailto:jakub.czajor7@gmail.com"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <FiMail className="w-5 h-5" />
              Contact
            </a>
            <a
              href="https://github.com/JakubCzajor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors duration-200"
            >
              <FiGithub className="w-5 h-5" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
