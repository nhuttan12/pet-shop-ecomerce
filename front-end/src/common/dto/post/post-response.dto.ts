export interface PostResponse {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  status: string;
  hasPendingEditRequest: boolean;
  createdAt: Date;
  updatedAt: Date;
}
