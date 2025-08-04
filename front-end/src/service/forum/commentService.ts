import api from '../api';
import { CreateCommentRequestDto } from '../../common/dto/comment/create-comment-request.dto.ts';
import { ApiResponse } from '../../common/dto/response/api-response.dto.ts';
import { CommentResponseDto } from '../../common/dto/comment/comment-response.dto.ts';
import { AxiosResponse } from 'axios';
import { RemoveCommentRequestDto } from '../../common/dto/comment/remove-comment-request.dto.ts';
import { UpdateCommentRequestDto } from '../../common/dto/comment/update-comment-request.dto.ts';
import { GetAllCommentRequest } from '../../common/dto/comment/get-all-comment-request.dto.ts';

export const createComment = async (
  request: CreateCommentRequestDto,
  token: string,
): Promise<CommentResponseDto> => {
  const response: AxiosResponse<ApiResponse<CommentResponseDto>> =
    await api.post('/comment/create', request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  if (!response.data.data) {
    throw new Error('Không thể bình luận');
  }

  return response.data.data;
};

export const replyComment = async (
  request: CreateCommentRequestDto,
  token: string,
): Promise<CommentResponseDto> => {
  const response: AxiosResponse<ApiResponse<CommentResponseDto>> =
    await api.post('/comment/reply', request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  if (!response.data.data) {
    throw new Error('Không thể phản hồi bình luận');
  }

  return response.data.data;
};

export const updateComment = async (
  request: UpdateCommentRequestDto,
  token: string,
): Promise<CommentResponseDto> => {
  const response: AxiosResponse<ApiResponse<CommentResponseDto>> =
    await api.patch('/comment/edit', request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  if (!response.data.data) {
    throw new Error('Không thể cập nhật bình luận');
  }

  return response.data.data;
};

export const removeComment = async (
  request: RemoveCommentRequestDto,
  token: string,
): Promise<CommentResponseDto> => {
  const response: AxiosResponse<ApiResponse<CommentResponseDto>> =
    await api.delete('/comment/remove', {
      data: request,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  if (!response.data.data) {
    throw new Error('Không thể xóa bình luận');
  }

  return response.data.data;
};

export const getComments = async (
  request: GetAllCommentRequest,
): Promise<CommentResponseDto[]> => {
  const response: AxiosResponse<ApiResponse<CommentResponseDto[]>> =
    await api.get(`/comment`, {
      params: {
        postID: request.postID,
        page: request.page,
        limit: request.limit,
      },
    });

  if (!response.data.data) {
    throw new Error('Không thể lấy bình luận');
  }

  return response.data.data;
};
