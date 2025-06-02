// types/forms.ts
export interface PersonalInfoFormProps {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onPersonalInfoChange: (field: string, value: string) => void;
}
