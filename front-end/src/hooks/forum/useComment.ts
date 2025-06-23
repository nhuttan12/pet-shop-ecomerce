// import { useState } from 'react';
// import * as commentApi from '../../service/forum/commentService'; // file bạn đã tạo axios api call

// // Hook tạo bình luận mới
// export const useCreateComment = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<any>(null);

//   const createComment = async (postId: number, content: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await commentApi.createComment(postId, content);
//       setData(res);
//       setLoading(false);
//       return res;
//     } catch (err: any) {
//       setError(err.message || 'Error creating comment');
//       setLoading(false);
//       throw err;
//     }
//   };

//   return { createComment, loading, error, data };
// };

// // Hook reply bình luận
// export const useReplyComment = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<any>(null);

//   const replyComment = async (
//     postId: number,
//     parentCommentId: number,
//     content: string,
//   ) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await commentApi.replyComment(postId, parentCommentId, content);
//       setData(res);
//       setLoading(false);
//       return res;
//     } catch (err: any) {
//       setError(err.message || 'Error replying comment');
//       setLoading(false);
//       throw err;
//     }
//   };

//   return { replyComment, loading, error, data };
// };

// // Hook cập nhật bình luận
// export const useUpdateComment = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<any>(null);

//   const updateComment = async (commentId: number, content: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await commentApi.updateComment(commentId, content);
//       setData(res);
//       setLoading(false);
//       return res;
//     } catch (err: any) {
//       setError(err.message || 'Error updating comment');
//       setLoading(false);
//       throw err;
//     }
//   };

//   return { updateComment, loading, error, data };
// };

// // Hook xoá bình luận
// export const useRemoveComment = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<any>(null);

//   const removeComment = async (commentId: number, postId: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await commentApi.removeComment(commentId, postId);
//       setData(res);
//       setLoading(false);
//       return res;
//     } catch (err: any) {
//       setError(err.message || 'Error removing comment');
//       setLoading(false);
//       throw err;
//     }
//   };

//   return { removeComment, loading, error, data };
// };
