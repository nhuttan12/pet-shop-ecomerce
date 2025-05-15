import React from 'react';
import Button from '../../components/ui/Button';

const PromoSection: React.FC = () => {
    return (
        <section className="bg-[#f8f9fa] py-16 relative overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 relative z-10">
                    <div className="relative">
                        <img src="/images/img_cat_1.png" alt="Cat" className="absolute left-0 top-0 w-[350px] h-auto" />
                        <img src="/images/img_cat_2.png" alt="Cat" className="relative ml-32 mt-8 w-[366px] h-auto" />
                    </div>
                </div>

                <div className="md:w-1/2 md:pl-12 mt-12 md:mt-0 relative z-10">
                    <span className="text-[#fd7e14] font-bold text-base uppercase">Pet shop</span>
                    <h2 className="text-4xl font-bold mt-4 mb-8">Cách thông minh hơn để mua sắm<br />cho thú cưng của bạn</h2>
                    <Button
                        variant="secondary"
                        size="large"
                        onClick={() => window.location.href = '/products'}
                    >
                        Xem thêm
                    </Button>
                </div>
            </div>

            <div className="absolute left-0 top-0 w-full h-full overflow-hidden">
                <img src="/images/img_vector_537x1065.svg" alt="Background Pattern" className="absolute left-32 top-12" />
                <img src="/images/img_shape_589x567.png" alt="Shape" className="absolute left-[344px] top-[136px] w-[443px]" />
                <img src="/images/img_shape_117x114.png" alt="Shape" className="absolute left-[540px] top-[148px]" />
                <img src="/images/img_shape_123x120.png" alt="Shape" className="absolute left-[664px] top-[275px]" />
            </div>
        </section>
    );
};

export default PromoSection;