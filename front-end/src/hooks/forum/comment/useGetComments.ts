// import { useState, useEffect } from 'react';
// import { getComments } from '../../service/forum/commentService';
// import { Comment } from '../../types/Forum';

// export const useGetComments = (postId: number, page = 1, limit = 10) => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     if (!postId) return;
//     setLoading(true);
//     setError(null);

//     getComments(postId, page, limit)
//       .then((res) => {
//         setComments(res.data.comments);
//         setTotalPages(res.data.totalPages || 1);
//       })
//       .catch((err) => setError(err))
//       .finally(() => setLoading(false));
//   }, [postId, page, limit]);

//   return { comments, loading, error, totalPages };
// };
