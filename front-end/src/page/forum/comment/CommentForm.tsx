// src/components/forum/comment/CommentForm.tsx
import { useState } from "react";
import { useCreateComment } from "../../../hooks/forum/comment/useCreateComment";

interface CommentFormProps {
  postId: number;
  onSuccess?: () => void; // để reload lại comments sau khi gửi
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onSuccess }) => {
  const [content, setContent] = useState("");
  const { submit, loading, error } = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await submit(content, postId);
      setContent(""); // Clear input
      onSuccess?.(); // Callback reload comments nếu có
    } catch (err) {
      // lỗi đã xử lý trong hook, không cần làm gì thêm
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border rounded p-2"
        rows={3}
        placeholder="Viết bình luận..."
        disabled={loading}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded w-fit"
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi bình luận"}
      </button>
    </form>
  );
};

export default CommentForm;
