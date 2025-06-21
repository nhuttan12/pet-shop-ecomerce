import React, { useState } from 'react';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import AccountMenu from './AccountMenu';
import ProfileForm from './ProfileForm';
import { UserProfile } from '../../types/Profile';

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'Hoai',
    lastName: 'Thuong',
    email: 'nhom12@gmail.com',
    gender: 'male',
    phoneNumber: '',
    birthday: ''
  });

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    // Here you would typically make an API call to update the profile
    console.log('Profile updated:', updatedProfile);
    alert('Thông tin đã được cập nhật thành công!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <AccountMenu />
          </div>
          
          <div className="md:col-span-3">
            <ProfileForm 
              userProfile={userProfile} 
              onSave={handleSaveProfile} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;