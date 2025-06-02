import React from 'react';
import Button from '../ui/Button';
// import bannerpetShop from '../../assets/bannerpet.jpg';
import banner2 from '../../assets/banner2.png';

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    buttonLink?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
                                                     title,
                                                     subtitle,
                                                     buttonText,
                                                     onButtonClick = () => {},
                                                 }) => {
    return (
        <section className="relative overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={banner2}
          alt="Background Pattern"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl  backdrop-blur-sm p-6 rounded-[40px]">
          {subtitle && (
            <h2 className="text-base font-bold text-[#fd7e14] uppercase mb-2">
              {subtitle}
            </h2>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            {title}
          </h1>
          {buttonText && (
            <Button
              onClick={onButtonClick}
              className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-lg"
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </section>
    );
};

export default HeroSection;