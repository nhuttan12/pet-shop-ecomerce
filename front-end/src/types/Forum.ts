export interface Post {
  id: number;
  title: string;      // thêm trường title
  content: string;
  author: string;
  authorId: number;
  timeAgo: string;
  views: number;
  replies: number;
}
export interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  replies?: Comment[];
}


// src/types/forum/comment.ts

export interface CreateCommentPayload {
  content: string;
  postId: number;
}

export interface ReplyCommentPayload {
  content: string;
  postId: number;
  parentCommentId: number;
}

export interface UpdateCommentPayload {
  content: string;
  commentId: number;
}

export interface RemoveCommentPayload {
  commentId: number;
  postId: number;
}

