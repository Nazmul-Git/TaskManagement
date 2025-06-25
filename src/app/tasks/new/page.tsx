
import TaskForm from '@/app/Components/TaskForm';
import { Loading } from '@/app/Components/UI/Loading';
import { Suspense } from 'react';

export default function NewTaskPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <Suspense fallback={<Loading />}>
            <TaskForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}