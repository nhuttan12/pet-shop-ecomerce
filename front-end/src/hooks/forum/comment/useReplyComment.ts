// src/hooks/forum/post/useCreateComment.tsx
import { useState } from 'react';
import { replyComment } from '../../../service/forum/commentService';

export const useReplyComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (content: string, postId: number, parentCommentId: number) => {
    setLoading(true);
    setError(null);
    try {
      await replyComment({ content, postId, parentCommentId });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
