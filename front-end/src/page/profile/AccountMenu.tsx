import React from 'react';
// import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';

const AccountMenu: React.FC = () => {
  // const location = useLocation();
  
  return (
    <div className="w-full">
      <Sidebar />
    </div>
  );
};

export default AccountMenu;