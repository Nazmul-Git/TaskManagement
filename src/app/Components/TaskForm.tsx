'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createTask, updateTask } from '../lib/api';
import { Button } from './UI/Button';
import { Task } from '../types/task';
import { useForm } from 'react-hook-form';

interface TaskFormProps {
  defaultValues?: Partial<Task>;
  isEditing?: boolean;
}

export default function TaskForm({ defaultValues, isEditing = false }: TaskFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Task>({
    defaultValues,
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: Task) => {
    setIsSubmitting(true);
    try {
      if (isEditing && defaultValues?.id) {
        await updateTask(defaultValues.id, data);
      } else {
        await createTask(data);
      }
      router.push('/');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          {...register('status', { required: 'Status is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && (
          <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          {...register('dueDate', { required: 'Due date is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
        {errors.dueDate && (
          <p className="mt-2 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/')}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}