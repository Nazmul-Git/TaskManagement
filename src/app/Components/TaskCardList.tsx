'use client'
import Link from 'next/link';
import { Task } from '../types/task';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCardListProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  deletingId: string | null;
}

export default function TaskCardList({ tasks, onDeleteTask, deletingId }: TaskCardListProps) {
  return (
    <div className="p-4 space-y-4">
      {tasks.length === 0 ? (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 py-8"
        >
          No tasks found
        </motion.p>
      ) : (
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              layout
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-black font-medium text-lg truncate">{task.title}</h3>
                </div>
                <motion.span 
                  className={`px-2 py-1 text-xs rounded-full ml-2 ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {task.status}
                </motion.span>
              </div>

              {task.description && (
                <motion.p 
                  className="text-gray-600 mt-2 text-sm line-clamp-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {task.description}
                </motion.p>
              )}

              <div className="mt-3 text-sm text-gray-500">
                {task.due_date && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Due: {new Date(task.due_date).toLocaleDateString()}
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
                  className="text-black cursor-pointer rounded-sm bg-gray-300 px-4 py-1 hover:bg-gray-400 transition-colors"
                >
                  View
                </Link>
                <Link 
                  href={`/tasks/${task.id}/edit`} 
                  className="cursor-pointer rounded-sm bg-gray-300 px-4 py-1 text-blue-700 hover:bg-gray-400 transition-colors"
                >
                  Edit
                </Link>
                <motion.button 
                  className={`cursor-pointer rounded-sm px-4 py-1 ${
                    deletingId === task.id
                      ? 'bg-gray-400 text-gray-700'
                      : 'bg-gray-300 text-red-700 hover:bg-gray-400'
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
  );
}