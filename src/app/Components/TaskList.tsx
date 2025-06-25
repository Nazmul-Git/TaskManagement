// Components/TaskList.tsx
import { format, isValid } from 'date-fns';
import Link from 'next/link';
import { Button } from './UI/Button';
import { Task } from '../types/task';
import DeleteButton from './UI/DeleteButton';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No tasks found. Create a new task to get started!
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {tasks.map((task) => (
          <tr key={task.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-medium text-gray-900">{task.title}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(task.dueDate)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <Link href={`/tasks/${task.id}`}>
                  <Button variant="secondary">View</Button>
                </Link>
                <Link href={`/tasks/${task.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <DeleteButton taskId={task.id} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}