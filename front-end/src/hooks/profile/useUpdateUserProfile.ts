import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import { UserProfileResponseDTO } from '../../common/dto/user/user-profile-response.dto';
import { userService } from '../../service/user/userService';

interface UseUpdateUserProfileResult {
  userProfile: UserProfileResponseDTO | undefined;
  loading: boolean;
  error: string | null;
  updateProfile: (profile: UserProfileResponseDTO) => Promise<void>;
  success: boolean;
}

export function useUpdateUserProfile(token: string): UseUpdateUserProfileResult {
  const [userProfile, setUserProfile] = useState<UserProfileResponseDTO>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile: UserProfileResponseDTO =
          await userService.getUserProfile(token);

        setUserProfile(profile);
        setError(null);
      } catch (err) {
        if (err instanceof AxiosError) {
          alert(err.response?.data?.message);
        }
        setError(
          err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const updateProfile = async (profile: UserProfileResponseDTO) => {
    try {
      const updatedProfile: ApiResponse<UserProfileResponseDTO> =
        await userService.updateUserProfile(token, profile);
      setUserProfile(updatedProfile.data);
      setError(null);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định'
      );
    }
  };

  return { userProfile, loading, error, updateProfile, success };
}
