// src/hooks/forum/post/useReportPost.tsx
import { useState } from 'react';
import { reportPost } from '../../../service/forum/postService';

export const useReportPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (postId: number, description: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportPost(postId, description);
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
