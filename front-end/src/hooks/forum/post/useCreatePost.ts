// src/hooks/forum/post/useCreatePost.tsx
import { useState } from 'react';
import { createPost } from '../../../service/forum/postService';

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (postData: { title: string; content: string; tags?: string[] }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createPost(postData);
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
