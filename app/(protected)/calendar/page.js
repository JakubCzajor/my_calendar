"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/_lib/AuthContext";
import { db } from "@/app/_lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiCalendar,
} from "react-icons/fi";
import TaskModal from "./TaskModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("month"); // 'week' or 'month'

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );

        const q = query(
          collection(db, "tasks"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        const tasksMap = {};

        querySnapshot.forEach((doc) => {
          const task = doc.data();
          const taskDate = task.date.toDate();

          if (taskDate >= startOfMonth && taskDate <= endOfMonth) {
            const year = taskDate.getUTCFullYear();
            const month = String(taskDate.getUTCMonth() + 1).padStart(2, "0");
            const day = String(taskDate.getUTCDate()).padStart(2, "0");
            const dateKey = `${year}-${month}-${day}`;

            if (!tasksMap[dateKey]) {
              tasksMap[dateKey] = [];
            }
            tasksMap[dateKey].push({
              id: doc.id,
              ...task,
            });
          }
        });

        setTasks(tasksMap);
      } catch (err) {
        console.error("Error loading tasks:", err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user?.uid, currentDate]);

  const handleAddTask = (date) => {
    setSelectedDate(date);
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedDate(task.date.toDate());
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    const task = Object.values(tasks)
      .flat()
      .find((t) => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteDoc(doc(db, "tasks", taskToDelete.id));
      setTasks((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((date) => {
          updated[date] = updated[date].filter(
            (task) => task.id !== taskToDelete.id
          );
          if (updated[date].length === 0) {
            delete updated[date];
          }
        });
        return updated;
      });
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      let taskDate;
      if (typeof selectedDate === "string") {
        const [year, month, day] = selectedDate.split("-").map(Number);
        taskDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      } else {
        taskDate = new Date(
          Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0,
            0,
            0,
            0
          )
        );
      }

      if (editingTask) {
        await updateDoc(doc(db, "tasks", editingTask.id), {
          title: taskData.title,
          description: taskData.description,
          date: Timestamp.fromDate(taskDate),
          updatedAt: Timestamp.now(),
        });

        setTasks((prev) => {
          const updated = { ...prev };
          const dateKey = taskDate.toISOString().split("T")[0];
          const taskIndex = (updated[dateKey] || []).findIndex(
            (t) => t.id === editingTask.id
          );
          if (taskIndex !== -1) {
            updated[dateKey][taskIndex] = {
              ...updated[dateKey][taskIndex],
              title: taskData.title,
              description: taskData.description,
            };
          }
          return updated;
        });
      } else {
        const docRef = await addDoc(collection(db, "tasks"), {
          userId: user.uid,
          title: taskData.title,
          description: taskData.description,
          date: Timestamp.fromDate(taskDate),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        const dateKey = taskDate.toISOString().split("T")[0];
        setTasks((prev) => ({
          ...prev,
          [dateKey]: [
            ...(prev[dateKey] || []),
            {
              id: docRef.id,
              userId: user.uid,
              title: taskData.title,
              description: taskData.description,
              date: Timestamp.fromDate(taskDate),
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            },
          ],
        }));
      }

      setShowModal(false);
      setSelectedDate(null);
      setEditingTask(null);
    } catch (err) {
      console.error("Error saving task:", err);
      setError("Failed to save task");
    }
  };

  const getWeekDays = (date) => {
    const curr = new Date(date);
    const first = curr.getDate() - ((curr.getDay() + 6) % 7);
    const week = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      week.push(new Date(day));
    }

    return week;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return (day + 6) % 7;
  };

  const previousPeriod = () => {
    if (isMobile || viewMode === "week") {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
      );
    }
  };

  const nextPeriod = () => {
    if (isMobile || viewMode === "week") {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
      );
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  if (!user) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  const weekDays = getWeekDays(currentDate);
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const weekLabel = `${weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${weekEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const monthDays = [];
  for (let i = 0; i < firstDay; i++) {
    monthDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    monthDays.push(i);
  }

  return (
    <div className="mx-auto px-4 py-12">
      <div className="w-full px-2 sm:px-4 lg:px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Calendar
          </h1>

          {/* View Toggle - Desktop Only */}
          {!isMobile && (
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "week"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "month"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Month
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-6">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
            <button
              onClick={previousPeriod}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Previous"
            >
              <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-2 flex-1 justify-center">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white text-center">
                {isMobile || viewMode === "week" ? weekLabel : monthName}
              </h2>
            </div>

            <button
              onClick={nextPeriod}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Next"
            >
              <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Today Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={goToToday}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <FiCalendar className="w-4 h-4" />
              Today
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Loading calendar...
              </p>
            </div>
          ) : isMobile || viewMode === "week" ? (
            // Week View
            <div className="space-y-2">
              {weekDays.map((day, index) => {
                const dateStr = day.toISOString().split("T")[0];
                const dayTasks = tasks[dateStr] || [];
                const today = isToday(day);

                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 sm:p-4 ${
                      today
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            today
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {day.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </span>
                        <span
                          className={`text-xl sm:text-2xl font-bold ${
                            today
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {day.getDate()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {day.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddTask(dateStr)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Add task"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-2">
                      {dayTasks.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No tasks
                        </p>
                      ) : (
                        dayTasks.map((task) => (
                          <div
                            key={task.id}
                            className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-blue-900 dark:text-blue-200">
                                  {task.title}
                                </p>
                                {task.description && (
                                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                                  title="Edit task"
                                >
                                  <FiEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors"
                                  title="Delete task"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Month View
            <>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2 text-xs sm:text-sm"
                    >
                      {window.innerWidth < 640 ? day.charAt(0) : day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 auto-rows-fr">
                {monthDays.map((day, index) => {
                  const dateStr =
                    day !== null
                      ? new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        )
                          .toISOString()
                          .split("T")[0]
                      : null;

                  const dayTasks = dateStr ? tasks[dateStr] || [] : [];
                  const today =
                    day !== null &&
                    isToday(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                    );

                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-1 sm:p-2 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] ${
                        day === null
                          ? "bg-gray-50 dark:bg-gray-900"
                          : today
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                      }`}
                    >
                      {day !== null && (
                        <div className="h-full flex flex-col">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs sm:text-sm font-semibold ${
                                today
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {day}
                            </span>
                            <button
                              onClick={() => handleAddTask(dateStr)}
                              className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 rounded transition-colors"
                              title="Add task"
                            >
                              <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>

                          {/* Tasks List */}
                          <div className="flex-1 overflow-y-auto space-y-1">
                            {dayTasks.map((task) => (
                              <div
                                key={task.id}
                                className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded p-1 text-xs"
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-blue-900 dark:text-blue-200 truncate text-xs">
                                      {task.title}
                                    </p>
                                    {task.description && (
                                      <p className="text-blue-700 dark:text-blue-300 truncate text-[10px] hidden sm:block">
                                        {task.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1 flex-shrink-0">
                                    <button
                                      onClick={() => handleEditTask(task)}
                                      className="p-0.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
                                      title="Edit task"
                                    >
                                      <FiEdit className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-0.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-800 rounded transition-colors"
                                      title="Delete task"
                                    >
                                      <FiTrash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Task Modal */}
        <TaskModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedDate(null);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          task={editingTask}
          date={selectedDate}
        />

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setTaskToDelete(null);
          }}
          onConfirm={confirmDeleteTask}
          taskTitle={taskToDelete?.title}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
