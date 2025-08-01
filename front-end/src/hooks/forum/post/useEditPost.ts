// src/hooks/forum/post/useEditPost.tsx
import { useState } from 'react';
import { editPost } from '../../../service/forum/postService';

export const useEditPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (postId: number, data: { title?: string; content?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await editPost(postId, data);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
