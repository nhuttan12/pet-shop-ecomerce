import React from 'react';
import Button from '../ui/Button';

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    buttonText: string;
    onButtonClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
                                                     title,
                                                     subtitle,
                                                     buttonText,
                                                     onButtonClick = () => {},
                                                 }) => {
    return (
        <section className="relative py-16 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl">
                    {subtitle && (
                        <h2 className="text-base font-bold text-[#fd7e14] uppercase mb-2">
                            {subtitle}
                        </h2>
                    )}
                    <h1 className="text-5xl font-bold text-black mb-8">
                        {title}
                    </h1>
                    <Button
                        onClick={onButtonClick}
                        className="bg-black text-white px-10 py-4 rounded-xl font-semibold text-xl"
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
            <div className="absolute top-0 right-0 z-0">
                <img src="/images/img_shapespattern.svg" alt="Background Pattern" className="w-full h-auto" />
            </div>
        </section>
    );
};

export default HeroSection;