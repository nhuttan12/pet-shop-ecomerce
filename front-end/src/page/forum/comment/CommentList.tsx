import { useEffect } from "react";
import { useGetComments } from "../../../hooks/forum/comment/useGetComments";

interface CommentListProps {
  postId: number;
  reloadTrigger?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ postId, reloadTrigger }) => {
  const { comments = [], loading, error } = useGetComments(postId, reloadTrigger);

  useEffect(() => {
    // Trigger re-fetch by re-calling hook logic — in this setup, useGetComments needs to accept reloadTrigger as dependency
  }, [reloadTrigger]);

  if (loading) return <p>Đang tải bình luận...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="mt-2 space-y-2">
      {comments.length === 0 ? (
        <p>Chưa có bình luận nào.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="border p-2 rounded">
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-gray-500">
              bởi <strong>{comment.author}</strong> - {comment.createdAt}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
