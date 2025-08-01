// src/hooks/forum/post/useDeletePost.tsx
import { useState } from 'react';
import { deletePost } from '../../../service/forum/postService';

export const useDeletePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (postId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deletePost(postId);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};
