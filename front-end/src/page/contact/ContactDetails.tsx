import React from 'react';
import { ContactInfo } from '../../types/Contact';
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlinePhone } from "react-icons/hi2";
import { IoTimeOutline } from "react-icons/io5";

const ContactDetails: React.FC = () => {
  const contactInfo: ContactInfo = {
    address: 'Khu phố 6, Phường Linh Trung, TP.Thủ Đức, TP.HCM',
    email: 'peshop@gmail.com',
    phone: '+84 33 645 709',
    hours: 'thứ 2- thứ 6: 8h-16h',
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl md:text-4xl font-semibold text-black">
        Vui lòng liên hệ với chúng tôi
      </h2>
      
      <p className="text-lg text-gray-800">
        để biết thêm thông tin chi tiết vui lòng liên hệ dựa trên những thông tin dưới đây
      </p>
      
      <div className="space-y-6">
        {/* Address */}
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-[#fd7e14] bg-opacity-20 flex items-center justify-center mr-4">
            <CiLocationOn className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-medium leading-relaxed">
              {contactInfo.address.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < contactInfo.address.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        
        {/* Email */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#fd7e14] flex items-center justify-center mr-4">
            <MdOutlineEmail className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">{contactInfo.email}</p>
        </div>
        
        {/* Phone */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#fd7e14] flex items-center justify-center mr-4">
            <HiOutlinePhone className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold">{contactInfo.phone}</p>
        </div>
        
        {/* Hours */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#fd7e14] bg-opacity-20 flex items-center justify-center mr-4">
            <IoTimeOutline className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">{contactInfo.hours}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;