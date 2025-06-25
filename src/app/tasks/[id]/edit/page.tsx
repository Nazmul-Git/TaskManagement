
import TaskForm from '@/app/Components/TaskForm';
import { Loading } from '@/app/Components/UI/Loading';
import { fetchTask } from '@/app/lib/api';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  try {
    const task = await fetchTask(params.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <Suspense fallback={<Loading />}>
              <TaskForm defaultValues={task} isEditing />
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}