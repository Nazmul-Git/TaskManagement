
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchTask } from '../../../lib/api';
import { Loading } from '../../../Components/UI/Loading';
import TaskForm from '../../../Components/TaskForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: PageProps) {
  try {
    const unwrappedParams = await params;
    const task = await fetchTask(unwrappedParams.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <Suspense fallback={<Loading />}>
              <TaskForm defaultValues={task} isEditing={true} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}