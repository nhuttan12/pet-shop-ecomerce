import React, { useState } from 'react';
import { useGetPosts } from '../../../hooks/forum/post/useGetPosts';
import { useCreatePost } from '../../../hooks/forum/post/useCreatePost';
import { useEditPost } from '../../../hooks/forum/post/useEditPost';
import { useDeletePost } from '../../../hooks/forum/post/useDeletePost';
import { useReportPost } from '../../../hooks/forum/post/useReportPost';
import PostForm from './PostForm';
import PostItem from './PostItem';
import HotPostCard from './HotPostCart';
import { useAuth } from '../../../contexts/AuthContext.tsx';

const Body: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [formError, setFormError] = useState('');

  const { isLoggedIn, token } = useAuth();

  const {
    data: posts = [],
    loading: loadingPosts,
    error: errorPosts,
  } = useGetPosts(1, 10, refresh);

  const { submit: createPost, loading: creatingPost } = useCreatePost();
  const { submit: editPost, loading: editingPost } = useEditPost();
  const { remove: deletePost, loading: deletingPost } = useDeletePost();
  const { submit: reportPost, loading: reportingPost } = useReportPost();

  if (!token) {
    alert('Vui cái đăng nhập');
    return;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      await createPost({
        title: formData.title,
        content: formData.content,
      });

      setFormData({
        title: '',
        content: '',
      });

      setShowModal(false);

      setRefresh((prev) => !prev);
    } catch {
      setFormError('Không thể tạo bài viết. Vui lòng thử lại.');
    }
  };

  const handleEdit = async (postID: number, title: string, content: string) => {
    try {
      await editPost(
        {
          postID,
          title,
          content,
        },
        token,
      );
      alert('Cập nhật thành công.');
      setRefresh((prev) => !prev);
    } catch {
      alert('Cập nhật thất bại.');
    }
  };

  const handleDelete = async (postID: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này không?')) return;
    try {
      await deletePost(
        {
          postID,
        },
        token,
      );
      alert('Xóa thành công.');
      setRefresh((prev) => !prev);
    } catch {
      alert('Xóa thất bại.');
    }
  };

  const handleReport = async (postID: number) => {
    const reason = prompt('Nhập lý do báo cáo:');

    if (!reason) {
      console.log('No reason provided, exiting.');
      return;
    }

    try {
      await reportPost(
        {
          postID,
          description: reason,
        },
        token,
      );
      alert('Đã gửi báo cáo.');
    } catch {
      alert('Báo cáo thất bại.');
    }
  };

  // ❗️Lọc bài chưa bị xoá
  const visiblePosts = posts.filter((post) => post.status !== 'removed');

  // ❗️Top 4 bài hot chỉ từ các bài chưa bị xoá
  const hotPosts = visiblePosts.slice(0, 4);

  return (
    <div className="flex w-full px-40 py-10 bg-[#f8f9fa] gap-5">
      {/* Bên trái: Form & danh sách bài viết */}
      <div className="w-3/4 flex flex-col gap-1">
        {/* 🔹 Button to open modal */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded w-fit"
          >
            + Tạo bài viết mới
          </button>
        </div>

        {/* 🔹 Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg w-[500px] relative p-6">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <PostForm
                title={formData.title}
                content={formData.content}
                error={formError}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                isLoggedIn={isLoggedIn}
                submitting={creatingPost}
              />
            </div>
          </div>
        )}

        {/* 🔹 Posts */}
        {loadingPosts ? (
          <p className="flex justify-center">Đang tải bài viết...</p>
        ) : errorPosts ? (
          <p className="text-red-500 flex justify-center">
            Lỗi: {errorPosts.message}
          </p>
        ) : visiblePosts.length === 0 ? (
          <p className="flex justify-center">Chưa có bài viết nào.</p>
        ) : (
          visiblePosts.map((post) => (
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

      {/* 🔹 Hot posts */}
      <div className="w-1/4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4 text-center">
          🔥 Bài đăng hot
        </h2>
        <div className="flex flex-col items-center h-full">
          {hotPosts.length === 0 ? (
            <p>Không có bài hot.</p>
          ) : (
            hotPosts.map((post) => <HotPostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
