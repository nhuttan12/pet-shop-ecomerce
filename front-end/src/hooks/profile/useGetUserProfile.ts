import { useEffect, useState } from 'react';
import { UserProfileResponseDTO } from '../../common/dto/user/user-profile-response.dto';
import { userService } from '../../service/user/userService';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import { AxiosError } from 'axios';

interface UseGetUserProfileResult {
  userProfile: UserProfileResponseDTO | undefined;
  loading: boolean;
  error: string | null;
}

export function useGetUserProfile(token: string): UseGetUserProfileResult {
  const [userProfile, setUserProfile] = useState<UserProfileResponseDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile: UserProfileResponseDTO =
          await userService.getUserProfile(token);

        console.log('User profile:', profile);

        setUserProfile(profile);

        setError(null);
      } catch (err) {
        if (err instanceof AxiosError) {
          const apiResponse = err.response?.data as
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
          setError(errorMessage);
        } else {
          console.error('Raw error:', err);
          if (err instanceof AxiosError) {
            console.error('Axios error:', err.response);
          }
          setError(
            err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      setError('Không có token xác thực');
      setLoading(false);
    }
  }, [token]);

  return { userProfile, loading, error };
}
