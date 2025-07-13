// src/hooks/forum/post/useCreateComment.tsx
import { useState } from 'react';
import { updateComment } from '../../../service/forum/commentService';

export const useUpdateComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (content: string, commentId: number) => {
    setLoading(true);
    setError(null);
    try {
      await updateComment({ content, commentId });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
