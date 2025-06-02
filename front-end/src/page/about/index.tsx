import React from 'react';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import HeroSection from '../../components/common/HeroSection';
import AboutSection from './AboutSection';
import TeamSection from './TeamSection';

const AboutUs: React.FC = () => {
  const handleBuyNowClick = () => {
    console.log('Buy now clicked');
    // Navigate to products page or show modal
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with Background Elements */}
        <div className="relative bg-[#f8f9fa] overflow-hidden">
          <HeroSection 
            subtitle="NLU Pet Shop"
            title="Nếu động vật có thể nói, chúng sẽ nói về chúng ta!"
            buttonText="Mua ngay"
            onButtonClick={handleBuyNowClick}
          />

        </div>
        
        {/* About Section */}
        <AboutSection />
        
        {/* Team Section */}
        <TeamSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;