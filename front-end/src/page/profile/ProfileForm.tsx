import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import { CgProfile } from 'react-icons/cg';
import { UserProfileResponseDTO } from '../../common/dto/user/user-profile-response.dto';

interface ProfileFormProps {
  userProfile: UserProfileResponseDTO;
  onSave: (profile: UserProfileResponseDTO) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userProfile, onSave }) => {
  const [profile, setProfile] = useState<UserProfileResponseDTO>(userProfile);
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserProfileResponseDTO, string>>
  >({});

  const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name as keyof UserProfileResponseDTO]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleGenderChange = (value: string) => {
    setProfile({
      ...profile,
      gender: value,
    });

    // Clear error when user selects
    if (errors.gender) {
      setErrors({
        ...errors,
        gender: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfileResponseDTO, string>> = {};

    if (!profile.name.trim()) {
      newErrors.name = 'Tên không được để trống';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const updatePayload = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        gender: profile.gender,
        birthDate: profile.birthDate,
        phone: profile.phone,
      };

      console.log('Profile:', updatePayload);
      onSave(updatePayload as UserProfileResponseDTO);
    }
  };

  return (
    <div className='bg-[#f8f9fa] p-8 rounded-2xl'>
      <div className='flex items-center mb-8'>
        <div className='w-[68px] h-[68px] bg-[#fd7e14] rounded-full flex items-center justify-center'>
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt='User avatar'
              className='w-[68px] h-[68px] rounded-full object-cover'
            />
          ) : (
            <CgProfile className='w-[68px] h-[68px] text-gray-400' />
          )}
        </div>
        <div className='ml-4'>
          <h2 className='text-xl font-medium'>{profile.name}</h2>
          <p className='text-gray-500'>{profile.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
          <div className='md:col-span-2'>
            <InputField
              label='Họ tên'
              name='name'
              value={profile.name}
              onChange={handleInputChange}
              placeholder='Họ tên'
              error={errors.name}
            />
          </div>

          <InputField
            label='Giới tính'
            name='gender'
            type='select'
            value={profile.gender}
            onChange={(e) => handleGenderChange(e.target.value)}
            options={genderOptions}
            placeholder='Chọn giới tính'
            error={errors.gender}
          />

          <InputField
            label='Số điện thoại'
            name='phone'
            value={profile.phone}
            onChange={handleInputChange}
            placeholder='Phone number'
            error={errors.phone}
          />

          <div className='md:col-span-2'>
            <InputField
              label='Email'
              name='email'
              type='email'
              value={profile.email}
              onChange={handleInputChange}
              placeholder='Email'
              error={errors.email}
            />
          </div>

          <InputField
            label='Ngày sinh'
            name='birthDate'
            type='date'
            value={
              profile.birthDate
                ? new Date(profile.birthDate).toISOString().split('T')[0]
                : ''
            }
            onChange={handleInputChange}
            placeholder='birthDate'
            error={errors.birthDate}
          />
        </div>

        <div className='mt-8'>
          <Button type='submit' variant='primary' className='px-8 py-2'>
            Chỉnh sửa thông tin
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
