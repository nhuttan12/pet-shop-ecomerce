// src/hooks/forum/post/useDeletePost.tsx
import { useState } from 'react';
import { deletePost } from '../../../service/forum/postService';
import { DeletePostRequestDto } from '../../../common/dto/post/delete-post-request.dto.ts';

export const useDeletePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (request: DeletePostRequestDto, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deletePost(request, token);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    remove,
    loading,
    error,
  };
};
