import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputField from "../../ui/InputField";
import logo from "../../../assets/logo.png";
import { HiOutlinePhone } from "react-icons/hi2";
import { MdOutlineEmail } from "react-icons/md";
import { CiLocationOn, CiHeart, CiShoppingCart } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { useAuth } from "../../../contexts/AuthContext";

const Header: React.FC = () => {
  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/products", label: "Sản phẩm" },
    { to: "/forum", label: "Diễn đàn" },
    { to: "/about", label: "Giới thiệu" },
    { to: "/contact", label: "Liên hệ" },
  ];

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();
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
              <span className="ml-2 text-base font-medium">
                nhom12@gmail.com
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <CiLocationOn className="w-6 h-6" />
            <span className="ml-2 text-base font-medium">
              Thủ Đức, Hồ Chí Minh
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 flex justify-between items-center shadow-md rounded-[40px] bg-white">
        <div className="flex items-center">
          <img
            src={logo}
            alt="NLU Pet Shop Logo"
            className="w-[72px] h-[58px]"
          />
          <span className="ml-2 text-xl font-bold">NLU Pet Shop</span>
        </div>

        <nav className="flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-2xl font-medium ${
                  isActive(link.to)
                    ? "text-[#fd7e14] border-b border-[#fd7e14] pb-1 font-semibold"
                    : "text-black hover:text-[#fd7e14]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center text-base font-medium text-black hover:text-[#fd7e14]"
              >
                <FaUserCircle className="w-5 h-5 mr-1" />
                {username}
              </button>
              <button
                onClick={logout}
                className="text-base font-medium text-black hover:text-[#fd7e14]"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-xl font-medium text-black hover:text-[#fd7e14] cursor-pointer"
            >
              Đăng nhập
            </button>
          )}
          <div className="relative ">
            <InputField
              placeholder="Tìm kiếm sản phẩm..."
              className="bg-[#f8f9fa] rounded-[20px] w-[280px] h-18 pl-4 pr-2"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <IoSearchCircle className="w-7 h-7 rounded-full" />
            </div>
          </div>

          <div className="relative">
            <CiHeart className="w-7 h-7" />
            <div className="absolute -top-2 -right-2 bg-[#fd7e14] text-white text-[10px] w-3 h-3 rounded-full flex items-center justify-center ">
              0
            </div>
          </div>

          <div className="relative ml-4">
            <CiShoppingCart className="w-7 h-7" />
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
