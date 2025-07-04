'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loading } from './Components/UI/Loading';
import { Task, TaskStatus } from './types/task';
import { fetchTasks, deleteTask } from './lib/api';
import TaskList from './Components/TaskList';
import TaskCardList from './Components/TaskCardList';
import { toast } from 'react-toastify';

type StatusFilter = TaskStatus | 'all';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [currentStatus, setCurrentStatus] = useState<StatusFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Calculate completed tasks count
  const completedTasksCount = tasks.filter(task => task.status === 'completed').length;

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Filter tasks whenever status or tasks change
  useEffect(() => {
    if (currentStatus === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === currentStatus));
    }
  }, [currentStatus, tasks]);

  const handleStatusChange = (status: StatusFilter) => {
    setCurrentStatus(status);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        setDeletingId(taskId);
        await deleteTask(taskId);
        
        // Optimistically update both tasks and filteredTasks
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
        const data = await fetchTasks();
        setTasks(data);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Task Dashboard</h1>
        <Link
          href="/tasks/new"
          className="text-black cursor-pointer rounded-sm bg-gray-300 px-4 py-1.5 duration-700 hover:scale-105 hover:bg-black hover:text-white dark:text-black dark:hover:text-white"
        >
          Create New Task
        </Link>
      </div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2 w-full sm:w-auto">
          {(['all', 'pending', 'completed'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer flex items-center ${
                currentStatus === status
                  ? `${
                      status === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    } shadow-inner`
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {currentStatus === status && (
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="light:text-black dark:text-white text-sm font-medium mr-2">Total:</span>
            <span className="text-xl font-bold text-blue-600">{tasks?.length}</span>
          </div>
          <div className="flex items-center">
            <span className="light:text-black dark:text-white text-sm font-medium mr-2">Completed:</span>
            <span className="text-xl font-bold text-green-600">{completedTasksCount}</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <Loading />
        ) : isMobile ? (
          <TaskCardList 
            tasks={filteredTasks} 
            onDeleteTask={handleDeleteTask} 
            deletingId={deletingId}
          />
        ) : (
          <TaskList 
            tasks={filteredTasks} 
            onDeleteTask={handleDeleteTask} 
            deletingId={deletingId}
          />
        )}
      </div>
    </div>
  );
}