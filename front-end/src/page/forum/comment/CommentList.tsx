import { useEffect } from 'react';
import { useGetComments } from '../../../hooks/forum/comment/useGetComments';

interface CommentListProps {
  postID: number;
  reloadTrigger?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ postID, reloadTrigger }) => {
  const {
    comments = [],
    loading,
    error,
    refetch,
  } = useGetComments(postID, reloadTrigger);

  useEffect(() => {
    if(reloadTrigger) {
      refetch();
    }
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
              bởi <strong>{comment.authorName}</strong> -{' '}
              {comment.createdAt.toString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
