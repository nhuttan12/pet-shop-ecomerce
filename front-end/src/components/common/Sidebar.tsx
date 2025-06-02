import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconType } from 'react-icons';
import { IoHomeOutline } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";

interface SidebarItem {
  icon: IconType;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const sidebarItems: SidebarItem[] = [
    {
      icon: IoHomeOutline,
      label: 'Thông tin tài khoản',
      path: '/profile'
    },
    {
      icon: FaClipboardList,
      label: 'Quản lý đơn hàng',
      path: '/profile/orders'
    },
    {
      icon: MdSecurity,
      label: 'Bảo mật',
      path: '/profile/security'
    },
    {
      icon: AiOutlineHeart,
      label: 'Sản phẩm yêu thích',
      path: '/profile/favorites'
    },
    {
      icon: FiLogOut,
      label: 'Logout',
      path: '/logout'
    }
  ];

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.currentTarget.getAttribute('href') === '/logout') {
      e.preventDefault();
      // Implement logout functionality
      console.log('Logging out...');
      // Redirect to home page or login page after logout
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg">
      {sidebarItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={index}
            to={item.path}
            onClick={handleLogout}
            className={`flex items-center p-3 mb-3 rounded-sm ${
              isActive ? 'bg-[#fff7ef]' : ''
            }`}
          >
            {/* <img src={item.icon} alt={item.label} className="w-5 h-5" /> */}
            <Icon className="w-5 h-5 text-[#313f53]" />
            <span className={`ml-4 text-base font-medium ${
              isActive ? 'text-[#fd7e14]' : 'text-[#313f53]'
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;