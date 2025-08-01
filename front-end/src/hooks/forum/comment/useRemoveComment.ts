// src/hooks/forum/post/useCreateComment.tsx
import { useState } from 'react';
import { removeComment } from '../../../service/forum/commentService';

export const useRemoveComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (commentId: number, postId: number) => {
    setLoading(true);
    setError(null);
    try {
      await removeComment({ commentId, postId });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};
