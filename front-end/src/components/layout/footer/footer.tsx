import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 py-12 mt-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center mb-4">
                            <img src="/images/img_logo_1.png" alt="NLU Pet Shop Logo" className="w-12 h-10" />
                            <span className="ml-2 text-xl font-bold">NLU Pet Shop</span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Cửa hàng thú cưng hàng đầu với đầy đủ sản phẩm chất lượng cao cho thú cưng của bạn.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 hover:text-[#fd7e14]">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-[#fd7e14]">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-[#fd7e14]">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                        <ul className="space-y-2">
                            <li><Link to="/category/accessories" className="text-gray-600 hover:text-[#fd7e14]">Phụ kiện</Link></li>
                            <li><Link to="/category/food" className="text-gray-600 hover:text-[#fd7e14]">Thức ăn</Link></li>
                            <li><Link to="/category/furniture" className="text-gray-600 hover:text-[#fd7e14]">Nội thất</Link></li>
                            <li><Link to="/category/bags" className="text-gray-600 hover:text-[#fd7e14]">Túi</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Thú cưng</h3>
                        <ul className="space-y-2">
                            <li><Link to="/pets/cats" className="text-gray-600 hover:text-[#fd7e14]">Mèo</Link></li>
                            <li><Link to="/pets/dogs" className="text-gray-600 hover:text-[#fd7e14]">Chó</Link></li>
                            <li><Link to="/pets/hamsters" className="text-gray-600 hover:text-[#fd7e14]">Hamster</Link></li>
                            <li><Link to="/pets/parrots" className="text-gray-600 hover:text-[#fd7e14]">Vẹt</Link></li>
                            <li><Link to="/pets/rabbits" className="text-gray-600 hover:text-[#fd7e14]">Thỏ</Link></li>
                            <li><Link to="/pets/turtles" className="text-gray-600 hover:text-[#fd7e14]">Rùa</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <img src="/images/img_mappin.svg" alt="Location" className="w-5 h-5 mr-2" />
                                <span className="text-gray-600">Thủ Đức, Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center">
                                <img src="/images/img_phone.svg" alt="Phone" className="w-5 h-5 mr-2" />
                                <span className="text-gray-600">+379 871-8371</span>
                            </li>
                            <li className="flex items-center">
                                <img src="/images/img_mail.svg" alt="Email" className="w-5 h-5 mr-2" />
                                <span className="text-gray-600">nhom12@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 text-center">
                    <p className="text-gray-600">© 2023 NLU Pet Shop. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;