// // components/HotPostCard.tsx
// import React from "react";
// import { Post } from "../../../types/Forum";

// interface HotPostCardProps {
//   post: Post;
// }

// const HotPostCard: React.FC<HotPostCardProps> = ({ post }) => {
//   return (
//     <div className="w-[304px] h-[73px] bg-[#ffffff80] rounded-[5px] border border-black shadow-md px-3 py-2">
//       <p className="text-xs text-black leading-5">{post.content}</p>
//       <p className="text-[8px] text-black leading-5">
//         Được đăng bởi <span className="font-bold">{post.author}</span> {post.timeAgo}
//       </p>
//     </div>
//   );
// };

// export default HotPostCard;
// components/HotPostCard.tsx
import React from "react";
import { Post } from "../../../types/Forum";

interface HotPostCardProps {
  post: Post;
}

const HotPostCard: React.FC<HotPostCardProps> = ({ post }) => {
  return (
    <div className="w-[304px] h-[73px] bg-[#ffffff80] rounded-[5px] border border-black shadow-md px-3 py-2">
      <p className="text-sm font-semibold text-black leading-5">{post.title}</p> {/* Tiêu đề */}
      <p className="text-xs text-black leading-5">{post.content}</p>
      <p className="text-[8px] text-black leading-5">
        Được đăng bởi <span className="font-bold">{post.author}</span> {post.timeAgo}
      </p>
    </div>
  );
};

export default HotPostCard;
