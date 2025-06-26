'use client'
import Link from 'next/link'
import { Task } from '../types/task'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { format } from 'date-fns'

interface TaskCardListProps {
  tasks: Task[]
  onDeleteTask: (taskId: string) => void
  deletingId: string | null
}

type SortOrder = 'asc' | 'desc'

export default function TaskCardList({ tasks, onDeleteTask, deletingId }: TaskCardListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // Handle cases where due_date might be missing
    if (!a.due_date && !b.due_date) return 0
    if (!a.due_date) return sortOrder === 'asc' ? 1 : -1
    if (!b.due_date) return sortOrder === 'asc' ? -1 : 1

    const dateA = new Date(a.due_date).getTime()
    const dateB = new Date(b.due_date).getTime()
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
  })

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM dd, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium dark:text-white">Tasks</h2>
        <motion.button
          onClick={toggleSortOrder}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Sort by Due Date</span>
          <motion.span
            animate={{ rotate: sortOrder === 'asc' ? 0 : 180 }}
            transition={{ duration: 0.2 }}
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
        </motion.button>
      </div>

      {sortedTasks.length === 0 ? (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 dark:text-gray-400 py-8"
        >
          No tasks found
        </motion.p>
      ) : (
        <AnimatePresence>
          {sortedTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow
                        dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-gray-700/50"
              layout
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-black dark:text-white font-medium text-lg truncate">
                    {task.title}
                  </h3>
                </div>
                <motion.span 
                  className={`px-2 py-1 text-xs rounded-full ml-2 ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {task.status}
                </motion.span>
              </div>

              {task.description && (
                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {task?.description?.length > 50 ? task?.description.slice(0, 50) + '...' : task.description}
                </motion.p>
              )}

              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {task.due_date && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Due: {formatDate(task.due_date)}
                    {new Date(task.due_date) < new Date() && task.status !== 'completed' && (
                      <span className="ml-2 text-red-500 dark:text-red-400">(Overdue)</span>
                    )}
                  </motion.p>
                )}
              </div>

              <motion.div 
                className="mt-4 flex justify-end gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link 
                  href={`/tasks/${task.id}`} 
                  className="text-black dark:text-white cursor-pointer rounded-sm 
                            bg-gray-300 dark:bg-gray-700 px-4 py-1 
                            hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  View
                </Link>
                <Link 
                  href={`/tasks/${task.id}/edit`} 
                  className="cursor-pointer rounded-sm bg-gray-300 dark:bg-gray-700 px-4 py-1 
                            text-blue-700 dark:text-blue-400 hover:bg-gray-400 dark:hover:bg-gray-600 
                            transition-colors"
                >
                  Edit
                </Link>
                <motion.button 
                  className={`cursor-pointer rounded-sm px-4 py-1 ${
                    deletingId === task.id
                      ? 'bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      : 'bg-gray-300 dark:bg-gray-700 text-red-700 dark:text-red-400 hover:bg-gray-400 dark:hover:bg-gray-600'
                  } transition-colors`}
                  onClick={() => onDeleteTask(task.id)}
                  disabled={deletingId === task.id}
                  whileHover={{ scale: deletingId === task.id ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {deletingId === task.id ? 'Deleting...' : 'Delete'}
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}