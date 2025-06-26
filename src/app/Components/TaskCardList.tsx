import { Task } from '../types/task';
import Link from 'next/link';

export default function TaskCardList({ tasks }: { tasks: Task[] }) {
    const handleDelete = (taskId: string) => {
        // Add your delete logic here
        console.log('Deleting task:', taskId);
        // Typically you would call an API here and then update state
    };

    return (
        <div className="p-4 space-y-4">
            {tasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No tasks found</p>
            ) : (
                tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-lg truncate">{task.title}</h3>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ml-2 ${task.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {task.status}
                            </span>
                        </div>

                        {task.description && (
                            <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        <div className="mt-3 text-sm text-gray-500">
                            {task.dueDate && (
                                <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <Link href={`/tasks/${task.id}`} className="cursor-pointer rounded-sm bg-gray-300 px-4 py-1 ">
                                View
                            </Link>
                            <Link href={`/tasks/${task.id}/edit`} className="cursor-pointer rounded-sm bg-gray-300 px-4 py-1 text-blue-700">
                                Edit
                            </Link>
                            <button className="cursor-pointer rounded-sm bg-gray-300 px-4 py-1 text-red-700"
                                onClick={() => handleDelete(task.id)}
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                ))
            )}
        </div>
    );
}