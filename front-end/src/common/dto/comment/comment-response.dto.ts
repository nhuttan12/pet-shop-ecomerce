export interface CommentResponseDto {
  id: number;
  content: string;
  authorID: number;
  authorName: string;
  createdAt: Date;
  parentID: number | null;
  replies: CommentResponseDto[];
}
