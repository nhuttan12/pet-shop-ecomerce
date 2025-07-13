import { useEffect, useState, useCallback } from "react";
import { getComments } from "../../../service/forum/commentService";
import { Comment } from "../../../types/Forum";

export const useGetComments = (postId: number, reloadTrigger?: boolean) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);
    try {
      const comments = await getComments(postId, 1, 20);
      console.log("API comments data:", comments);
      setComments(Array.isArray(comments) ? comments : []);
    } catch (err: any) {
      setError(err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, reloadTrigger]);

  return { comments, loading, error, refetch: fetchComments };
};
