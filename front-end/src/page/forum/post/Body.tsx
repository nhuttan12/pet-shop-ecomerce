import React, { useState } from 'react';
import { useGetPosts } from '../../../hooks/forum/post/useGetPosts';
import { useCreatePost } from '../../../hooks/forum/post/useCreatePost';
import { useEditPost } from '../../../hooks/forum/post/useEditPost';
import { useDeletePost } from '../../../hooks/forum/post/useDeletePost';
import { useReportPost } from '../../../hooks/forum/post/useReportPost';
import PostForm from './PostForm';
import PostItem from './PostItem';
import HotPostCard from './HotPostCart';

const Body: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const { data: posts = [], loading: loadingPosts, error: errorPosts } = useGetPosts(1, 10, refresh);

  const { submit: createPost, loading: creatingPost } = useCreatePost();
  const { submit: editPost, loading: editingPost } = useEditPost();
  const { remove: deletePost, loading: deletingPost } = useDeletePost();
  const { submit: reportPost, loading: reportingPost } = useReportPost();

  const [formData, setFormData] = useState({ title: '', content: '' });
  const [formError, setFormError] = useState('');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setFormError('Vui lòng đăng nhập để tạo bài viết.');
      return;
    }
    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Vui lòng nhập tiêu đề và nội dung.');
      return;
    }
    try {
      await createPost({ title: formData.title, content: formData.content });
      setFormData({ title: '', content: '' });
      setRefresh(prev => !prev);
    } catch {
      setFormError('Không thể tạo bài viết. Vui lòng thử lại.');
    }
  };

  const handleEdit = async (postId: number, title: string, content: string) => {
    try {
      await editPost(postId, { title, content });
      alert('Cập nhật thành công.');
      setRefresh(prev => !prev);
    } catch {
      alert('Cập nhật thất bại.');
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này không?')) return;
    try {
      await deletePost(postId);
      alert('Xóa thành công.');
      setRefresh(prev => !prev);
    } catch {
      alert('Xóa thất bại.');
    }
  };

  const handleReport = async (postId: number) => {
    const reason = prompt('Nhập lý do báo cáo:');
    if (!reason) return;
    try {
      await reportPost(postId, reason);
      alert('Đã gửi báo cáo.');
    } catch {
      alert('Báo cáo thất bại.');
    }
  };

  // ❗️Lọc bài chưa bị xoá
  const visiblePosts = posts.filter(post => post.status !== 'removed');



  // ❗️Top 4 bài hot chỉ từ các bài chưa bị xoá
  const hotPosts = visiblePosts.slice(0, 4);

  return (
    <div className="flex w-full px-40 py-10 bg-[#f8f9fa] gap-10">
      {/* Bên trái: Form & danh sách bài viết */}
      <div className="w-3/4 flex flex-col gap-10">
        <PostForm
          title={formData.title}
          content={formData.content}
          error={formError}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoggedIn={isLoggedIn}
          submitting={creatingPost}
        />

        {loadingPosts ? (
          <p>Đang tải bài viết...</p>
        ) : errorPosts ? (
          <p className="text-red-500">Lỗi: {errorPosts.message}</p>
        ) : visiblePosts.length === 0 ? (
          <p>Chưa có bài viết nào.</p>
        ) : (
          visiblePosts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReport={handleReport}
              editing={editingPost}
              deleting={deletingPost}
              reporting={reportingPost}
            />
          ))
        )}
      </div>

      {/* Bên phải: bài đăng hot */}
      <div className="w-1/4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4 text-center">🔥 Bài đăng hot</h2>
        {hotPosts.length === 0 ? (
          <p>Không có bài hot.</p>
        ) : (
          hotPosts.map(post => (
            <HotPostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Body;
