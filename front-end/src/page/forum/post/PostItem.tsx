import React, { useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { BsChatRight } from "react-icons/bs";
import { Post } from "../../../types/Forum";

interface PostItemProps {
  post: Post;
  onEdit: (postId: number, title: string, content: string) => void;
  onDelete: (postId: number) => void;
  onReport: (postId: number) => void;
  editing?: boolean;
  deleting?: boolean;
  reporting?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  onEdit,
  onDelete,
  onReport,
  editing,
  deleting,
  reporting,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung.');
      return;
    }
    onEdit(post.id, editTitle, editContent);
    setIsEditing(false);
  };

  return (
    <div className="w-full h-[90px] bg-white shadow-[0px_4px_4px_#00000040] relative p-4 mb-3 rounded">
      {isEditing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border p-1 mb-2 rounded w-full"
            disabled={editing}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="border p-1 rounded w-full"
            disabled={editing}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleSave}
              disabled={editing}
              className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              {editing ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={editing}
              className="bg-gray-400 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Huỷ
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-base text-black mb-1">{post.content}</p>
          <p className="text-xs text-black mb-2">
            Được đăng bởi <span className="font-bold">{post.author || post.authorId}</span> {post.timeAgo}
          </p>

          <div className="absolute top-4 right-4 flex gap-3">
            <div className="flex flex-col items-center gap-1 w-[46px] h-[45px] bg-white">
              <MdRemoveRedEye size={24} />
              <span className="text-xs">{post.views}</span>
            </div>

            <div className="flex flex-col items-center gap-1 w-[46px] h-[45px] bg-white">
              <BsChatRight size={24} />
              <span className="text-xs">{post.replies}</span>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-400 px-2 rounded text-xs"
              disabled={editing || deleting || reporting}
            >
              Sửa
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="bg-red-600 px-2 rounded text-xs text-white"
              disabled={editing || deleting || reporting}
            >
              {deleting ? 'Đang xoá...' : 'Xoá'}
            </button>
            <button
              onClick={() => onReport(post.id)}
              className="bg-gray-600 px-2 rounded text-xs text-white"
              disabled={editing || deleting || reporting}
            >
              Báo cáo
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostItem;
