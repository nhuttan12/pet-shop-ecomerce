import api from '../api';
import { GetAllPostsRequestDto } from '../../common/dto/post/get-all-posts-request.dto.ts';
import { ApiResponse } from '../../common/dto/response/api-response.dto.ts';
import { PostResponse } from '../../common/dto/post/post-response.dto.ts';
import { AxiosResponse } from 'axios';
import { CreatePostRequestDto } from '../../common/dto/post/create-post-request.dto.ts';
import { EditPostRequestDto } from '../../common/dto/post/edit-post-request.dto.ts';
import { DeletePostRequestDto } from '../../common/dto/post/delete-post-request.dto.ts';
import { PostReportRequestDto } from '../../common/dto/post/post-report-request.ts';
import { PostReportResponseDto } from '../../common/dto/post/post-report-response.dto.ts';

export const getPosts = async (
  request: GetAllPostsRequestDto,
): Promise<ApiResponse<PostResponse[]>> => {
  const response: AxiosResponse<ApiResponse<PostResponse[]>> = await api.get(
    '/post',
    {
      params: {
        page: request.page,
        limit: request.limit,
      },
    },
  );

  return response.data;
};

export const createPost = async (
  request: CreatePostRequestDto,
  token: string,
): Promise<ApiResponse<PostResponse>> => {
  const response = await api.post('/post/create', request, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const editPost = async (
  request: EditPostRequestDto,
  token: string,
): Promise<ApiResponse<PostResponse>> => {
  const response: AxiosResponse<ApiResponse<PostResponse>> = await api.patch(
    `/post/edit`,
    request,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const deletePost = async (
  request: DeletePostRequestDto,
  token: string,
): Promise<ApiResponse<PostResponse>> => {
  const response: AxiosResponse<ApiResponse<PostResponse>> = await api.delete(
    `/post/remove`,
    {
      data: request,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const reportPost = async (
  request: PostReportRequestDto,
  token: string,
): Promise<ApiResponse<PostReportResponseDto>> => {
  const response: AxiosResponse<ApiResponse<PostReportResponseDto>> =
    await api.post('/post/report', request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  return response.data;
};

export const getReportedPosts = async (limit = 10, page = 1) => {
  const response = await api.get('/post/post-report', {
    params: {
      limit,
      page,
    },
  });
  return response.data;
};
