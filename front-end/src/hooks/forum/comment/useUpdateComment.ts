// src/hooks/forum/post/useCreateComment.tsx
import { useState } from 'react';
import { updateComment } from '../../../service/forum/commentService';
import { UpdateCommentRequestDto } from '../../../common/dto/comment/update-comment-request.dto.ts';

export const useUpdateComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (request: UpdateCommentRequestDto, token: string) => {
    setLoading(true);
    setError(null);
    try {
      await updateComment(request, token);
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
