// import React from "react";
// import { BsChatRight } from "react-icons/bs";
// import { MdRemoveRedEye } from "react-icons/md";

// export const Body = (): JSX.Element => {
//   return (
//     <div className="flex w-[1920px] items-start justify-center gap-[50px] px-[312px] py-5 absolute top-40 left-0 bg-[#f8f9fa]">
//       <div className="flex flex-col w-[905px] items-start justify-center gap-10 pt-[30px] pb-0 px-0 relative">
//         <div className="relative self-stretch w-full h-[63px] bg-white shadow-[0px_4px_4px_#00000040]">
//           <div className="relative w-[826px] h-[46px] top-[9px] left-10">
//             <div className="inline-flex gap-1.5 absolute top-0 left-0 bg-white flex-col items-start">
//               <p className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-5 whitespace-nowrap">
//                 Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo
//                 v ạ?
//               </p>

//               <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5 whitespace-nowrap">
//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   Được đăng bởi{" "}
//                 </span>

//                 <span className="font-bold">Hữu Thức</span>

//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   {" "}
//                   cách đây 20 phút
//                 </span>
//               </p>
//             </div>

//             <div className="flex flex-col w-[43px] h-[42px] items-center gap-[3px] absolute top-0 left-[783px] bg-white">
//               <RemoveRedEye5 className="!relative !w-6 !h-6" />
//               <img
//                 className="relative w-[42.15px] h-[8.47px]"
//                 alt="Element views"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/60-views.png"
//               />
//             </div>

//             <div className="flex flex-col w-[46px] h-[45px] items-center justify-center gap-[3px] absolute top-0 left-[716px] bg-white">
//               <ChatBubbleOutline2 className="!relative !w-[24.49px] !h-[24.62px]" />
//               <img
//                 className="relative w-[46.65px] h-[11.05px] ml-[-0.34px] mr-[-0.34px]"
//                 alt="Element replys"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/30-replys.png"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="relative self-stretch w-full h-[63px] bg-white shadow-[0px_4px_4px_#00000040]">
//           <div className="relative w-[826px] h-[46px] top-[9px] left-10">
//             <div className="inline-flex gap-1.5 absolute top-0 left-0 bg-white flex-col items-start">
//               <p className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-5 whitespace-nowrap">
//                 Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo
//                 v ạ?
//               </p>

//               <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5 whitespace-nowrap">
//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   Được đăng bởi{" "}
//                 </span>

//                 <span className="font-bold">Hữu Thức</span>

//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   {" "}
//                   cách đây 20 phút
//                 </span>
//               </p>
//             </div>

//             <div className="flex flex-col w-[43px] h-[42px] items-center gap-[3px] absolute top-0 left-[783px] bg-white">
//               <RemoveRedEye5 className="!relative !w-6 !h-6" />
//               <img
//                 className="relative w-[42.15px] h-[8.47px]"
//                 alt="Element views"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/60-views-1.png"
//               />
//             </div>

//             <div className="flex flex-col w-[46px] h-[45px] items-center justify-center gap-[3px] absolute top-0 left-[716px] bg-white">
//               <ChatBubbleOutline2 className="!relative !w-[24.49px] !h-[24.62px]" />
//               <img
//                 className="relative w-[46.65px] h-[11.05px] ml-[-0.34px] mr-[-0.34px]"
//                 alt="Element replys"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/30-replys-1.png"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="relative self-stretch w-full h-[63px] bg-white shadow-[0px_4px_4px_#00000040]">
//           <div className="relative w-[826px] h-[46px] top-[9px] left-10">
//             <div className="inline-flex gap-1.5 absolute top-0 left-0 bg-white flex-col items-start">
//               <p className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-5 whitespace-nowrap">
//                 Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo
//                 v ạ?
//               </p>

//               <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5 whitespace-nowrap">
//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   Được đăng bởi{" "}
//                 </span>

//                 <span className="font-bold">Hữu Thức</span>

//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   {" "}
//                   cách đây 20 phút
//                 </span>
//               </p>
//             </div>

//             <div className="flex flex-col w-[43px] h-[42px] items-center gap-[3px] absolute top-0 left-[783px] bg-white">
//               <RemoveRedEye5 className="!relative !w-6 !h-6" />
//               <img
//                 className="relative w-[42.15px] h-[8.47px]"
//                 alt="Element views"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/60-views-2.png"
//               />
//             </div>

//             <div className="flex flex-col w-[46px] h-[45px] items-center justify-center gap-[3px] absolute top-0 left-[716px] bg-white">
//               <ChatBubbleOutline2 className="!relative !w-[24.49px] !h-[24.62px]" />
//               <img
//                 className="relative w-[46.65px] h-[11.05px] ml-[-0.34px] mr-[-0.34px]"
//                 alt="Element replys"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/30-replys-2.png"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="relative self-stretch w-full h-[63px] bg-white shadow-[0px_4px_4px_#00000040]">
//           <div className="relative w-[826px] h-[46px] top-[9px] left-10">
//             <div className="inline-flex gap-1.5 absolute top-0 left-0 bg-white flex-col items-start">
//               <p className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-5 whitespace-nowrap">
//                 Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo
//                 v ạ?
//               </p>

//               <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5 whitespace-nowrap">
//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   Được đăng bởi{" "}
//                 </span>

//                 <span className="font-bold">Hữu Thức</span>

//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   {" "}
//                   cách đây 20 phút
//                 </span>
//               </p>
//             </div>

//             <div className="flex flex-col w-[43px] h-[42px] items-center gap-[3px] absolute top-0 left-[783px] bg-white">
//               <RemoveRedEye5 className="!relative !w-6 !h-6" />
//               <img
//                 className="relative w-[42.15px] h-[8.47px]"
//                 alt="Element views"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/60-views-3.png"
//               />
//             </div>

//             <div className="flex flex-col w-[46px] h-[45px] items-center justify-center gap-[3px] absolute top-0 left-[716px] bg-white">
//               <ChatBubbleOutline2 className="!relative !w-[24.49px] !h-[24.62px]" />
//               <img
//                 className="relative w-[46.65px] h-[11.05px] ml-[-0.34px] mr-[-0.34px]"
//                 alt="Element replys"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/30-replys-3.png"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="relative self-stretch w-full h-[63px] bg-white shadow-[0px_4px_4px_#00000040]">
//           <div className="relative w-[826px] h-[46px] top-[9px] left-10">
//             <div className="inline-flex gap-1.5 absolute top-0 left-0 bg-white flex-col items-start">
//               <p className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-5 whitespace-nowrap">
//                 Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo
//                 v ạ?
//               </p>

//               <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5 whitespace-nowrap">
//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   Được đăng bởi{" "}
//                 </span>

//                 <span className="font-bold">Hữu Thức</span>

//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   {" "}
//                   cách đây 20 phút
//                 </span>
//               </p>
//             </div>

//             <div className="flex flex-col w-[43px] h-[42px] items-center gap-[3px] absolute top-0 left-[783px] bg-white">
//               <RemoveRedEye5 className="!relative !w-6 !h-6" />
//               <img
//                 className="relative w-[42.15px] h-[8.47px]"
//                 alt="Element views"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/60-views-4.png"
//               />
//             </div>

//             <div className="flex flex-col w-[46px] h-[45px] items-center justify-center gap-[3px] absolute top-0 left-[716px] bg-white">
//               <ChatBubbleOutline2 className="!relative !w-[24.49px] !h-[24.62px]" />
//               <img
//                 className="relative w-[46.65px] h-[11.05px] ml-[-0.34px] mr-[-0.34px]"
//                 alt="Element replys"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/30-replys-4.png"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="relative self-stretch w-full h-[63px] bg-white shadow-[0px_4px_4px_#00000040]">
//           <div className="relative w-[826px] h-[46px] top-[9px] left-10">
//             <div className="inline-flex gap-1.5 absolute top-0 left-0 bg-white flex-col items-start">
//               <p className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-5 whitespace-nowrap">
//                 Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo
//                 v ạ?
//               </p>

//               <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5 whitespace-nowrap">
//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   Được đăng bởi{" "}
//                 </span>

//                 <span className="font-bold">Hữu Thức</span>

//                 <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//                   {" "}
//                   cách đây 20 phút
//                 </span>
//               </p>
//             </div>

//             <div className="flex flex-col w-[43px] h-[42px] items-center gap-[3px] absolute top-0 left-[783px] bg-white">
//               <RemoveRedEye5 className="!relative !w-6 !h-6" />
//               <img
//                 className="relative w-[42.15px] h-[8.47px]"
//                 alt="Element views"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/60-views-5.png"
//               />
//             </div>

//             <div className="flex flex-col w-[46px] h-[45px] items-center justify-center gap-[3px] absolute top-0 left-[716px] bg-white">
//               <ChatBubbleOutline2 className="!relative !w-[24.49px] !h-[24.62px]" />
//               <img
//                 className="relative w-[46.65px] h-[11.05px] ml-[-0.34px] mr-[-0.34px]"
//                 alt="Element replys"
//                 src="https://c.animaapp.com/maw9dh5f1S7yIU/img/30-replys-5.png"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col w-[334px] items-center gap-2.5 pt-[30px] pb-2.5 px-[30px] relative bg-white shadow-[0px_4px_4px_#00000040]">
//         <div className="relative w-[191px] h-5">
//           <p className="absolute top-0 left-0 [font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-5 whitespace-nowrap">
//             Bài đăng hot trong tuần
//           </p>
//         </div>

//         <div className="relative w-[304px] h-[73px] ml-[-15.00px] mr-[-15.00px] bg-[#ffffff80] rounded-[5px] border border-solid border-black shadow-[0px_4px_4px_#00000040]">
//           <div className="flex w-[274px] relative top-1.5 left-3.5 flex-col items-start">
//             <p className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//               Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo v
//               ạ?
//             </p>

//             <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5 whitespace-nowrap">
//               <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5">
//                 Được đăng bởi{" "}
//               </span>

//               <span className="font-bold">Hữu Thức</span>

//               <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5">
//                 {" "}
//                 cách đây 20 phút
//               </span>
//             </p>
//           </div>
//         </div>

//         <div className="relative w-[304px] h-[73px] ml-[-15.00px] mr-[-15.00px] bg-[#ffffff80] rounded-[5px] border border-solid border-black shadow-[0px_4px_4px_#00000040]">
//           <div className="flex w-[274px] relative top-1.5 left-3.5 flex-col items-start">
//             <p className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//               Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo v
//               ạ?
//             </p>

//             <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5 whitespace-nowrap">
//               <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5">
//                 Được đăng bởi{" "}
//               </span>

//               <span className="font-bold">Hữu Thức</span>

//               <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5">
//                 {" "}
//                 cách đây 20 phút
//               </span>
//             </p>
//           </div>
//         </div>

//         <div className="relative w-[304px] h-[73px] ml-[-15.00px] mr-[-15.00px] bg-[#ffffff80] rounded-[5px] border border-solid border-black shadow-[0px_4px_4px_#00000040]">
//           <div className="flex w-[274px] relative top-1.5 left-3.5 flex-col items-start">
//             <p className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//               Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo v
//               ạ?
//             </p>

//             <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5 whitespace-nowrap">
//               <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5">
//                 Được đăng bởi{" "}
//               </span>

//               <span className="font-bold">Hữu Thức</span>

//               <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5">
//                 {" "}
//                 cách đây 20 phút
//               </span>
//             </p>
//           </div>
//         </div>

//         <div className="relative w-[304px] h-[73px] ml-[-15.00px] mr-[-15.00px] bg-[#ffffff80] rounded-[5px] border border-solid border-black shadow-[0px_4px_4px_#00000040]">
//           <div className="flex w-[274px] relative top-1.5 left-3.5 flex-col items-start">
//             <p className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-black text-xs tracking-[0] leading-5">
//               Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo v
//               ạ?
//             </p>

//             <p className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5 whitespace-nowrap">
//               <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5">
//                 Được đăng bởi{" "}
//               </span>

//               <span className="font-bold">Hữu Thức</span>

//               <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-[8px] tracking-[0] leading-5">
//                 {" "}
//                 cách đây 20 phút
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

