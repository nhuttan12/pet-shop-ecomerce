// import React, { useState } from 'react';
// import { useGetComments } from '../../hooks/forum/comment/useGetComments';
// import { useReplyComment } from '../../hooks/forum/comment/useReplyComment';
// import CommentTree from './CommentTree';
// import CommentForm from './CommentForm';

// interface Props {
//   postId: number;
// }

// const PostDetail: React.FC<Props> = ({ postId }) => {
//   const [page, setPage] = useState(1);
//   const { comments, loading, error, totalPages } = useGetComments(postId, page, 10);
//   const { submit: replyComment } = useReplyComment();

//   const handleReply = async (parentId: number, content: string) => {
//     try {
//       await replyComment(content, postId, parentId);
//       alert('Đã trả lời bình luận.');
//       // TODO: reload comment list hoặc update cache
//     } catch {
//       alert('Lỗi khi gửi trả lời.');
//     }
//   };

//   return (
//     <div>
//       <h3>Bình luận</h3>
//       <CommentForm postId={postId} />
//       {loading && <p>Đang tải bình luận...</p>}
//       {error && <p style={{ color: 'red' }}>{error.message}</p>}

//       <CommentTree comments={comments} onReply={handleReply} />

//       {/* Pagination controls */}
//       <div style={{ marginTop: 20 }}>
//         <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Trang trước</button>
//         <span> {page} / {totalPages} </span>
//         <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Trang sau</button>
//       </div>
//     </div>
//   );
// };

// export default PostDetail;
