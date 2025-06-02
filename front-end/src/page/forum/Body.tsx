// components/Body.tsx
import React from "react";
import PostItem from "./PostItem";
import HotPostCard from "./HotPostCart";
import { Post } from "../../types/Forum";

const samplePosts: Post[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  content: "Mọi người thường chọn phụ kiện nào đầu tiên khi mới nuôi chó/mèo v ạ?",
  author: "Hữu Thức",
  timeAgo: "cách đây 20 phút",
  views: 60,
  replies: 30,
}));

const Body: React.FC = () => {
  return (
    <div className="flex w-[1920px] items-start justify-center gap-[50px] px-[312px] py-5 top-40 left-0 bg-[#f8f9fa]">
      {/* LEFT */}
      <div className="flex flex-col w-[905px] gap-10 pt-[30px]">
        {samplePosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex flex-col w-[334px] items-center gap-2.5 pt-[30px] px-[30px] bg-white shadow-md">
        <p className="text-base font-normal text-black">Bài đăng hot trong tuần</p>

        {samplePosts.slice(0, 4).map((post) => (
          <HotPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Body;