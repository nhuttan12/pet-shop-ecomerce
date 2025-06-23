import Header from '../../../components/layout/header/header';
import Footer from '../../../components/layout/footer/footer';
import React from "react";
import  Body  from './Body';

const Forum: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow mt-8">
        <Body />
      </div>

      <Footer />
    </div>
        
  );
};

export default Forum;