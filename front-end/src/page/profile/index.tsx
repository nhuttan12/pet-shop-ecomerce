import React from 'react';
import { UserProfileResponseDTO } from '../../common/dto/user/user-profile-response.dto';
import Footer from '../../components/layout/footer/footer';
import Header from '../../components/layout/header/header';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateUserProfile } from '../../hooks/profile/useUpdateUserProfile';
import AccountMenu from './AccountMenu';
import ProfileForm from './ProfileForm';

const ProfilePage: React.FC = () => {
  const { token } = useAuth();

  const { userProfile, loading, error, updateProfile } = useUpdateUserProfile(
    token ?? ''
  );

  const handleSaveProfile = async (updatedProfile: UserProfileResponseDTO) => {
    try {
      await updateProfile(updatedProfile);
      alert('Thông tin đã được cập nhật thành công!');
    } catch (err) {
      alert(
        'Cập nhật thất bại: ' +
          (err instanceof Error ? err.message : 'Unknown error')
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!token) return <p>You are not logged in</p>;
  if (!userProfile) return null;

  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <Header />

      <main className='flex-grow container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='md:col-span-1'>
            <AccountMenu />
          </div>

          <div className='md:col-span-3'>
            <ProfileForm userProfile={userProfile} onSave={handleSaveProfile} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
