import api from '../api';

export const getPosts = async (limit = 10, page = 1) => {
  const response = await api.get('/post', {
    params: { limit, page },
  });
  return response.data;
};

export const createPost = async (postData: {
  title: string;
  content: string;
  tags?: string[];
}) => {
  const response = await api.post('/post/create', postData);
  return response.data;
};

export const editPost = async (
  postId: number,
  editData: { title?: string; content?: string },
) => {
  const response = await api.patch(`/post/edit/${postId}`, editData);
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await api.delete(`/post/remove/${postId}`, {
    data: { postId },
  });
  return response.data;
};

export const reportPost = async (postId: number, description: string) => {
  const response = await api.post('/post/report', {
    postId,
    description,
  });
  return response.data;
};

export const getReportedPosts = async (limit = 10, page = 1) => {
  const response = await api.get('/post/post-report', {
    params: { limit, page },
  });
  return response.data;
};
