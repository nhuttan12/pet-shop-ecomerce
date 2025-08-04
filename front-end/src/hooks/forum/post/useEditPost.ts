// src/hooks/forum/post/useEditPost.tsx
import { useState } from 'react';
import { editPost } from '../../../service/forum/postService';
import { EditPostRequestDto } from '../../../common/dto/post/edit-post-request.dto.ts';

export const useEditPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (request: EditPostRequestDto, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await editPost(request, token);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    loading,
    error,
  };
};
