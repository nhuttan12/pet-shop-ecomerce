// src/hooks/forum/post/useReportPost.tsx
import { useState } from 'react';
import { reportPost } from '../../../service/forum/postService';
import { PostReportRequestDto } from '../../../common/dto/post/post-report-request.ts';
import { ApiResponse } from '../../../common/dto/response/api-response.dto.ts';
import { PostReportResponseDto } from '../../../common/dto/post/post-report-response.dto.ts';

export const useReportPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (
    request: PostReportRequestDto,
    token: string,
  ): Promise<ApiResponse<PostReportResponseDto>> => {
    setLoading(true);
    setError(null);
    try {
      const result: ApiResponse<PostReportResponseDto> = await reportPost(
        request,
        token,
      );
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    loading,
    error,
  };
};
