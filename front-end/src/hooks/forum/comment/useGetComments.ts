import { useCallback, useEffect, useState } from 'react';
import { getComments } from '../../../service/forum/commentService';
import { CommentResponseDto } from '../../../common/dto/comment/comment-response.dto.ts';

export const useGetComments = (postID: number, reloadTrigger?: boolean) => {
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postID) return;

    setLoading(true);
    setError(null);
    try {
      const comments: CommentResponseDto[] = await getComments({
        postID,
        page: 1,
        limit: 20,
      });
      console.log('API comments data:', comments);

      setComments(Array.isArray(comments) ? comments : []);
    } catch (err: unknown) {
      setError(err as Error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postID]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, reloadTrigger]);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
  };
};
