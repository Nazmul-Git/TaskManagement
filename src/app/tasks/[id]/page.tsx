
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchTask } from '@/app/lib/api';
import { Button } from '@/app/Components/UI/Button';
import DeleteButton from '@/app/Components/UI/DeleteButton';

export default async function TaskPage({ params }: { params: { id: string } }) {
  try {
    const task = await fetchTask(params.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold">{task.title}</h1>
              <div className="flex space-x-2">
                <Link href={`/tasks/${task.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <DeleteButton taskId={task.id} />
              </div>
            </div>

            <div className="mb-4">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
              <p className="mt-1 text-sm text-gray-900">
                {format(new Date(task.due_date), 'MMMM dd, yyyy')}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {task.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}