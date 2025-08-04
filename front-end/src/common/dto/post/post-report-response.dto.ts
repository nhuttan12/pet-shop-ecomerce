import { PostReportStatus } from '../../enum/post/post-report-status.enum.ts';

export interface PostReportResponseDto {
  id: number;
  postTitle: string;
  userName: string;
  status: PostReportStatus | string;
  description: string;
  createdAt: Date | string;
}
