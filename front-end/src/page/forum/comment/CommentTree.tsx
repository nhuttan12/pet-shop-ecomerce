import React, { useState } from 'react';
import { Comment } from '../../../types/Forum';

interface CommentTreeProps {
  comments: Comment[];
  onReply: (parentId: number, content: string) => void;
}

const CommentTree: React.FC<CommentTreeProps> = ({ comments, onReply }) => {
  return (
    <div>
      {comments.map(comment => (
        <CommentNode key={comment.id} comment={comment} onReply={onReply} />
      ))}
    </div>
  );
};

interface CommentNodeProps {
  comment: Comment;
  onReply: (parentId: number, content: string) => void;
}

const CommentNode: React.FC<CommentNodeProps> = ({ comment, onReply }) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return alert('Nhập nội dung trả lời.');
    onReply(comment.id, replyContent);
    setReplyContent('');
    setReplying(false);
  };

  return (
    <div style={{ marginLeft: '20px', marginTop: '10px', borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
      <p><b>{comment.author}</b> - {new Date(comment.createdAt).toLocaleString()}</p>
      <p>{comment.content}</p>
      
      {replying ? (
        <>
          <textarea
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            rows={3}
            placeholder="Viết trả lời..."
          />
          <button onClick={handleReplySubmit}>Gửi trả lời</button>
          <button onClick={() => setReplying(false)}>Hủy</button>
        </>
      ) : (
        <button onClick={() => setReplying(true)}>Trả lời</button>
      )}

      {/* Recursively render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <CommentTree comments={comment.replies} onReply={onReply} />
      )}
    </div>
  );
};

export default CommentTree;
