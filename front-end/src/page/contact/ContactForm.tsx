import React, { useState } from 'react';
import InputField from '../../components/ui/InputField';
import Textarea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { ContactFormData, ContactFormErrors } from '../../types/Contact';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vui lòng nhập họ của bạn';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Vui lòng nhập tên của bạn';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email của bạn';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập câu hỏi của bạn';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: '',
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 1500);
    }
  };

  return (
    <div className="bg-gray-100 rounded-2xl p-8 shadow-sm">
      {submitSuccess ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Họ"
            name="firstName"
            placeholder="Họ"
            value={formData.firstName}
            onChange={handleChange}
            required
            error={errors.firstName}
          />
          
          <InputField
            label="Tên"
            name="lastName"
            placeholder="Tên"
            value={formData.lastName}
            onChange={handleChange}
            required
            error={errors.lastName}
          />
        </div>
        
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
          className="mt-4"
        />
        
        <Textarea
          label="Câu hỏi"
          name="message"
          placeholder="Câu hỏi của bạn..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          error={errors.message}
          className="mt-4"
        />
        
        <Button
          type="submit"
          className="mt-6 py-3 px-16"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi'}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;