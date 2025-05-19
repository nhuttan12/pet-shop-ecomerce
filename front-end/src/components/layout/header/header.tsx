import React from 'react';
import { Link } from 'react-router-dom';
import InputField from '../../ui/InputField';
import logo from "../../../assets/logo.png"
import { HiOutlinePhone } from "react-icons/hi2";
import { MdOutlineEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";

interface HeaderProps {
    onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick = () => {} }) => {
    return (
        <header className="bg-white">
            <div className="bg-[#f8f9fa] py-6">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <HiOutlinePhone className="w-6 h-6" />
                            <span className="ml-2 text-base font-medium">+379 871-8371</span>
                        </div>
                        <div className="flex items-center ml-6">
                            <MdOutlineEmail className="w-6 h-6" />
                            <span className="ml-2 text-base font-medium">nhom12@gmail.com</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <CiLocationOn className="w-6 h-6" />
                        <span className="ml-2 text-base font-medium">Thủ Đức, Hồ Chí Minh</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 flex justify-between items-center shadow-md rounded-[40px] bg-white">
                <div className="flex items-center">
                    <img src={logo} alt="NLU Pet Shop Logo" className="w-[72px] h-[58px]" />
                    <span className="ml-2 text-xl font-bold">NLU Pet Shop</span>
                </div>

                <nav className="flex items-center space-x-8">
                    <Link to="/" className="text-xl font-semibold text-[#fd7e14] border-b border-[#fd7e14] pb-1">
                        Trang chủ
                    </Link>
                    <Link to="/products" className="text-xl font-medium text-black hover:text-[#fd7e14]">
                        Sản phẩm
                    </Link>
                    <Link to="/forum" className="text-xl font-medium text-black hover:text-[#fd7e14]">
                        Diễn dàn
                    </Link>
                    <Link to="/posts" className="text-xl font-medium text-black hover:text-[#fd7e14]">
                        Bài đăng
                    </Link>
                    <Link to="/about" className="text-xl font-medium text-black hover:text-[#fd7e14]">
                        Giới thiệu
                    </Link>
                    <Link to="/contact" className="text-xl font-medium text-black hover:text-[#fd7e14]">
                        Liên hệ
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={onLoginClick}
                        className="border-2 border-black rounded px-4 py-2 text-lg"
                    >
                        Đăng nhập
                    </button>

                    <div className="relative">
                        <InputField
                            placeholder="Tìm kiếm sản phẩm..."
                            className="bg-[#f8f9fa] rounded-[20px] w-[280px]"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <img src="/images/img_iconbg.svg" alt="Search" className="w-7 h-7 rounded-full" />
                        </div>
                    </div>

                    <div className="relative">
                        <img src="/images/img_vector.svg" alt="Wishlist" className="w-5 h-5" />
                        <div className="absolute -top-2 -right-2 bg-[#fd7e14] text-white text-[10px] w-3 h-3 rounded-full flex items-center justify-center">
                            0
                        </div>
                    </div>

                    <div className="relative ml-4">
                        <img src="/images/img_vector_15x22.svg" alt="Cart" className="w-[15px] h-[22px]" />
                        <div className="absolute -top-2 -right-2 bg-[#fd7e14] text-white text-[10px] w-3 h-3 rounded-full flex items-center justify-center">
                            0
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;