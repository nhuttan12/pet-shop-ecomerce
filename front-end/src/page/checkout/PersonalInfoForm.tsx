import React from 'react';
import { PersonalInfo } from '../../types/ChechOut';
import InputField from '../../components/ui/InputField';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onPersonalInfoChange: (field: keyof PersonalInfo, value: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
  onPersonalInfoChange
}) => {
  return (
    <div className="mb-6">

      {/* Khung chung cho toàn bộ input */}
      <div className="p-6 border border-gray-300 rounded-lg space-y-1 bg-white shadow-sm">
         <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>
        <InputField
          placeholder="Nhập tên của bạn"
          value={personalInfo.name}
          onChange={(e) => onPersonalInfoChange('name', e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            placeholder="Nhập email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => onPersonalInfoChange('email', e.target.value)}
          />
          <InputField
            placeholder="Nhập số điện thoại"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => onPersonalInfoChange('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
