'use client'
import { format, isValid } from 'date-fns';
import Link from 'next/link';
import { Task } from '../types/task';
import { useRouter } from 'next/navigation';
import { deleteTask } from '../lib/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  deletingId: string | null;
}

type SortOrder = 'asc' | 'desc';

export default function TaskList({ tasks, onDeleteTask, deletingId }: TaskListProps) {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        onDeleteTask(taskId);
        toast.success('Task deleted successfully');
        router.refresh();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.due_date).getTime();
    const dateB = new Date(b.due_date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  if (tasks?.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="show"
        variants={emptyStateVariants}
        className="flex flex-col items-center justify-center p-12 text-center dark:bg-gray-900 dark:text-white"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            transition: { repeat: Infinity, repeatType: "reverse", duration: 3 }
          }}
          className="w-24 h-24 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-indigo-400 dark:text-indigo-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No tasks found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first task</p>
        <Link
          href="/tasks/new"
          className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-1"
        >
          <svg
            className="-ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Task
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/25"
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
          <tr>
            <th className="px-8 py-5 text-left text-sm font-semibold text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">
              Task Details
            </th>
            <th className="px-6 py-5 text-left text-sm font-semibold text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">
              Status
            </th>
            <th
              className="px-6 py-5 text-left text-sm font-semibold text-indigo-800 dark:text-indigo-200 uppercase tracking-wider cursor-pointer"
              onClick={toggleSortOrder}
            >
              <div className="flex items-center">
                Due Date
                <motion.span
                  animate={{ rotate: sortOrder === 'asc' ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                  className="ml-1"
                >
                  {sortOrder === 'asc' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </motion.span>
              </div>
            </th>
            <th className="px-6 py-5 text-left text-sm font-semibold text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {sortedTasks?.map((task) => (
              <motion.tr
                key={task.id}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                whileHover={{ scale: 1.01 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-4"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-lg">{task?.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {task?.description?.length > 50 ? task?.description.slice(0, 50) + '...' : task.description || 'No description provided'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${task?.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : task?.status === 'pending'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      }`}
                  >
                    {task?.status.charAt(0).toUpperCase() + task?.status.slice(1)}
                  </motion.span>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-200 font-medium">
                    {formatDate(task.due_date)}
                  </div>
                  <div
                    className={`text-xs mt-1 ${new Date(task?.due_date) < new Date() && task?.status !== 'completed'
                        ? 'text-red-500 dark:text-red-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    {new Date(task?.due_date) < new Date() && task?.status !== 'completed'
                      ? 'Overdue'
                      : ''}
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={`/tasks/${task?.id}`}
                        className="text-black dark:text-gray-300 flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-sm bg-gray-300 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={`/tasks/${task?.id}/edit`}
                        className="text-black dark:text-gray-300 flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-sm bg-gray-300 dark:bg-gray-700 hover:bg-blue-700 dark:hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={() => handleDelete(task?.id)}
                        disabled={deletingId === task?.id}
                        className={`text-black dark:text-gray-300 flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-sm bg-gray-300 dark:bg-gray-700 hover:bg-red-700 dark:hover:bg-red-600 hover:text-white transition-all duration-300 ${deletingId === task?.id ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                      >
                        {deletingId === task?.id ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </motion.div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
}