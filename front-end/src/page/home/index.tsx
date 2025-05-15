import React, { useState } from 'react';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';

import CategorySection from './CategorySection';
import PromoSection from './PromoSection';
import BestsellersSection from './BestsellersSection';
import PetTypeSection from './PetTypeSection';

const HomePage: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleBuyNowClick = () => {
        window.location.href = '/products';
    };

    // Category data
    const categories = [
        {
            id: 'accessories',
            name: 'Phụ kiện',
            image: '/images/img_downloadjpg.png',
            productCount: '84 sản phẩm'
        },
        {
            id: 'food',
            name: 'Thức ăn',
            image: '/images/img_downloadjpg_216x306.png',
            productCount: '64 sản phẩm'
        },
        {
            id: 'furniture',
            name: 'Nội thất',
            image: '/images/img_downloadjpg_1.png',
            productCount: '22 sản phẩm'
        },
        {
            id: 'bags',
            name: 'Túi',
            image: '/images/img_downloadjpg_2.png',
            productCount: '22 sản phẩm'
        }
    ];

    // Bestselling products data
    const bestsellers = [
        {
            id: 'product1',
            name: 'Bát ăn cho mèo PetSafe',
            price: '49.000 vnđ',
            image: '/images/img_imagesjpg.png'
        },
        {
            id: 'product2',
            name: 'Bát ăn cho chó Ferplast',
            price: '129.000 vnđ',
            image: '/images/img_imagesjpg_1.png'
        },
        {
            id: 'product3',
            name: 'Dây dắt chó Hagen',
            price: '99.000 vnđ',
            image: '/images/img_imagesjpg_2.png'
        },
        {
            id: 'product4',
            name: 'Thức ăn cho mèo cao cấp CATS LOVE',
            price: '249.000 VNĐ',
            image: '/images/img_imagesjpg_305x290.png'
        },
        {
            id: 'product5',
            name: 'Bát ăn cho chó Omlet',
            price: '49.000 VNĐ',
            image: '/images/img_imagesjpg_3.png'
        },
        {
            id: 'product6',
            name: 'Thức ăn cho chó hãng Omni',
            price: '169.000 VNĐ',
            image: '/images/img_imagesjpg_4.png'
        },
        {
            id: 'product7',
            name: 'Giường cho chó Ferplast',
            price: '399.000 VNĐ',
            image: '/images/img_downloadjpg_305x306.png'
        },
        {
            id: 'product8',
            name: 'Thức ăn cho chó hãng Jinx',
            price: '269.000 VNĐ',
            image: '/images/img_imagesjpg_5.png'
        }
    ];

    // Pet types data
    const petTypes = [
        {
            id: 'cat',
            name: 'Mèo',
            image: '/images/img_img_188x196.png',
            backgroundImage: '/images/img_vector_187x180.png'
        },
        {
            id: 'hamster',
            name: 'Hamster',
            image: '/images/img_img_191x158.png',
            backgroundImage: '/images/img_vector_1.svg'
        },
        {
            id: 'dog',
            name: 'Chó',
            image: '/images/img_img_192x192.png',
            backgroundImage: '/images/img_vector_1.svg'
        },
        {
            id: 'parrot',
            name: 'Vẹt',
            image: '/images/img_img_180x180.png',
            backgroundImage: '/images/img_vector_1.svg'
        },
        {
            id: 'rabbit',
            name: 'Thỏ',
            image: '/images/img_img_205x205.png',
            backgroundImage: '/images/img_vector_1.svg'
        },
        {
            id: 'turtle',
            name: 'Rùa',
            image: '/images/img_img_154x220.png',
            backgroundImage: '/images/img_vector_1.svg'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header onLoginClick={handleLoginClick} />

            <main className="flex-grow">
                <div className="bg-[#f8f9fa] relative overflow-hidden">
                    <div className="container mx-auto px-4 py-16 relative z-10">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2">
                                <span className="text-[#fd7e14] font-bold text-base uppercase">NLU Pet shop</span>
                                <h1 className="text-5xl font-bold mt-2 mb-8">Cửa hàng thú cưng có mọi thứ bạn cần</h1>
                                <button
                                    onClick={handleBuyNowClick}
                                    className="bg-black text-white px-10 py-4 rounded-xl font-semibold text-xl"
                                >
                                    Mua ngay
                                </button>
                            </div>
                            <div className="md:w-1/2 relative mt-8 md:mt-0">
                                <img src="/images/img_shapespattern.svg" alt="Background Pattern" className="absolute right-0 top-0 z-0" />
                                <img src="/images/img_shape.png" alt="Shape" className="absolute left-0 top-0 z-0" />
                                <img src="/images/img_img_204x204.png" alt="Pet" className="absolute left-0 top-20 z-10" />
                                <img src="/images/img_aiartabeautifulgoldenretrieversitsgracefullyonapristi9618340864dd49f29f2b7bf0731e16ba_1.png" alt="Golden Retriever" className="absolute right-0 top-0 z-20" />
                                <img src="/images/img_1734976654ba38b9535c6459993d2f5f48ade644a_1.png" alt="Pet" className="absolute right-20 top-40 z-10" />
                                <img src="/images/img_img.png" alt="Pet" className="absolute right-0 bottom-0 z-30" />
                                <img src="/images/img_shape_69x183.png" alt="Shape" className="absolute left-40 bottom-0 z-0" />
                            </div>
                        </div>
                    </div>
                </div>

                <CategorySection categories={categories} />

                <PromoSection />

                <BestsellersSection products={bestsellers} />

                <PetTypeSection petTypes={petTypes} />
            </main>

            <Footer />

            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6">Đăng nhập</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fd7e14]"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fd7e14]"
                                    placeholder="Nhập mật khẩu của bạn"
                                />
                            </div>
                            <div className="flex justify-between mb-6">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span>Ghi nhớ đăng nhập</span>
                                </label>
                                <a href="#" className="text-[#fd7e14]">Quên mật khẩu?</a>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#fd7e14] text-white py-2 rounded-md font-medium hover:bg-[#e76b00]"
                            >
                                Đăng nhập
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <p>Chưa có tài khoản? <a href="#" className="text-[#fd7e14]">Đăng ký ngay</a></p>
                        </div>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;