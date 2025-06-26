'use client'

import { format } from 'date-fns'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { use } from 'react'
import { deleteTask, fetchTask } from '../../lib/api'
import { Loading } from '../../Components/UI/Loading'

export default function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  
  const unwrappedParams = use(params)
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await fetchTask(unwrappedParams.id)
        setTask(data)
      } catch (error) {
        notFound()
      } finally {
        setLoading(false)
      }
    }
    loadTask()
  }, [unwrappedParams?.id])

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        setDeletingId(taskId)
        await deleteTask(taskId)
        toast.success('Task deleted successfully')
        router.push('/tasks')
      } catch (error) {
        toast.error('Failed to delete task')
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading/>
      </div>
    )
  }

  if (!task) {
    return notFound()
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 py-8">
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-black text-2xl font-bold dark:text-white">{task.title}</h1>
                <div className="flex space-x-2">
                  <Link
                    href={`/tasks/${task.id}/edit`}
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

                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={deletingId === task.id}
                    className={`text-black dark:text-gray-300 flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-sm bg-gray-300 dark:bg-gray-700 hover:bg-red-700 dark:hover:bg-red-600 hover:text-white transition-all duration-300 ${
                      deletingId === task.id ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {deletingId === task.id ? (
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
                </div>
              </div>

              <div className="mb-4">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task?.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {task?.status}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                  {format(new Date(task?.due_date), 'MMMM dd, yyyy')}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-200 whitespace-pre-line">
                  {task.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}