export class GetCommentResponseDto {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: Date;
  parentId: number | null;
  replies: GetCommentResponseDto[];
}
