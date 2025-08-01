import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import { UserProfileResponseDTO } from '../../common/dto/user/user-profile-response.dto';
import api from '../api';

export class UserService {
  async getUserProfile(token: string): Promise<UserProfileResponseDTO> {
    try {
      const response = await api.get<ApiResponse<UserProfileResponseDTO>>(
        '/user/user-profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.data) {
        throw new Error('Không thể tải thông tin hồ sơ');
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiResponse = error.response?.data as
          | ApiResponse<null>
          | undefined;
        let errorMessage = 'Không thể tải thông tin hồ sơ';
        if (apiResponse?.message) {
          try {
            const parsedMessage = JSON.parse(apiResponse.message) as {
              message?: string;
              error?: string;
            };
            errorMessage =
              parsedMessage.message || parsedMessage.error || errorMessage;
          } catch (parseError) {
            errorMessage = apiResponse.message || errorMessage;
            throw parseError;
          }
        }
        throw new Error(errorMessage);
      }
      console.error(error);
      throw error;
    }
  }

  async updateUserProfile(
    token: string,
    profile: UserProfileResponseDTO
  ): Promise<ApiResponse<UserProfileResponseDTO>> {
    try {
      const response = await api.put<
        AxiosResponse<ApiResponse<UserProfileResponseDTO>>
      >('/user', profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const apiResponse = err.response?.data as ApiResponse<null> | undefined;
        let errorMessage = 'Cập nhật hồ sơ thất bại';
        if (apiResponse?.message) {
          try {
            const parsedMessage = JSON.parse(apiResponse.message) as {
              message?: string;
              error?: string;
            };
            errorMessage =
              parsedMessage.message || parsedMessage.error || errorMessage;
          } catch (parseError) {
            errorMessage = apiResponse.message || errorMessage;
            throw parseError;
          }
        }
        alert(errorMessage);
      }
      throw new Error('Đã xảy ra lỗi không xác định');
    }
  }
}

export const userService = new UserService();
