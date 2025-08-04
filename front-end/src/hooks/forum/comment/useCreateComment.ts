import { useState } from 'react';
import { createComment } from '../../../service/forum/commentService';

export const useCreateComment = (token: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (!token) {
    alert('Vui lòng đăng nhập');
    throw new Error('Người dùng chưa đăng nhập');
  }

  const submit = async (content: string, postID: number) => {
    setLoading(true);
    setError(null);
    try {
      await createComment(
        {
          content,
          postID,
        },
        token,
      );
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
