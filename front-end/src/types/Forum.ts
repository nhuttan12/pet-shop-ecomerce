export interface Post {
  id: number;
  content: string;
  author: string;
  authorId: number;
  timeAgo: string;
  views: number;
  replies: number;
}