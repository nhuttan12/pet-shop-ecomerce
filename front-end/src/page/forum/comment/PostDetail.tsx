// // src/pages/forum/PostDetail.tsx
// import React, { useState } from 'react';
// import { useGetComments } from '../../../hooks/forum/comment/useGetComments';
// import { useReplyComment } from '../../../hooks/forum/comment/useReplyComment';
// import { useCreateComment } from '../../../hooks/forum/comment/useCreateComment';
// import CommentTree from './CommentTree';
// import CommentForm from './CommentForm';

// interface Props {
//   postId: number;
// }

// const PostDetail: React.FC<Props> = ({ postId }) => {
//   const [page, setPage] = useState(1);

//   const {
//     comments,
//     loading,
//     error,
//     totalPages,
//   } = useGetComments(postId, page, 10);

//   const {
//     submit: replyComment,
//   } = useReplyComment();

//   const {
//     submit: createComment,
//     loading: createLoading,
//     error: createError,
//   } = useCreateComment();

//   const handleCreate = async (content: string) => {
//     try {
//       await createComment(content, postId);
//       alert('Bình luận đã được gửi');
//       setPage(1); // reload lại trang 1 để thấy comment mới
//     } catch {
//       alert('Gửi bình luận thất bại');
//     }
//   };

//   const handleReply = async (parentId: number, content: string) => {
//     try {
//       await replyComment(content, postId, parentId);
//       alert('Đã trả lời bình luận.');
//       setPage(1); // reload lại trang 1
//     } catch {
//       alert('Lỗi khi gửi trả lời.');
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">Bình luận</h3>

//       <CommentForm
//         postId={postId}
//         onSubmit={handleCreate}
//         loading={createLoading}
//         error={createError}
//       />

//       {loading && <p>Đang tải bình luận...</p>}
//       {error && <p className="text-red-500">Lỗi: {error.message}</p>}

//       <CommentTree comments={comments} onReply={handleReply} />

//       {/* Pagination */}
//       <div className="mt-4 flex items-center gap-2">
//         <button
//           disabled={page <= 1}
//           onClick={() => setPage(page - 1)}
//           className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Trang trước
//         </button>
//         <span>{page} / {totalPages}</span>
//         <button
//           disabled={page >= totalPages}
//           onClick={() => setPage(page + 1)}
//           className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Trang sau
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostDetail;
