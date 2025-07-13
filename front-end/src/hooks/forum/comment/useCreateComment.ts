// src/hooks/forum/post/useCreateComment.tsx
import { useState } from 'react';
import { createComment } from '../../../service/forum/commentService';

export const useCreateComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (content: string, postId: number) => {
    setLoading(true);
    setError(null);
    try {
      await createComment({ content, postId });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
