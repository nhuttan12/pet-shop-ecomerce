
// export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../../assets/logo.png";
import { FaFacebook, FaInstagramSquare,FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-40 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-start">
          {/* Company Info */}
          <div>
            <div className="flex items-center">
              <img src={logo} alt="NLU Pet Shop" className="h-[50px] mb-4" />
              <h3 className="text-xl font-bold mb-4">NLU Pet Shop</h3>
            </div>
            <p className="text-base mb-4">
              Phụ kiện tiện ích, chăm sóc toàn diện.<br />
              Phụ kiện thú cưng đa dạng, chất lượng cao.<br />
              Nâng tầm phong cách cho thú cưng của bạn.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaSquareXTwitter className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagramSquare className="w-6 h-6" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="px-4">
            <h3 className="text-base font-semibold mb-5 mt-4">Công ty</h3>
            <ul className="space-y-6">
              <li><Link to="/about" className="text-base">Giới thiệu</Link></li>
              <li><Link to="/blog" className="text-base">Nhật ký trực tuyến</Link></li>
              <li><Link to="/gift-cards" className="text-base">Thẻ quà tặng</Link></li>
              <li><Link to="/careers" className="text-base">Tuyển dụng</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-base font-semibold mb-5 mt-4">Liên kết hữu ích</h3>
            <ul className="space-y-6">
              <li><Link to="/new-products" className="text-base">Sản phẩm mới</Link></li>
              <li><Link to="/best-sellers" className="text-base">Sản phẩm bán chạy</Link></li>
              <li><Link to="/discounts" className="text-base">Giảm giá</Link></li>
              <li><Link to="/faq" className="text-base">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-base font-semibold mb-5 mt-4">Dịch vụ khách hàng</h3>
            <ul className="space-y-6">
              <li><Link to="/contact" className="text-base">Liên hệ chúng tôi</Link></li>
              <li><Link to="/shipping" className="text-base">Vận chuyển</Link></li>
              <li><Link to="/returns" className="text-base">Trả hàng</Link></li>
              <li><Link to="/order-tracking" className="text-base">Theo dõi đơn hàng</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-5 mt-4">Liên hệ</h3>
            <p className="text-base font-medium mb-6">
              Khu phố 6, Phường Linh Trung, <br />
              TP.Thủ Đức, TP.HCM
            </p>
            <p className="text-base font-medium mb-6">+84 33 645 709</p>
            <p className="text-base font-medium">petshop@gmail.com</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">@ 2025 NLU Pet Shop. Tp.HCM</p>
          <div className="mt-4 md:mt-0">
            <img src="/images/img_paymenticons_1.svg" alt="Payment Methods" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



// import React from 'react';
// import { Link } from 'react-router-dom';
// import logo from "../../../assets/logo.png"

// const Footer: React.FC = () => {
//     return (
//         <footer className="bg-gray-100 py-12 mt-16">
//             <div className="container mx-auto px-4">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                     <div>
//                         <div className="flex items-center mb-4">
//                             <img src={logo} alt="NLU Pet Shop Logo" className="w-12 h-10" />
//                             <span className="ml-2 text-xl font-bold">NLU Pet Shop</span>
//                         </div>
//                         <p className="text-gray-600 mb-4">
//                             Cửa hàng thú cưng hàng đầu với đầy đủ sản phẩm chất lượng cao cho thú cưng của bạn.
//                         </p>
//                         <div className="flex space-x-4">
//                             <a href="#" className="text-gray-600 hover:text-[#fd7e14]">
//                                 <i className="fab fa-facebook-f"></i>
//                             </a>
//                             <a href="#" className="text-gray-600 hover:text-[#fd7e14]">
//                                 <i className="fab fa-twitter"></i>
//                             </a>
//                             <a href="#" className="text-gray-600 hover:text-[#fd7e14]">
//                                 <i className="fab fa-instagram"></i>
//                             </a>
//                         </div>
//                     </div>

//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
//                         <ul className="space-y-2">
//                             <li><Link to="/category/accessories" className="text-gray-600 hover:text-[#fd7e14]">Phụ kiện</Link></li>
//                             <li><Link to="/category/food" className="text-gray-600 hover:text-[#fd7e14]">Thức ăn</Link></li>
//                             <li><Link to="/category/furniture" className="text-gray-600 hover:text-[#fd7e14]">Nội thất</Link></li>
//                             <li><Link to="/category/bags" className="text-gray-600 hover:text-[#fd7e14]">Túi</Link></li>
//                         </ul>
//                     </div>

//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Thú cưng</h3>
//                         <ul className="space-y-2">
//                             <li><Link to="/pets/cats" className="text-gray-600 hover:text-[#fd7e14]">Mèo</Link></li>
//                             <li><Link to="/pets/dogs" className="text-gray-600 hover:text-[#fd7e14]">Chó</Link></li>
//                             <li><Link to="/pets/hamsters" className="text-gray-600 hover:text-[#fd7e14]">Hamster</Link></li>
//                             <li><Link to="/pets/parrots" className="text-gray-600 hover:text-[#fd7e14]">Vẹt</Link></li>
//                             <li><Link to="/pets/rabbits" className="text-gray-600 hover:text-[#fd7e14]">Thỏ</Link></li>
//                             <li><Link to="/pets/turtles" className="text-gray-600 hover:text-[#fd7e14]">Rùa</Link></li>
//                         </ul>
//                     </div>

//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
//                         <ul className="space-y-2">
//                             <li className="flex items-center">
//                                 <img src="/images/img_mappin.svg" alt="Location" className="w-5 h-5 mr-2" />
//                                 <span className="text-gray-600">Thủ Đức, Hồ Chí Minh</span>
//                             </li>
//                             <li className="flex items-center">
//                                 <img src="/images/img_phone.svg" alt="Phone" className="w-5 h-5 mr-2" />
//                                 <span className="text-gray-600">+379 871-8371</span>
//                             </li>
//                             <li className="flex items-center">
//                                 <img src="/images/img_mail.svg" alt="Email" className="w-5 h-5 mr-2" />
//                                 <span className="text-gray-600">nhom12@gmail.com</span>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>

//                 <div className="border-t border-gray-200 mt-8 pt-8 text-center">
//                     <p className="text-gray-600">© 2023 NLU Pet Shop. Tất cả các quyền được bảo lưu.</p>
//                 </div>
//             </div>
//         </footer>
//     );
// };