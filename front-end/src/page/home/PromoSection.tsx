import React from 'react';
import Button from '../../components/ui/Button';
import banner1 from '../../assets/banner1.jpg';

const PromoSection: React.FC = () => {
    return (
        <section className="bg-[#f8f9fa] py-16 relative overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative z-10">
                        <div className="relative">
                            <img src={banner1} className="absolute left-0 top-0 w-[350px] h-auto" />
                        </div>
                    </div>

                    <div className="md:w-1/2 md:pl-12 mt-12 md:mt-0 relative z-10">
                        <span className="text-[#fd7e14] font-bold text-base uppercase">Pet shop</span>
                        <h2 className="text-4xl font-bold mt-4 mb-8">Cách thông minh hơn để mua sắm<br />cho thú cưng của bạn</h2>
                        <Button
                            variant="secondary"
                            // size="large"
                            onClick={() => window.location.href = '/products'}
                        >
                            Xem thêm
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoSection;