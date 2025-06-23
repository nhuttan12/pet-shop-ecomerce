export class PostResponse {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  status: string;
  hasPendingEditRequest: boolean;
  created_at: Date;
  updated_at: Date;
}
