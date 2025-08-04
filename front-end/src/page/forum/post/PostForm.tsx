import React from 'react';

interface Props {
  title: string;
  content: string;
  error: string;
  isLoggedIn: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting?: boolean;
}

const PostForm: React.FC<Props> = ({
  title,
  content,
  error,
  onChange,
  onSubmit,
  isLoggedIn,
  submitting
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tạo bài viết mới</h2>
      {isLoggedIn ? (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            name="title"
            value={title}
            onChange={onChange}
            placeholder="Tiêu đề"
            className="border p-2 rounded"
            disabled={submitting}
          />

          <textarea
            name="content"
            value={content}
            onChange={onChange}
            placeholder="Nội dung"
            rows={4}
            className="border p-2 rounded"
            disabled={submitting}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Đang đăng...' : 'Đăng bài'}
          </button>
        </form>
      ) : (
        <p className="text-red-500">Vui lòng đăng nhập để tạo bài viết.</p>
      )}
    </div>
  );
};

export default PostForm;
