// Components/DeleteButton.tsx
'use client';

import { deleteTask } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

export default function DeleteButton({ taskId }: { taskId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
      router.refresh();
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  );
}