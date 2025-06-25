
import Link from 'next/link';
import { Suspense } from 'react';
import { Loading } from './Components/UI/Loading';
import { Button } from './Components/UI/Button';
import { TaskStatus } from './types/task';
import { fetchTasks } from './lib/api';
import TaskList from './Components/TaskList';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { status?: TaskStatus };
}) {
  const tasks = await fetchTasks(searchParams.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Dashboard</h1>
        <Link href="/tasks/new">
          <Button variant="primary">Add New Task</Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          <Link href="/" className={`px-4 py-2 rounded-md ${!searchParams.status ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
            All
          </Link>
          <Link href="/?status=pending" className={`px-4 py-2 rounded-md ${searchParams.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
            Pending
          </Link>
          <Link href="/?status=completed" className={`px-4 py-2 rounded-md ${searchParams.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
            Completed
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Suspense fallback={<Loading />}>
          <TaskList tasks={tasks} />
        </Suspense>
      </div>
    </div>
  );
}